import React, { useState } from 'react';
import { signInUser, signUpUser } from '../shared/firebaseService.js';

const DriverAuth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [vehicleInfo, setVehicleInfo] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignUp) {
        const result = await signUpUser(email, password, {
          name,
          phone,
          vehicleInfo,
          role: 'driver'
        });
        
        if (!result.success) {
          setError(result.error);
        }
      } else {
        const result = await signInUser(email, password);
        if (!result.success) {
          setError(result.error);
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.authBox}>
        <h1 style={styles.title}>TaxiNaija Driver</h1>
        <h2 style={styles.subtitle}>{isSignUp ? 'Sign Up' : 'Sign In'}</h2>
        
        {error && <div style={styles.error}>{error}</div>}
        
        <form onSubmit={handleSubmit} style={styles.form}>
          {isSignUp && (
            <>
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={styles.input}
              />
              <input
                type="tel"
                placeholder="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                style={styles.input}
              />
              <input
                type="text"
                placeholder="Vehicle Info (e.g., Toyota Corolla 2020)"
                value={vehicleInfo}
                onChange={(e) => setVehicleInfo(e.target.value)}
                required
                style={styles.input}
              />
            </>
          )}
          
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
          />
          
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength="6"
            style={styles.input}
          />
          
          <button 
            type="submit" 
            disabled={loading}
            style={loading ? {...styles.button, ...styles.buttonDisabled} : styles.button}
          >
            {loading ? 'Please wait...' : (isSignUp ? 'Sign Up' : 'Sign In')}
          </button>
        </form>
        
        <div style={styles.toggle}>
          {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
          <span 
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError('');
            }}
            style={styles.toggleLink}
          >
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </span>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
    padding: '20px'
  },
  authBox: {
    backgroundColor: '#fff',
    padding: '40px',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '400px'
  },
  title: {
    margin: '0 0 10px 0',
    color: '#2c3e50',
    textAlign: 'center',
    fontSize: '28px'
  },
  subtitle: {
    margin: '0 0 30px 0',
    color: '#7f8c8d',
    textAlign: 'center',
    fontSize: '20px',
    fontWeight: 'normal'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
  },
  input: {
    padding: '12px',
    fontSize: '16px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    outline: 'none'
  },
  button: {
    padding: '12px',
    fontSize: '16px',
    backgroundColor: '#27ae60',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold',
    marginTop: '10px'
  },
  buttonDisabled: {
    backgroundColor: '#95a5a6',
    cursor: 'not-allowed'
  },
  error: {
    padding: '10px',
    backgroundColor: '#e74c3c',
    color: 'white',
    borderRadius: '5px',
    marginBottom: '15px',
    textAlign: 'center'
  },
  toggle: {
    textAlign: 'center',
    marginTop: '20px',
    color: '#7f8c8d'
  },
  toggleLink: {
    color: '#27ae60',
    cursor: 'pointer',
    fontWeight: 'bold'
  }
};

export default DriverAuth;
