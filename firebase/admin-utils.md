# Admin Utilities

This document provides instructions for common admin tasks in the TaxiNaija app.

## Approving Users

### Method 1: Firebase Console (Recommended)
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Navigate to Firestore Database
4. Find the `users` collection
5. Click on the user document you want to approve
6. Click "Edit field" on the `approved` field
7. Change `false` to `true`
8. Click "Update"

### Method 2: Firebase CLI
If you have Firebase Admin SDK set up, you can use this Node.js script:

```javascript
const admin = require('firebase-admin');

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.applicationDefault()
});

const db = admin.firestore();

async function approveUser(userId) {
  try {
    await db.collection('users').doc(userId).update({
      approved: true
    });
    console.log(`User ${userId} approved successfully`);
  } catch (error) {
    console.error('Error approving user:', error);
  }
}

// Usage:
// approveUser('user-id-here');
```

## Setting Admin Role

To set a user as admin:

1. Go to Firebase Console > Firestore Database
2. Find the user in the `users` collection
3. Edit the document and add/update the `role` field to `admin`
4. Ensure `approved` is set to `true`

Example user document for admin:
```json
{
  "name": "Admin Name",
  "email": "admin@example.com",
  "role": "admin",
  "approved": true,
  "createdAt": "timestamp"
}
```

## Viewing All Pending Approvals

In Firebase Console:
1. Go to Firestore Database
2. Click on `users` collection
3. Use the filter to show documents where `approved == false`

## Common Admin Tasks

### Check User Status
- Navigate to Firestore > users > [userId]
- Check the `approved` and `role` fields

### Reject/Remove User
- Navigate to Firestore > users > [userId]
- Click the three dots menu
- Select "Delete document"

### View All Rides
- Navigate to Firestore > rides collection
- You can filter by status: pending, accepted, in_progress, completed, cancelled

### Cancel a Ride
- Navigate to Firestore > rides > [rideId]
- Update the `status` field to `cancelled`

## Security Notes

- Never share admin credentials
- Always use Firebase security rules to enforce permissions
- Regularly review user approvals
- Monitor ride activity for suspicious patterns
