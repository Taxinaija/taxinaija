import React, { useState, useEffect } from 'react';
import { 
  onAuthChange, 
  getUserData, 
  signOutUser,
  createRide
} from '../shared/firebaseService.js';
import { getBaseFare } from '../shared/fareCalculator.js';

const RiderApp = () => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthChange(async (authUser) => {
      if (authUser) {
        const result = await getUserData(authUser.uid);
        if (result.success && result.data.role === 'rider') {
          setUser(authUser);
          setUserData(result.data);
        }
      } else {
        setUser(null);
        setUserData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleRequestRide = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    // TODO: Implement proper fare calculation based on distance and time
    // For now, using a base fare. In production, integrate with:
    // - Google Maps Distance Matrix API for distance calculation
    // - Dynamic pricing based on time of day and demand
    // - Surge pricing during peak hours
    // See fareCalculator.js for fare calculation utilities
    const fare = getBaseFare(); // Using base fare until distance calculation is implemented

    const result = await createRide({
      riderId: user.uid,
      riderName: userData.name,
      riderPhone: userData.phone,
      pickup: { address: pickup },
      destination: { address: destination },
      fare: fare
    });

    if (result.success) {
      setMessage('Ride requested successfully! Waiting for a driver...');
      setPickup('');
      setDestination('');
    } else {
      setMessage(`Error: ${result.error}`);
    }

    setLoading(false);
  };

  if (loading) {
    return <div style={styles.loading}>Loading...</div>;
  }

  if (!user || !userData) {
    return (
      <div style={styles.container}>
        <h1>Rider App - Please sign in</h1>
      </div>
    );
  }

  if (!userData.approved) {
    return (
      <div style={styles.container}>
        <h1>Rider Account Pending Approval</h1>
        <p>Please wait for admin approval.</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>TaxiNaija Rider</h1>
      <h2>Welcome, {userData.name}!</h2>
      
      {message && <div style={styles.message}>{message}</div>}
      
      <form onSubmit={handleRequestRide} style={styles.form}>
        <input
          type="text"
          placeholder="Pickup Location"
          value={pickup}
          onChange={(e) => setPickup(e.target.value)}
          required
          style={styles.input}
        />
        <input
          type="text"
          placeholder="Destination"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          required
          style={styles.input}
        />
        <button type="submit" disabled={loading} style={styles.button}>
          Request Ride
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    maxWidth: '600px',
    margin: '0 auto',
    padding: '20px'
  },
  title: {
    color: '#2c3e50'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    marginTop: '20px'
  },
  input: {
    padding: '12px',
    fontSize: '16px',
    border: '1px solid #ddd',
    borderRadius: '5px'
  },
  button: {
    padding: '12px',
    fontSize: '16px',
    backgroundColor: '#27ae60',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  },
  message: {
    padding: '15px',
    backgroundColor: '#27ae60',
    color: 'white',
    borderRadius: '5px',
    marginTop: '20px'
  },
  loading: {
    textAlign: 'center',
    padding: '40px',
    fontSize: '18px'
  }
};

export default RiderApp;
