import React, { useState, useEffect } from 'react';
import { 
  listenToAvailableRides, 
  listenToDriverRides,
  acceptRide,
  startRide,
  completeRide
} from '../shared/firebaseService.js';
import RideCard from './RideCard.jsx';

const DriverDashboard = ({ user, userData, onSignOut }) => {
  const [availableRides, setAvailableRides] = useState([]);
  const [activeRides, setActiveRides] = useState([]);
  const [tab, setTab] = useState('available'); // 'available' or 'active'
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Listen to available rides
    const unsubscribeAvailable = listenToAvailableRides((rides) => {
      setAvailableRides(rides);
    });

    // Listen to driver's active rides
    const unsubscribeActive = listenToDriverRides(user.uid, (rides) => {
      setActiveRides(rides);
    });

    return () => {
      unsubscribeAvailable();
      unsubscribeActive();
    };
  }, [user.uid]);

  const handleAcceptRide = async (rideId) => {
    setLoading(true);
    setMessage('');
    
    const result = await acceptRide(rideId, user.uid);
    
    if (result.success) {
      setMessage('Ride accepted successfully!');
      setTab('active');
      setTimeout(() => setMessage(''), 3000);
    } else {
      setMessage(`Error: ${result.error}`);
    }
    
    setLoading(false);
  };

  const handleStartRide = async (rideId) => {
    setLoading(true);
    setMessage('');
    
    const result = await startRide(rideId);
    
    if (result.success) {
      setMessage('Ride started!');
      setTimeout(() => setMessage(''), 3000);
    } else {
      setMessage(`Error: ${result.error}`);
    }
    
    setLoading(false);
  };

  const handleCompleteRide = async (rideId) => {
    setLoading(true);
    setMessage('');
    
    const result = await completeRide(rideId);
    
    if (result.success) {
      setMessage('Ride completed successfully!');
      setTimeout(() => setMessage(''), 3000);
    } else {
      setMessage(`Error: ${result.error}`);
    }
    
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>TaxiNaija Driver</h1>
          <p style={styles.subtitle}>Welcome, {userData.name}!</p>
        </div>
        <button onClick={onSignOut} style={styles.signOutButton}>
          Sign Out
        </button>
      </div>

      {message && (
        <div style={message.startsWith('Error') ? styles.errorMessage : styles.successMessage}>
          {message}
        </div>
      )}

      <div style={styles.tabs}>
        <button 
          onClick={() => setTab('available')}
          style={tab === 'available' ? {...styles.tab, ...styles.tabActive} : styles.tab}
        >
          Available Rides {availableRides.length > 0 && `(${availableRides.length})`}
        </button>
        <button 
          onClick={() => setTab('active')}
          style={tab === 'active' ? {...styles.tab, ...styles.tabActive} : styles.tab}
        >
          My Rides {activeRides.length > 0 && `(${activeRides.length})`}
        </button>
      </div>

      <div style={styles.content}>
        {tab === 'available' && (
          <div>
            <h2 style={styles.sectionTitle}>Available Rides</h2>
            {availableRides.length === 0 ? (
              <div style={styles.emptyState}>
                <p>No available rides at the moment.</p>
                <p style={styles.emptyStateSubtext}>New rides will appear here automatically.</p>
              </div>
            ) : (
              <div style={styles.rideList}>
                {availableRides.map((ride) => (
                  <RideCard 
                    key={ride.id}
                    ride={ride}
                    onAccept={() => handleAcceptRide(ride.id)}
                    loading={loading}
                    type="available"
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'active' && (
          <div>
            <h2 style={styles.sectionTitle}>My Active Rides</h2>
            {activeRides.length === 0 ? (
              <div style={styles.emptyState}>
                <p>You have no active rides.</p>
                <p style={styles.emptyStateSubtext}>Accept a ride from the Available Rides tab.</p>
              </div>
            ) : (
              <div style={styles.rideList}>
                {activeRides.map((ride) => (
                  <RideCard 
                    key={ride.id}
                    ride={ride}
                    onStart={() => handleStartRide(ride.id)}
                    onComplete={() => handleCompleteRide(ride.id)}
                    loading={loading}
                    type="active"
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    maxWidth: '1200px',
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
    fontSize: '28px'
  },
  subtitle: {
    margin: '5px 0 0 0',
    color: '#7f8c8d',
    fontSize: '16px'
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
  tabs: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px'
  },
  tab: {
    flex: 1,
    padding: '15px',
    backgroundColor: '#fff',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#7f8c8d',
    transition: 'all 0.3s',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  tabActive: {
    backgroundColor: '#27ae60',
    color: 'white'
  },
  content: {
    minHeight: '400px'
  },
  sectionTitle: {
    margin: '0 0 20px 0',
    color: '#2c3e50',
    fontSize: '22px'
  },
  rideList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
  },
  emptyState: {
    backgroundColor: '#fff',
    padding: '60px 40px',
    borderRadius: '10px',
    textAlign: 'center',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  emptyStateSubtext: {
    color: '#7f8c8d',
    fontSize: '14px'
  },
  successMessage: {
    padding: '15px',
    backgroundColor: '#27ae60',
    color: 'white',
    borderRadius: '10px',
    marginBottom: '20px',
    textAlign: 'center',
    fontWeight: 'bold',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  errorMessage: {
    padding: '15px',
    backgroundColor: '#e74c3c',
    color: 'white',
    borderRadius: '10px',
    marginBottom: '20px',
    textAlign: 'center',
    fontWeight: 'bold',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  }
};

export default DriverDashboard;
