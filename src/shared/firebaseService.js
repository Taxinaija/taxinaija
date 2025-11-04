import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  query, 
  where, 
  onSnapshot,
  serverTimestamp 
} from 'firebase/firestore';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { firebaseConfig } from '../../firebase/firebase.config.js';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Authentication functions
export const signUpUser = async (email, password, userData) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Create user document
    await setDoc(doc(db, 'users', user.uid), {
      ...userData,
      email,
      createdAt: serverTimestamp(),
      approved: false // Requires admin approval
    });
    
    return { success: true, user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const signInUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const signOutUser = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

// User functions
export const getUserData = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      return { success: true, data: { id: userDoc.id, ...userDoc.data() } };
    }
    return { success: false, error: 'User not found' };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const updateUserData = async (userId, data) => {
  try {
    await updateDoc(doc(db, 'users', userId), data);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Ride functions for riders
export const createRide = async (rideData) => {
  try {
    const rideRef = doc(collection(db, 'rides'));
    await setDoc(rideRef, {
      ...rideData,
      status: 'pending',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return { success: true, rideId: rideRef.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getRide = async (rideId) => {
  try {
    const rideDoc = await getDoc(doc(db, 'rides', rideId));
    if (rideDoc.exists()) {
      return { success: true, data: { id: rideDoc.id, ...rideDoc.data() } };
    }
    return { success: false, error: 'Ride not found' };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const updateRideStatus = async (rideId, status, additionalData = {}) => {
  try {
    await updateDoc(doc(db, 'rides', rideId), {
      status,
      ...additionalData,
      updatedAt: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Ride functions for drivers
export const getAvailableRides = async () => {
  try {
    const q = query(collection(db, 'rides'), where('status', '==', 'pending'));
    const querySnapshot = await getDocs(q);
    const rides = [];
    querySnapshot.forEach((doc) => {
      rides.push({ id: doc.id, ...doc.data() });
    });
    return { success: true, rides };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const acceptRide = async (rideId, driverId) => {
  try {
    await updateDoc(doc(db, 'rides', rideId), {
      driverId,
      status: 'accepted',
      acceptedAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const completeRide = async (rideId) => {
  try {
    await updateDoc(doc(db, 'rides', rideId), {
      status: 'completed',
      completedAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const startRide = async (rideId) => {
  try {
    await updateDoc(doc(db, 'rides', rideId), {
      status: 'in_progress',
      startedAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Real-time listeners
export const listenToAvailableRides = (callback) => {
  const q = query(collection(db, 'rides'), where('status', '==', 'pending'));
  return onSnapshot(q, (snapshot) => {
    const rides = [];
    snapshot.forEach((doc) => {
      rides.push({ id: doc.id, ...doc.data() });
    });
    callback(rides);
  });
};

export const listenToRide = (rideId, callback) => {
  return onSnapshot(doc(db, 'rides', rideId), (doc) => {
    if (doc.exists()) {
      callback({ id: doc.id, ...doc.data() });
    }
  });
};

export const listenToDriverRides = (driverId, callback) => {
  const q = query(
    collection(db, 'rides'), 
    where('driverId', '==', driverId),
    where('status', 'in', ['accepted', 'in_progress'])
  );
  return onSnapshot(q, (snapshot) => {
    const rides = [];
    snapshot.forEach((doc) => {
      rides.push({ id: doc.id, ...doc.data() });
    });
    callback(rides);
  });
};

export const updateDriverLocation = async (driverId, location) => {
  try {
    await setDoc(doc(db, 'driverLocations', driverId), {
      location,
      updatedAt: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export { auth, db };
