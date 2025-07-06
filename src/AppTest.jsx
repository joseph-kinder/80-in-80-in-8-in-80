import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';

function AppTest() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [logs, setLogs] = useState([]);

  const log = (message) => {
    console.log(message);
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()} - ${message}`]);
  };

  useEffect(() => {
    log('Starting auth check...');
    
    const checkAuth = async () => {
      try {
        log('Getting session...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          log(`Session error: ${error.message}`);
          setError(error.message);
        } else if (session) {
          log(`Session found! User: ${session.user.email}`);
          setUser(session.user);
          
          // Try to get profile
          try {
            log('Fetching profile...');
            const { data: profile, error: profileError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();
            
            if (profileError) {
              log(`Profile error: ${profileError.message}`);
            } else {
              log(`Profile found: ${JSON.stringify(profile)}`);
            }
          } catch (e) {
            log(`Profile fetch exception: ${e.message}`);
          }
        } else {
          log('No session found');
        }
      } catch (e) {
        log(`Unexpected error: ${e.message}`);
        setError(e.message);
      } finally {
        log('Auth check complete');
        setLoading(false);
      }
    };
    
    checkAuth();
    
    // Listen for auth changes
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      log(`Auth state changed: ${event}`);
      if (session) {
        setUser(session.user);
      } else {
        setUser(null);
      }
    });
    
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>App Test</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <strong>Status:</strong> {loading ? 'Loading...' : user ? 'Authenticated' : 'Not authenticated'}
      </div>
      
      {error && (
        <div style={{ color: 'red', marginBottom: '20px' }}>
          <strong>Error:</strong> {error}
        </div>
      )}
      
      {user && (
        <div style={{ marginBottom: '20px' }}>
          <strong>User:</strong> {user.email} ({user.id})
        </div>
      )}
      
      <div style={{ 
        background: '#f0f0f0', 
        padding: '10px', 
        maxHeight: '400px', 
        overflow: 'auto',
        whiteSpace: 'pre-wrap'
      }}>
        <strong>Logs:</strong>
        {logs.map((log, i) => (
          <div key={i}>{log}</div>
        ))}
      </div>
      
      <div style={{ marginTop: '20px' }}>
        <button onClick={() => window.location.href = '/'}>
          Go to Main App
        </button>
        <button onClick={() => supabase.auth.signOut()}>
          Sign Out
        </button>
      </div>
    </div>
  );
}

export default AppTest;