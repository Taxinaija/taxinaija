# Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     TaxiNaija Application                    │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐                        ┌──────────────┐   │
│  │  Driver App  │                        │  Rider App   │   │
│  └──────┬───────┘                        └──────┬───────┘   │
│         │                                       │           │
│         └───────────────┬───────────────────────┘           │
│                         │                                   │
│                         ▼                                   │
│              ┌────────────────────┐                         │
│              │  Firebase Service  │                         │
│              │   (API Layer)      │                         │
│              └─────────┬──────────┘                         │
│                        │                                    │
└────────────────────────┼────────────────────────────────────┘
                         │
                         ▼
              ┌──────────────────────┐
              │   Firebase Backend   │
              ├──────────────────────┤
              │  - Authentication    │
              │  - Firestore DB      │
              │  - Security Rules    │
              │  - Real-time Sync    │
              └──────────────────────┘
```

## Component Architecture

### Driver App Components

```
DriverApp (Root)
│
├── DriverAuth (Authentication)
│   ├── Sign In Form
│   └── Sign Up Form
│
└── DriverDashboard (Main Interface)
    │
    ├── Header
    │   ├── App Title
    │   ├── Welcome Message
    │   └── Sign Out Button
    │
    ├── Tab Navigation
    │   ├── Available Rides Tab
    │   └── My Rides Tab
    │
    └── Content Area
        │
        ├── Available Rides List
        │   └── RideCard (Type: Available)
        │       ├── Ride Information
        │       └── Accept Button
        │
        └── Active Rides List
            └── RideCard (Type: Active)
                ├── Ride Information
                └── Action Buttons (Start/Complete)
```

## Data Models

### User Document (Firestore)
```javascript
{
  id: string,              // Firebase Auth UID
  name: string,
  email: string,
  phone: string,
  role: 'driver' | 'rider' | 'admin',
  approved: boolean,       // Admin approval status
  createdAt: timestamp,
  // Driver-specific fields
  vehicleInfo?: string
}
```

### Ride Document (Firestore)
```javascript
{
  id: string,              // Auto-generated
  riderId: string,         // Reference to user
  riderName: string,
  riderPhone: string,
  driverId?: string,       // Set when accepted
  pickup: {
    address: string,
    // coordinates: { lat, lng }  // Future enhancement
  },
  destination: {
    address: string,
    // coordinates: { lat, lng }  // Future enhancement
  },
  fare: number,            // In Naira
  status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled',
  createdAt: timestamp,
  acceptedAt?: timestamp,
  startedAt?: timestamp,
  completedAt?: timestamp,
  updatedAt: timestamp
}
```

### Driver Location Document (Firestore)
```javascript
{
  id: string,              // Driver's user ID
  location: {
    // lat: number,         // Future enhancement
    // lng: number          // Future enhancement
  },
  updatedAt: timestamp
}
```

## Firebase Service Layer

### Authentication Functions
- `signUpUser(email, password, userData)` - Create new user account
- `signInUser(email, password)` - Authenticate user
- `signOutUser()` - Sign out current user
- `onAuthChange(callback)` - Listen to auth state changes

### User Management
- `getUserData(userId)` - Get user document
- `updateUserData(userId, data)` - Update user document

### Ride Management (Rider)
- `createRide(rideData)` - Create new ride request
- `getRide(rideId)` - Get single ride
- `updateRideStatus(rideId, status)` - Update ride status

### Ride Management (Driver)
- `getAvailableRides()` - Get all pending rides (one-time)
- `acceptRide(rideId, driverId)` - Accept a ride
- `startRide(rideId)` - Start accepted ride
- `completeRide(rideId)` - Complete in-progress ride

### Real-time Listeners
- `listenToAvailableRides(callback)` - Real-time pending rides
- `listenToRide(rideId, callback)` - Real-time single ride updates
- `listenToDriverRides(driverId, callback)` - Real-time driver's active rides

## Security Architecture

### Firebase Security Rules

```
Authentication Required
        ↓
Role Verification (driver/rider/admin)
        ↓
Approval Check (approved: true)
        ↓
Operation-Specific Checks
        ↓
Data Access Granted
```

### Permission Matrix

| Role | Users (Read) | Users (Write) | Rides (Read) | Rides (Create) | Rides (Update) |
|------|-------------|---------------|--------------|----------------|----------------|
| **Unapproved User** | Own | Own (no approval) | None | None | None |
| **Approved Rider** | All | Own (no approval) | Own rides | Yes | Cancel own |
| **Approved Driver** | All | Own (no approval) | All rides | No | Accept/Start/Complete |
| **Admin** | All | All | All | Yes | All |

### Key Security Features

1. **Admin Approval Required**
   - All new users start with `approved: false`
   - Cannot perform role-specific actions until approved
   - Admin must manually set `approved: true`

2. **Role-Based Access Control**
   - Role determined at signup
   - Cannot self-modify role
   - Admin can change roles

3. **Data Isolation**
   - Users can only see their own rides
   - Drivers see all pending rides
   - Riders see only their requests

4. **Operation Validation**
   - Riders can only cancel their own rides
   - Drivers can only accept available rides
   - Status transitions are validated

## State Management

### Authentication State
- Managed by Firebase Authentication
- Persists across page reloads
- Auto-sync with Firestore user data

### Ride State
- Real-time sync via Firestore listeners
- Automatic updates on changes
- Local state for UI (loading, messages)

### UI State
```javascript
// Component-level state
- loading: boolean           // Button/action loading state
- message: string            // Success/error messages
- tab: 'available' | 'active'  // Active tab
- availableRides: Ride[]     // From listener
- activeRides: Ride[]        // From listener
```

## Data Flow

### Driver Accepts Ride

```
1. User clicks "Accept Ride" button
   ↓
2. DriverDashboard.handleAcceptRide(rideId)
   ↓
3. firebaseService.acceptRide(rideId, driverId)
   ↓
4. Firestore update: { driverId, status: 'accepted', acceptedAt }
   ↓
5. Security rules validate: isDriver() && isApproved()
   ↓
6. Real-time listeners trigger:
   - listenToAvailableRides: ride removed
   - listenToDriverRides: ride added
   ↓
7. Component state updates automatically
   ↓
8. UI re-renders with updated ride lists
```

## Real-time Architecture

### Firestore Listeners

```javascript
// Set up once in useEffect
useEffect(() => {
  const unsubscribe = listenToAvailableRides((rides) => {
    setAvailableRides(rides);  // Auto-updates on changes
  });
  
  return () => unsubscribe();  // Cleanup on unmount
}, []);
```

### Benefits
- No polling required
- Instant updates across devices
- Automatic reconnection
- Efficient bandwidth usage

## Scalability Considerations

### Current Implementation
- Suitable for small to medium deployments
- Free tier: 50k reads/20k writes per day
- Real-time for up to ~100 concurrent users

### Future Enhancements for Scale

1. **Caching Layer**
   - Local storage for static data
   - IndexedDB for offline support

2. **Geospatial Queries**
   - GeoFirestore for location-based ride matching
   - Distance calculations
   - Radius searches

3. **Load Balancing**
   - Firebase Hosting for static assets
   - Cloud Functions for backend logic
   - Database sharding by region

4. **Optimization**
   - Paginated queries
   - Lazy loading
   - Composite indexes

## Error Handling

### Patterns Used

```javascript
// Service layer returns standardized responses
{
  success: boolean,
  data?: any,
  error?: string
}

// Components handle responses consistently
if (result.success) {
  // Show success message
  // Update UI
} else {
  // Show error message
  // Keep UI in previous state
}
```

### Error Recovery
- Automatic retry for network errors (Firebase SDK)
- User feedback for all errors
- Graceful degradation
- Clear error messages

## Future Architecture Considerations

1. **Microservices**
   - Separate services for rides, payments, notifications
   - Cloud Functions for backend logic

2. **Message Queue**
   - Cloud Pub/Sub for async operations
   - Better handling of high traffic

3. **Caching**
   - Redis for hot data
   - CDN for static assets

4. **Analytics**
   - Firebase Analytics integration
   - Custom event tracking
   - User behavior analysis

5. **Monitoring**
   - Error tracking (Sentry)
   - Performance monitoring (Firebase Performance)
   - Uptime monitoring
