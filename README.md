# TaxiNaija - Ride Sharing App for Nigeria

A comprehensive ride-hailing application for Nigeria with separate functionality for riders and drivers.

## Features

### Driver App
- ✅ **User Authentication** - Sign up and sign in functionality
- ✅ **Admin Approval System** - Drivers require admin approval before accepting rides
- ✅ **Real-time Ride Notifications** - Automatically see available rides
- ✅ **Ride Acceptance** - Accept rides with a single click
- ✅ **Ride Management** - Start and complete rides
- ✅ **Professional UI** - Clean, intuitive ride screen with proper styling

### Rider App
- ✅ User authentication
- ✅ Request rides with pickup and destination
- ✅ Admin approval requirement

### Firebase Security
- ✅ **Comprehensive Security Rules** - Admin-controlled approval system
- ✅ **Role-based Access** - Separate permissions for riders and drivers
- ✅ **Secure Data Access** - Users can only access their own data

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Firebase account

### 1. Clone the Repository
```bash
git clone https://github.com/Taxinaija/taxinaija.git
cd taxinaija
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Firebase

#### Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing project
3. Enable **Authentication** with Email/Password provider
4. Create a **Firestore Database** in production mode

#### Update Firebase Configuration
1. Go to Project Settings > General
2. Scroll to "Your apps" section
3. Click the web icon (</>) to register your web app
4. Copy the configuration values
5. **Recommended:** Create a `.env` file (copy from `.env.example`) with your values:

```bash
# .env file
FIREBASE_API_KEY=your-api-key
FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
FIREBASE_APP_ID=your-app-id
```

**Alternative (for testing only):** Update `firebase/firebase.config.js` directly:

```javascript
export const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id"
};
```

**Security Note:** Never commit real Firebase credentials to version control. Use `.env` file (already in `.gitignore`) for local development.

#### Deploy Firebase Security Rules
1. Install Firebase CLI:
```bash
npm install -g firebase-tools
```

2. Login to Firebase:
```bash
firebase login
```

3. Initialize Firebase in the project:
```bash
firebase init firestore
```

4. Deploy the security rules:
```bash
firebase deploy --only firestore:rules
```

Or manually copy the rules from `firebase/firestore.rules` to your Firebase Console:
- Go to Firestore Database > Rules
- Paste the content from `firebase/firestore.rules`
- Click "Publish"

### 4. Run the Application

For development (requires a bundler like Vite or webpack):
```bash
npm run dev
```

## Project Structure

```
taxinaija/
├── src/
│   ├── driver/              # Driver application
│   │   ├── DriverApp.jsx    # Main driver app component
│   │   ├── DriverAuth.jsx   # Authentication for drivers
│   │   ├── DriverDashboard.jsx  # Dashboard with ride management
│   │   └── RideCard.jsx     # Ride card component
│   ├── rider/               # Rider application
│   │   └── RiderApp.jsx     # Rider app component
│   ├── shared/              # Shared utilities
│   │   └── firebaseService.js  # Firebase API functions
│   └── index.jsx            # Application entry point
├── firebase/
│   ├── firestore.rules      # Firestore security rules
│   └── firebase.config.js   # Firebase configuration
└── public/
    └── index.html           # HTML template
```

## User Roles and Permissions

### Admin
- Can approve/reject user accounts
- Can read and modify all data
- Set a user's `approved` field to `true` to approve them

### Driver (Approved)
- Can view available rides
- Can accept rides
- Can start and complete rides
- Can update their location

### Driver (Not Approved)
- Can sign up and sign in
- Cannot accept rides until approved by admin
- Will see "Account Pending Approval" message

### Rider (Approved)
- Can create ride requests
- Can view their own rides
- Can cancel rides

### Rider (Not Approved)
- Can sign up and sign in
- Cannot request rides until approved

## Approving Users (Admin Action)

To approve a user, an admin needs to update the user's document in Firestore:

1. Go to Firebase Console > Firestore Database
2. Find the user in the `users` collection
3. Edit the document and set `approved: true`
4. Save the changes

The user will immediately be able to use the app.

## Firebase Security Rules Explained

The security rules in `firebase/firestore.rules` implement:

1. **Admin Approval Required**: Users must have `approved: true` in their user document
2. **Role-Based Access**: Different permissions for drivers and riders
3. **Data Isolation**: Users can only access their own rides
4. **Admin Override**: Admins can access and modify any data

## Troubleshooting

### Driver Cannot Accept Rides
- Check if driver account is approved (approved: true in Firestore)
- Verify Firebase security rules are deployed
- Check browser console for errors

### Rides Not Appearing
- Ensure Firestore Database is created
- Check Firebase security rules
- Verify network connection

### Authentication Issues
- Verify Firebase configuration in `firebase/firebase.config.js`
- Enable Email/Password authentication in Firebase Console
- Check browser console for errors

## Development Notes

This is a React-based web application that can be adapted for:
- React Native (mobile apps)
- Progressive Web App (PWA)
- Electron (desktop app)

The core business logic in `firebaseService.js` can be reused across platforms.

## License

ISC
