import React, { useState, useEffect } from 'react';
import { 
  onAuthChange, 
  getUserData, 
  signOutUser 
} from '../shared/firebaseService.js';
import DriverAuth from './DriverAuth.jsx';
import DriverDashboard from './DriverDashboard.jsx';

const DriverApp = () => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthChange(async (authUser) => {
      if (authUser) {
        const result = await getUserData(authUser.uid);
        if (result.success && result.data.role === 'driver') {
          setUser(authUser);
          setUserData(result.data);
        } else {
          setUser(null);
          setUserData(null);
        }
      } else {
        setUser(null);
        setUserData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await signOutUser();
    setUser(null);
    setUserData(null);
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingText}>Loading...</div>
      </div>
    );
  }

  if (!user || !userData) {
    return <DriverAuth />;
  }

  if (!userData.approved) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>TaxiNaija Driver</h1>
          <button onClick={handleSignOut} style={styles.signOutButton}>
            Sign Out
          </button>
        </div>
        <div style={styles.approvalMessage}>
          <h2>Account Pending Approval</h2>
          <p>Your driver account is pending admin approval. Please wait for an administrator to approve your account.</p>
        </div>
      </div>
    );
  }

  return <DriverDashboard user={user} userData={userData} onSignOut={handleSignOut} />;
};

const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    maxWidth: '100%',
    margin: '0 auto',
    padding: '20px',
    backgroundColor: '#f5f5f5',
    minHeight: '100vh'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '10px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  title: {
    margin: 0,
    color: '#2c3e50',
    fontSize: '24px'
  },
  signOutButton: {
    padding: '10px 20px',
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold'
  },
  loadingText: {
    textAlign: 'center',
    fontSize: '18px',
    color: '#7f8c8d',
    padding: '40px'
  },
  approvalMessage: {
    backgroundColor: '#fff',
    padding: '40px',
    borderRadius: '10px',
    textAlign: 'center',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  }
};

export default DriverApp;
