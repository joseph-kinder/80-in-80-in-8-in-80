import React, { useState } from 'react';
import { signUp, signIn, signInWithGoogle } from '../lib/supabase';
import './Login.css';

function Login({ onLogin }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [baselineScore, setBaselineScore] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    console.log('[LOGIN] Google sign-in clicked');
    setError('');
    setLoading(true);
    
    try {
      await signInWithGoogle();
      console.log('[LOGIN] Google sign-in initiated, waiting for redirect');
      // The redirect will handle the rest
    } catch (err) {
      console.error('[LOGIN] Google sign-in error:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('[LOGIN] Form submitted - isSignUp:', isSignUp);
    setError('');
    setLoading(true);

    try {
      if (isSignUp) {
        // Sign up
        if (!username || !baselineScore) {
          throw new Error('All fields are required');
        }
        
        console.log('[LOGIN] Signing up new user');
        const { user } = await signUp(email, password, username, parseInt(baselineScore));
        if (user) {
          console.log('[LOGIN] Sign up successful, calling onLogin');
          onLogin({
            id: user.id,
            email: user.email,
            name: username,
            baselineScore: parseInt(baselineScore),
            currentDay: 1
          });
        }
      } else {
        // Sign in
        console.log('[LOGIN] Signing in existing user');
        const { user } = await signIn(email, password);
        if (user) {
          console.log('[LOGIN] Sign in successful, fetching profile');
          // Fetch user profile
          const { getProfile } = await import('../lib/supabase');
          const profile = await getProfile(user.id);
          console.log('[LOGIN] Profile fetched:', profile);
          onLogin({
            id: user.id,
            email: user.email,
            name: profile.username,
            baselineScore: profile.baseline_score,
            currentDay: profile.current_day
          });
        }
      }
    } catch (err) {
      console.error('[LOGIN] Error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="ascii-logo">
{`   ___   ___     _         ___   ___  
  ( _ ) / _ \\   (_)_ __   ( _ ) / _ \\ 
  / _ \\| | | |  | | '_ \\  / _ \\| | | |
 | (_) | |_| |  | | | | || (_) | |_| |
  \\___/ \\___/   |_|_| |_| \\___/ \\___/ 
                                      
    MENTAL MATH TRAINING SYSTEM v1.0`}
        </div>
        <div className="login-header">
          <h1>System {isSignUp ? 'Registration' : 'Login'}</h1>
          <p>{isSignUp ? 'Create New Account' : 'Access Training Protocol'}</p>
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="error-message">
              ERROR: {error}
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
              required
              autoComplete="off"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              required
              autoComplete="off"
            />
          </div>
          
          {isSignUp && (
            <>
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  required
                  autoComplete="off"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="baseline">Baseline Score [0-80]</label>
                <input
                  type="number"
                  id="baseline"
                  value={baselineScore}
                  onChange={(e) => setBaselineScore(e.target.value)}
                  placeholder="40"
                  min="0"
                  max="80"
                  required
                  autoComplete="off"
                />
                <small>RECOMMENDED: 40+ for optimal training curve</small>
              </div>
            </>
          )}
          
          <button type="submit" className="btn-large" disabled={loading}>
            {loading ? 'PROCESSING...' : (isSignUp ? '>> CREATE ACCOUNT' : '>> ACCESS SYSTEM')}
          </button>
          
          <div className="divider">
            <span>OR</span>
          </div>
          
          <button 
            type="button"
            onClick={handleGoogleSignIn}
            className="btn-large google-btn"
            disabled={loading}
          >
            SIGN IN WITH GOOGLE
          </button>
          
          <button 
            type="button" 
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError('');
            }} 
            className="toggle-mode-btn"
          >
            {isSignUp ? 'Already have an account? LOGIN' : 'New user? REGISTER'}
          </button>
        </form>
        
        <div className="login-info">
          <h3>SYSTEM CAPABILITIES:</h3>
          <ul>
            <li>Target: 80/80 score in 8 minutes</li>
            <li>Duration: 80-day training program</li>
            <li>Adaptive difficulty progression</li>
            <li>Real-time performance tracking</li>
            <li>Mental math optimization protocols</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Login;