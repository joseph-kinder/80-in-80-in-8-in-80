import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import DailyTraining from './components/DailyTraining';
import MockTest from './components/MockTest';
import Progress from './components/Progress';
import Login from './components/Login';
import Navigation from './components/Navigation';
import Gamification from './components/Gamification';
import { generateFullCurriculum } from './data/curriculum';
import { 
  supabase, 
  getProfile, 
  getProgress, 
  updateProgress as updateSupabaseProgress, 
  updateCurrentDay,
  getGamificationData,
  updateGamification 
} from './lib/supabase';
import { 
  initializeGamification, 
  checkAchievements, 
  XP_REWARDS, 
  getLevelFromXP 
} from './data/gamification';
import './styles/App.css';

function App() {
  const [user, setUser] = useState(null);
  const [curriculum, setCurriculum] = useState(null);
  const [progress, setProgress] = useState({});
  const [gamificationData, setGamificationData] = useState(initializeGamification());
  const [theme, setTheme] = useState('dark');
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);

  // Apply theme immediately on mount
  useEffect(() => {
    const themeClass = theme === 'light' ? 'light-theme' : 
                      theme === 'dark' ? '' :
                      `${theme}-theme`;
    document.body.className = themeClass;
  }, [theme]);

  useEffect(() => {
    console.log('[AUTH] Starting authentication check');
    let mounted = true;
    
    const initAuth = async () => {
      try {
        console.log('[AUTH] Getting session...');
        
        // Create a timeout promise
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Session check timed out after 5 seconds')), 5000);
        });
        
        // Race between getSession and timeout
        const sessionPromise = supabase.auth.getSession();
        
        const result = await Promise.race([sessionPromise, timeoutPromise]);
        
        if (!mounted) {
          console.log('[AUTH] Component unmounted, aborting');
          return;
        }
        
        const { data: { session }, error } = result;
        console.log('[AUTH] Session result:', session, 'error:', error);
        
        if (error) {
          console.error('[AUTH] Session error:', error);
        } else if (session?.user) {
          console.log('[AUTH] Session found, loading user data');
          await loadUserData(session.user);
        } else {
          console.log('[AUTH] No session found');
        }
      } catch (error) {
        console.error('[AUTH] Unexpected error:', error);
        console.error('[AUTH] Error details:', error.message, error.stack);
      } finally {
        if (mounted) {
          console.log('[AUTH] Auth check complete, setting loading to false');
          setLoading(false);
          setAuthChecked(true);
        }
      }
    };
    
    // Run auth check with a hard timeout fallback
    initAuth();
    
    // Absolute fallback - if still loading after 10 seconds, force stop
    const fallbackTimeout = setTimeout(() => {
      if (loading && mounted) {
        console.error('[AUTH] Hard timeout reached (10s), forcing loading to stop');
        setLoading(false);
        setAuthChecked(true);
      }
    }, 10000);
    
    // Set up auth listener
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('[AUTH] Auth state changed:', event, session?.user?.id);
      
      if (!authChecked) {
        console.log('[AUTH] Ignoring auth change - initial check not complete');
        return;
      }
      
      if (event === 'SIGNED_IN' && session?.user) {
        console.log('[AUTH] SIGNED_IN event - loading user data');
        try {
          await loadUserData(session.user);
        } catch (error) {
          console.error('[AUTH] Error loading user data on auth change:', error);
        }
      } else if (event === 'SIGNED_OUT') {
        console.log('[AUTH] SIGNED_OUT event');
        setUser(null);
        setProgress({});
        setGamificationData(initializeGamification());
      }
    });

    setCurriculum(generateFullCurriculum());

    return () => {
      mounted = false;
      clearTimeout(fallbackTimeout);
      authListener.subscription.unsubscribe();
    };
  }, [authChecked]);

  const loadUserData = async (authUser) => {
    console.log('[LOAD USER DATA] Starting to load user data for:', authUser.id);
    try {
      let profile = await getProfile(authUser.id);
      console.log('[LOAD USER DATA] Profile result:', profile);
      
      // If no profile exists (e.g., Google sign-in), create one
      if (!profile) {
        console.log('[LOAD USER DATA] No profile found, creating new one');
        const username = authUser.user_metadata?.full_name || authUser.email.split('@')[0];
        const { error: createError } = await supabase.rpc('create_user_profile', {
          user_id: authUser.id,
          user_name: username,
          user_baseline_score: 40 // Default baseline for Google users
        });
        
        if (!createError) {
          profile = await getProfile(authUser.id);
          console.log('[LOAD USER DATA] New profile created:', profile);
        } else {
          console.error('[LOAD USER DATA] Error creating profile:', createError);
        }
      }
      
      if (profile) {
        console.log('[LOAD USER DATA] Loading user progress');
        const userProgress = await getProgress(authUser.id);
        
        // Try to load gamification data, but don't fail if columns don't exist
        let userGamification;
        try {
          console.log('[LOAD USER DATA] Loading gamification data');
          userGamification = await getGamificationData(authUser.id);
        } catch (gamError) {
          console.warn('[LOAD USER DATA] Gamification data not available, using defaults:', gamError);
          userGamification = initializeGamification();
        }
        
        console.log('[LOAD USER DATA] Setting user state');
        setUser({
          id: authUser.id,
          email: authUser.email,
          name: profile.username,
          baselineScore: profile.baseline_score,
          currentDay: profile.current_day
        });
        
        setProgress(userProgress);
        setGamificationData(userGamification);
        
        // Apply saved theme
        if (userGamification.selectedTheme) {
          setTheme(userGamification.selectedTheme);
        }
        console.log('[LOAD USER DATA] User data loaded successfully');
      }
    } catch (error) {
      console.error('[LOAD USER DATA] Error loading user data:', error);
      // If profile doesn't exist, redirect to a profile setup page
      // For now, create a default profile
      console.log('[LOAD USER DATA] Creating default user profile');
      setUser({
        id: authUser.id,
        email: authUser.email,
        name: authUser.email.split('@')[0],
        baselineScore: 40,
        currentDay: 1
      });
      setGamificationData(initializeGamification());
    }
  };

  const handleLogin = async (userData) => {
    // Don't update state if we're already loading
    // The auth state change will handle everything
    console.log('[HANDLE LOGIN] Called but doing nothing - auth state change will handle it');
    return;
  };

  const handleLogout = async () => {
    try {
      const { signOut } = await import('./lib/supabase');
      await signOut();
      setUser(null);
      setProgress({});
      setGamificationData(initializeGamification());
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };
  
  const handlePurchase = async (item) => {
    const newGamificationData = { ...gamificationData };
    newGamificationData.coins -= item.cost;
    newGamificationData.purchases.push(item.id);
    
    setGamificationData(newGamificationData);
    
    if (user) {
      try {
        await updateGamification(user.id, newGamificationData);
      } catch (error) {
        console.error('Error saving purchase:', error);
      }
    }
  };
  
  const handleThemeChange = async (themeId) => {
    let newTheme = 'dark';
    if (themeId === 'theme_light') newTheme = 'light';
    else if (themeId === 'theme_matrix') newTheme = 'matrix';
    else if (themeId === 'theme_sunset') newTheme = 'sunset';
    else if (themeId === 'theme_ocean') newTheme = 'ocean';
    else if (themeId === 'theme_forest') newTheme = 'forest';
    else if (themeId === 'theme_space') newTheme = 'space';
    else if (themeId === 'theme_retro') newTheme = 'retro';
    
    setTheme(newTheme);
    
    const newGamificationData = { ...gamificationData };
    newGamificationData.selectedTheme = newTheme;
    setGamificationData(newGamificationData);
    
    if (user) {
      try {
        await updateGamification(user.id, newGamificationData);
      } catch (error) {
        console.error('Error saving theme:', error);
      }
    }
  };

  const updateProgress = async (day, data) => {
    const newProgress = {
      ...progress,
      [day]: data
    };
    setProgress(newProgress);
    
    // Calculate XP and coin rewards
    let xpEarned = 0;
    let coinsEarned = 0;
    const newAchievements = [];
    
    // Award XP for different activities
    if (data.lessonRead && !progress[day]?.lessonRead) {
      xpEarned += XP_REWARDS.readLesson;
      coinsEarned += 5;
    }
    
    if (data.completed && !progress[day]?.completed) {
      xpEarned += XP_REWARDS.completeDay;
      coinsEarned += 20;
      
      // Check for perfect day
      if (data.score >= 80) {
        xpEarned += XP_REWARDS.perfectDay - XP_REWARDS.completeDay;
        coinsEarned += 30;
      }
    }
    
    // Update gamification stats
    const newGamificationData = { ...gamificationData };
    newGamificationData.xp += xpEarned;
    newGamificationData.coins += coinsEarned;
    
    // Update stats
    if (data.completed && !progress[day]?.completed) {
      newGamificationData.stats.daysCompleted++;
      newGamificationData.stats.currentDay = Math.max(newGamificationData.stats.currentDay, parseInt(day));
    }
    
    if (data.lessonRead && !progress[day]?.lessonRead) {
      newGamificationData.stats.lessonsRead++;
    }
    
    // Check for level up
    const oldLevel = getLevelFromXP(gamificationData.xp);
    const newLevel = getLevelFromXP(newGamificationData.xp);
    if (newLevel.level > oldLevel.level) {
      newGamificationData.level = newLevel.level;
      coinsEarned += 50; // Level up bonus
      newGamificationData.coins += 50;
    }
    
    // Check for new achievements
    const earnedAchievements = checkAchievements(newGamificationData.stats, gamificationData.achievements);
    if (earnedAchievements.length > 0) {
      earnedAchievements.forEach(achievement => {
        newGamificationData.achievements.push(achievement.id);
        newGamificationData.xp += achievement.xpReward;
        newGamificationData.coins += achievement.coinsReward;
        newAchievements.push(achievement);
      });
    }
    
    newGamificationData.newAchievements = newAchievements;
    setGamificationData(newGamificationData);
    
    // Save to Supabase if user is logged in
    if (user) {
      try {
        await updateSupabaseProgress(user.id, day, data);
        await updateGamification(user.id, newGamificationData);
        
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
    console.log('[RENDER] Showing loading screen - loading:', loading, 'user:', user);
    return <div className="loading">Loading system</div>;
  }

  if (!user) {
    console.log('[RENDER] Showing login screen - loading:', loading, 'user:', user);
    return (
      <>
        <button className="theme-toggle" onClick={toggleTheme}>
          {theme === 'dark' ? 'LIGHT' : 'DARK'}
        </button>
        <Login onLogin={handleLogin} />
      </>
    );
  }

  console.log('[RENDER] Showing main app - loading:', loading, 'user:', user);
  return (
    <Router>
      <div className="app">
        <button className="theme-toggle" onClick={toggleTheme}>
          {theme === 'dark' ? 'LIGHT' : 'DARK'}
        </button>
        <Navigation user={user} onLogout={handleLogout} />
        <Gamification 
          gamificationData={gamificationData}
          onPurchase={handlePurchase}
          onThemeChange={handleThemeChange}
        />
        <main className="main-content">
          <Routes>
            <Route path="/" element={
              <Dashboard 
                user={user} 
                progress={progress} 
                curriculum={curriculum} 
                updateProgress={updateProgress}
                gamificationData={gamificationData}
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