import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import DailyTraining from './components/DailyTraining';
import MockTest from './components/MockTest';
import Progress from './components/Progress';
import Login from './components/Login';
import Navigation from './components/Navigation';
import { generateFullCurriculum } from './data/curriculum';
import { supabase, getProfile, getProgress, updateProgress as updateSupabaseProgress, updateCurrentDay } from './lib/supabase';
import './styles/App.css';

function App() {
  const [user, setUser] = useState(null);
  const [curriculum, setCurriculum] = useState(null);
  const [progress, setProgress] = useState({});
  const [theme, setTheme] = useState('light');
  const [loading, setLoading] = useState(true);

  // Apply theme immediately on mount
  useEffect(() => {
    document.body.className = theme === 'light' ? 'light-theme' : '';
  }, []);

  useEffect(() => {
    // Check for existing session
    checkUser();
    
    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        await loadUserData(session.user);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setProgress({});
      }
    });

    // Generate full curriculum
    setCurriculum(generateFullCurriculum());
    
    // Apply theme
    document.body.className = theme === 'light' ? 'light-theme' : '';

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [theme]);

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await loadUserData(user);
      }
    } catch (error) {
      console.error('Error checking user:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserData = async (authUser) => {
    try {
      let profile = await getProfile(authUser.id);
      
      // If no profile exists (e.g., Google sign-in), create one
      if (!profile) {
        const username = authUser.user_metadata?.full_name || authUser.email.split('@')[0];
        const { error: createError } = await supabase.rpc('create_user_profile', {
          user_id: authUser.id,
          user_name: username,
          user_baseline_score: 40 // Default baseline for Google users
        });
        
        if (!createError) {
          profile = await getProfile(authUser.id);
        }
      }
      
      if (profile) {
        const userProgress = await getProgress(authUser.id);
        
        setUser({
          id: authUser.id,
          email: authUser.email,
          name: profile.username,
          baselineScore: profile.baseline_score,
          currentDay: profile.current_day
        });
        
        setProgress(userProgress);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      // If profile doesn't exist, redirect to a profile setup page
      // For now, create a default profile
      setUser({
        id: authUser.id,
        email: authUser.email,
        name: authUser.email.split('@')[0],
        baselineScore: 40,
        currentDay: 1
      });
    }
  };

  const handleLogin = async (userData) => {
    setUser(userData);
    // Load progress after login
    try {
      const userProgress = await getProgress(userData.id);
      setProgress(userProgress);
    } catch (error) {
      console.error('Error loading progress:', error);
    }
  };

  const handleLogout = async () => {
    try {
      const { signOut } = await import('./lib/supabase');
      await signOut();
      setUser(null);
      setProgress({});
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const updateProgress = async (day, data) => {
    const newProgress = {
      ...progress,
      [day]: data
    };
    setProgress(newProgress);
    
    // Save to Supabase if user is logged in
    if (user) {
      try {
        await updateSupabaseProgress(user.id, day, data);
        
        // Update user's current day if completing a daily training
        if (data.completed && !day.startsWith('mock')) {
          const completedDay = parseInt(day);
          if (completedDay === user.currentDay && completedDay < 80) {
            const newCurrentDay = completedDay + 1;
            setUser({ ...user, currentDay: newCurrentDay });
            await updateCurrentDay(user.id, newCurrentDay);
          }
        }
      } catch (error) {
        console.error('Error updating progress:', error);
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading system</div>;
  }

  if (!user) {
    return (
      <>
        <button className="theme-toggle" onClick={toggleTheme}>
          {theme === 'dark' ? 'LIGHT' : 'DARK'}
        </button>
        <Login onLogin={handleLogin} />
      </>
    );
  }

  return (
    <Router>
      <div className="app">
        <button className="theme-toggle" onClick={toggleTheme}>
          {theme === 'dark' ? 'LIGHT' : 'DARK'}
        </button>
        <Navigation user={user} onLogout={handleLogout} />
        <main className="main-content">
          <Routes>
            <Route path="/" element={
              <Dashboard 
                user={user} 
                progress={progress} 
                curriculum={curriculum} 
                updateProgress={updateProgress}
              />
            } />
            <Route path="/training/:day" element={
              <DailyTraining 
                curriculum={curriculum} 
                progress={progress} 
                updateProgress={updateProgress} 
              />
            } />
            <Route path="/mock-test" element={
              <MockTest updateProgress={updateProgress} />
            } />
            <Route path="/progress" element={
              <Progress progress={progress} curriculum={curriculum} />
            } />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;