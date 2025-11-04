# Troubleshooting Guide

## Problem: Driver Cannot Accept Rides

### Symptoms
- Driver can see available rides
- Accept button doesn't work or shows error
- Rides disappear after clicking accept

### Solutions

#### 1. Check Driver Approval Status
The most common issue is that the driver account is not approved.

**Check in Firebase Console:**
1. Go to Firebase Console → Firestore Database
2. Navigate to `users` collection
3. Find the driver's document
4. Check if `approved` field is `true`

**If `approved` is `false`:**
1. Click on the document
2. Edit the `approved` field
3. Change value to `true`
4. Save changes

**The driver should immediately be able to accept rides.**

#### 2. Verify Firebase Security Rules
Ensure the security rules are properly deployed:

1. Go to Firebase Console → Firestore Database → Rules
2. Check if rules match the content in `firebase/firestore.rules`
3. Verify the rules include driver approval checks
4. Publish the rules if needed

#### 3. Check Browser Console
Open browser developer tools (F12) and check for:
- Permission denied errors
- Network errors
- Firebase configuration errors

#### 4. Verify User Role
Ensure the user document has `role: "driver"`:
```json
{
  "name": "Driver Name",
  "email": "driver@example.com",
  "role": "driver",
  "approved": true,
  "phone": "+234...",
  "vehicleInfo": "..."
}
```

## Problem: Rides Not Appearing

### Symptoms
- Dashboard shows "No available rides"
- Rides are in database but not showing

### Solutions

#### 1. Check Ride Status
Rides must have `status: "pending"` to appear in available rides:
1. Go to Firebase Console → Firestore Database
2. Check `rides` collection
3. Verify rides have `status: "pending"`

#### 2. Verify Real-time Listener
Check browser console for:
- WebSocket connection errors
- Firebase quota exceeded errors
- Network connectivity issues

#### 3. Check Firebase Rules
Ensure drivers can read pending rides:
- Rules should allow `read` for authenticated users
- Check the rules in Firebase Console

#### 4. Refresh or Re-login
Sometimes the listener connection needs to be refreshed:
1. Sign out of the app
2. Sign back in
3. Check if rides appear

## Problem: "Account Pending Approval" Message

### This is Expected Behavior
New users require admin approval before they can use the app.

### To Approve:
1. Admin goes to Firebase Console
2. Opens Firestore Database
3. Finds user in `users` collection
4. Sets `approved: true`

### Auto-approve (Not Recommended for Production)
If you want to auto-approve for testing, modify the signup function in `firebaseService.js`:
```javascript
await setDoc(doc(db, 'users', user.uid), {
  ...userData,
  email,
  createdAt: serverTimestamp(),
  approved: true  // Change from false to true
});
```

## Problem: Firebase Configuration Errors

### Symptoms
- "Firebase: Error (auth/invalid-api-key)"
- "Firebase: Error (auth/project-not-found)"
- Connection errors

### Solutions

#### 1. Check Firebase Config
Verify `firebase/firebase.config.js` has correct values:
- `apiKey` - Must match your Firebase project
- `projectId` - Must match your Firebase project
- `appId` - Must match your Firebase project

#### 2. Get Correct Config
1. Go to Firebase Console
2. Project Settings → General
3. Scroll to "Your apps"
4. Copy the config object
5. Update `firebase/firebase.config.js`

#### 3. Enable Authentication
1. Go to Firebase Console
2. Authentication → Sign-in method
3. Enable "Email/Password" provider
4. Save changes

## Problem: Security Rules Permission Denied

### Symptoms
- "Missing or insufficient permissions"
- "Permission denied" in console

### Solutions

#### 1. Deploy Security Rules
```bash
firebase deploy --only firestore:rules
```

#### 2. Check Rule Syntax
Ensure rules in Firebase Console match `firebase/firestore.rules`

#### 3. Common Rule Issues

**Driver can't accept rides:**
- Check if `isDriver()` function works
- Verify driver document exists
- Ensure `approved: true` and `role: "driver"`

**No rides visible:**
- Check read permissions in rules
- Verify authentication is working

#### 4. Test Rules
Firebase Console has a Rules Playground:
1. Go to Firestore → Rules
2. Click "Rules Playground"
3. Test different operations
4. Fix issues found

## Problem: User Cannot Sign In/Sign Up

### Symptoms
- "Auth error" messages
- Form submits but nothing happens
- Redirected back to login

### Solutions

#### 1. Check Email/Password Provider
1. Firebase Console → Authentication
2. Sign-in method tab
3. Ensure "Email/Password" is enabled

#### 2. Check Password Requirements
- Password must be at least 6 characters
- Email must be valid format

#### 3. Check Network Tab
- Open browser developer tools
- Go to Network tab
- Look for failed requests
- Check error messages

#### 4. Clear Browser Cache
Sometimes cached credentials cause issues:
1. Clear browser cache and cookies
2. Try signing in again

## Problem: Real-time Updates Not Working

### Symptoms
- New rides don't appear automatically
- Need to refresh page to see updates
- Changes in other tabs/devices not reflected

### Solutions

#### 1. Check WebSocket Connection
1. Open browser console
2. Look for WebSocket errors
3. Check if Firestore is blocked by firewall

#### 2. Verify Listener Setup
Ensure `listenToAvailableRides` and `listenToDriverRides` are called in useEffect

#### 3. Check Quota Limits
1. Go to Firebase Console
2. Check usage metrics
3. Ensure you haven't exceeded free tier limits

#### 4. Test Network Connectivity
- Check internet connection
- Try from different network
- Disable VPN if using one

## Problem: npm/Node.js Issues

### Symptoms
- "Module not found" errors
- "Cannot find package" errors

### Solutions

#### 1. Reinstall Dependencies
```bash
rm -rf node_modules package-lock.json
npm install
```

#### 2. Check Node Version
```bash
node --version  # Should be v14 or higher
npm --version   # Should be v6 or higher
```

#### 3. Clear npm Cache
```bash
npm cache clean --force
npm install
```

## Getting Help

If you're still experiencing issues:

1. **Check Browser Console:** Look for error messages
2. **Check Firebase Console:** Look at Firestore data and rules
3. **Review Code:** Compare with working examples
4. **Documentation:** Review Firebase and React documentation
5. **Community:** Ask on Stack Overflow or Firebase forums

## Debug Checklist

Before asking for help, verify:
- [ ] Firebase config is correct
- [ ] Firebase Authentication is enabled
- [ ] Firestore Database is created
- [ ] Security rules are deployed
- [ ] User account exists in Firestore
- [ ] User `approved` field is `true`
- [ ] User `role` field is correct
- [ ] Browser console shows no errors
- [ ] Network tab shows successful requests
- [ ] Internet connection is stable

## Common Error Messages

### "Missing or insufficient permissions"
→ Deploy security rules or approve user account

### "Firebase: Error (auth/user-not-found)"
→ User doesn't exist, try signing up

### "Firebase: Error (auth/wrong-password)"
→ Incorrect password, reset or try again

### "Firebase: Error (auth/email-already-in-use)"
→ Email already registered, try signing in

### "Firebase: Error (auth/weak-password)"
→ Password must be at least 6 characters

### "Firebase: Error (auth/invalid-email)"
→ Enter a valid email address

### "Firebase: Error (auth/network-request-failed)"
→ Check internet connection
