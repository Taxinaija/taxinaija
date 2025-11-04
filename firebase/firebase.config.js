// Firebase configuration
// IMPORTANT: In production, use environment variables instead of hardcoding credentials
// Example: Use .env file with VITE_FIREBASE_API_KEY, REACT_APP_FIREBASE_API_KEY, etc.
// This file should be added to .gitignore if it contains real credentials

// For production deployment, consider:
// 1. Use environment variables via .env file (add .env to .gitignore)
// 2. Use secure configuration management (AWS Secrets Manager, etc.)
// 3. Restrict Firebase API keys by HTTP referrer or application

export const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || "YOUR_API_KEY",
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: process.env.FIREBASE_PROJECT_ID || "YOUR_PROJECT_ID",
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "YOUR_MESSAGING_SENDER_ID",
  appId: process.env.FIREBASE_APP_ID || "YOUR_APP_ID"
};

// Instructions:
// 1. Go to Firebase Console (https://console.firebase.google.com/)
// 2. Create a new project or select existing project
// 3. Go to Project Settings > General
// 4. Scroll down to "Your apps" section
// 5. Click on the web icon (</>) to register your web app
// 6. Copy the configuration values and either:
//    - Replace the placeholder values above (for testing only)
//    - Or better: Create .env file with environment variables (recommended)
// 7. Enable Firestore Database in Firebase Console
// 8. Deploy the firestore.rules file to your Firebase project
