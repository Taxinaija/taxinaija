import React from 'react';

const RideCard = ({ ride, onAccept, onStart, onComplete, loading, type }) => {
  const formatTimestamp = (timestamp) => {
    if (!timestamp || !timestamp.toDate) return 'N/A';
    return timestamp.toDate().toLocaleString();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return '#f39c12';
      case 'accepted':
        return '#3498db';
      case 'in_progress':
        return '#27ae60';
      case 'completed':
        return '#95a5a6';
      case 'cancelled':
        return '#e74c3c';
      default:
        return '#7f8c8d';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'accepted':
        return 'Accepted';
      case 'in_progress':
        return 'In Progress';
      case 'completed':
        return 'Completed';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  return (
    <div style={styles.card}>
      <div style={styles.cardHeader}>
        <div>
          <h3 style={styles.cardTitle}>Ride #{ride.id.slice(-6)}</h3>
          <span 
            style={{
              ...styles.status,
              backgroundColor: getStatusColor(ride.status)
            }}
          >
            {getStatusText(ride.status)}
          </span>
        </div>
        {ride.fare && (
          <div style={styles.fare}>₦{ride.fare.toLocaleString()}</div>
        )}
      </div>

      <div style={styles.cardBody}>
        <div style={styles.location}>
          <div style={styles.locationItem}>
            <span style={styles.locationIcon}>📍</span>
            <div>
              <div style={styles.locationLabel}>Pickup</div>
              <div style={styles.locationAddress}>{ride.pickup?.address || 'Not specified'}</div>
            </div>
          </div>
          
          <div style={styles.locationDivider}>⬇</div>
          
          <div style={styles.locationItem}>
            <span style={styles.locationIcon}>🎯</span>
            <div>
              <div style={styles.locationLabel}>Destination</div>
              <div style={styles.locationAddress}>{ride.destination?.address || 'Not specified'}</div>
            </div>
          </div>
        </div>

        {ride.riderName && (
          <div style={styles.riderInfo}>
            <span style={styles.riderIcon}>👤</span>
            <span>{ride.riderName}</span>
          </div>
        )}

        {ride.riderPhone && (
          <div style={styles.riderInfo}>
            <span style={styles.riderIcon}>📱</span>
            <span>{ride.riderPhone}</span>
          </div>
        )}

        {ride.createdAt && (
          <div style={styles.timeInfo}>
            <span style={styles.timeLabel}>Requested:</span>
            <span>{formatTimestamp(ride.createdAt)}</span>
          </div>
        )}
      </div>

      <div style={styles.cardActions}>
        {type === 'available' && (
          <button 
            onClick={onAccept}
            disabled={loading}
            style={loading ? {...styles.acceptButton, ...styles.buttonDisabled} : styles.acceptButton}
          >
            {loading ? 'Accepting...' : 'Accept Ride'}
          </button>
        )}

        {type === 'active' && ride.status === 'accepted' && (
          <button 
            onClick={onStart}
            disabled={loading}
            style={loading ? {...styles.startButton, ...styles.buttonDisabled} : styles.startButton}
          >
            {loading ? 'Starting...' : 'Start Ride'}
          </button>
        )}

        {type === 'active' && ride.status === 'in_progress' && (
          <button 
            onClick={onComplete}
            disabled={loading}
            style={loading ? {...styles.completeButton, ...styles.buttonDisabled} : styles.completeButton}
          >
            {loading ? 'Completing...' : 'Complete Ride'}
          </button>
        )}
      </div>
    </div>
  );
};

const styles = {
  card: {
    backgroundColor: '#fff',
    borderRadius: '10px',
    padding: '20px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    transition: 'transform 0.2s, box-shadow 0.2s'
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '15px',
    paddingBottom: '15px',
    borderBottom: '1px solid #ecf0f1'
  },
  cardTitle: {
    margin: '0 0 8px 0',
    color: '#2c3e50',
    fontSize: '18px',
    fontWeight: 'bold'
  },
  status: {
    padding: '4px 12px',
    borderRadius: '20px',
    color: 'white',
    fontSize: '12px',
    fontWeight: 'bold',
    display: 'inline-block'
  },
  fare: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#27ae60'
  },
  cardBody: {
    marginBottom: '15px'
  },
  location: {
    marginBottom: '15px'
  },
  locationItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px',
    marginBottom: '10px'
  },
  locationIcon: {
    fontSize: '20px'
  },
  locationLabel: {
    fontSize: '12px',
    color: '#7f8c8d',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginBottom: '4px'
  },
  locationAddress: {
    fontSize: '14px',
    color: '#2c3e50'
  },
  locationDivider: {
    fontSize: '16px',
    color: '#7f8c8d',
    marginLeft: '10px',
    marginBottom: '5px'
  },
  riderInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '14px',
    color: '#2c3e50',
    marginBottom: '8px'
  },
  riderIcon: {
    fontSize: '16px'
  },
  timeInfo: {
    display: 'flex',
    gap: '8px',
    fontSize: '12px',
    color: '#7f8c8d',
    marginTop: '15px',
    paddingTop: '15px',
    borderTop: '1px solid #ecf0f1'
  },
  timeLabel: {
    fontWeight: 'bold'
  },
  cardActions: {
    display: 'flex',
    gap: '10px'
  },
  acceptButton: {
    flex: 1,
    padding: '12px',
    backgroundColor: '#27ae60',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
    transition: 'background-color 0.2s'
  },
  startButton: {
    flex: 1,
    padding: '12px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
    transition: 'background-color 0.2s'
  },
  completeButton: {
    flex: 1,
    padding: '12px',
    backgroundColor: '#27ae60',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
    transition: 'background-color 0.2s'
  },
  buttonDisabled: {
    backgroundColor: '#95a5a6',
    cursor: 'not-allowed'
  }
};

export default RideCard;
