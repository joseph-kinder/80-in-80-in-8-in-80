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
    
    // Initialize curriculum immediately
    setCurriculum(generateFullCurriculum());
    
    const initAuth = async () => {
      try {
        // Check current session
        const { data: { session }, error } = await supabase.auth.getSession();
        console.log('[AUTH] Session check:', session ? 'Found' : 'None', error);
        
        if (session?.user && mounted) {
          // Load user data with timeout protection
          await loadUserDataSafely(session.user);
        }
      } catch (error) {
        console.error('[AUTH] Init error:', error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };
    
    // Start auth check
    initAuth();
    
    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('[AUTH] State changed:', event);
      
      if (event === 'SIGNED_IN' && session?.user) {
        setLoading(true);
        await loadUserDataSafely(session.user);
        setLoading(false);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setProgress({});
        setGamificationData(initializeGamification());
      }
    });
    
    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);
  const loadUserDataSafely = async (authUser) => {
    console.log(`[LOAD USER DATA] Starting for user: ${authUser.id}`);
    
    try {
      console.log('[LOAD USER DATA] Attempting to get profile...');
      let profile = null;
      try {
        profile = await getProfile(authUser.id);
        console.log('[LOAD USER DATA] getProfile returned:', profile);
      } catch (err) {
        console.error('[LOAD USER DATA] Error during getProfile call:', err.message, err);
        // Ensure profile is null if there was an error
        profile = null; 
      }
      
      if (!profile) {
        console.log('[LOAD USER DATA] Profile not found or fetch failed. Creating minimal local profile.');
        const username = authUser.user_metadata?.full_name || 
                        authUser.user_metadata?.name || 
                        (authUser.email ? authUser.email.split('@')[0] : 'guest');
        
        profile = {
          id: authUser.id,
          username,
          baseline_score: 40, // Default value
          current_day: 1    // Default value
        };
        
        console.log('[LOAD USER DATA] Minimal profile created:', profile);
        console.log('[LOAD USER DATA] Attempting to save minimal profile to Supabase (no await)...');
        supabase.from('profiles').insert({
          id: authUser.id,
          username: profile.username, // Use the derived username
          baseline_score: profile.baseline_score,
          current_day: profile.current_day
        }).then(result => {
          if (result.error) {
            console.error('[LOAD USER DATA] Minimal profile save ERROR:', result.error);
          } else {
            console.log('[LOAD USER DATA] Minimal profile save SUCCESS.');
          }
        }).catch(saveError => {
            console.error('[LOAD USER DATA] Exception during minimal profile save:', saveError);
        });
      } else {
        console.log('[LOAD USER DATA] Profile successfully fetched:', profile);
      }
      
      console.log('[LOAD USER DATA] Attempting to get progress data...');
      let userProgress = {};
      try {
        userProgress = await getProgress(authUser.id);
        console.log('[LOAD USER DATA] getProgress returned:', userProgress);
      } catch (err) {
        console.error('[LOAD USER DATA] Error during getProgress call:', err.message, err);
        userProgress = {}; // Fallback to empty object
      }
      
      console.log('[LOAD USER DATA] Attempting to get gamification data...');
      let userGamification = initializeGamification(); // Initialize with defaults
      try {
        userGamification = await getGamificationData(authUser.id);
        console.log('[LOAD USER DATA] getGamificationData returned:', userGamification);
      } catch (err) {
        console.error('[LOAD USER DATA] Error during getGamificationData call:', err.message, err);
        userGamification = initializeGamification(); // Fallback to defaults
      }
      
      console.log('[LOAD USER DATA] Setting user state...');
      setUser({
        id: authUser.id,
        email: authUser.email,
        name: profile.username,
        baselineScore: profile.baseline_score || 40,
        currentDay: profile.current_day || 1
      });
      
      setProgress(userProgress);
      setGamificationData(userGamification);
      
      if (userGamification.selectedTheme) {
        setTheme(userGamification.selectedTheme);
      }
      
      console.log('[LOAD USER DATA] Complete');
    } catch (error) {
      console.error('[LOAD USER DATA] Fatal error:', error);
      // Set minimal user to allow app access
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
    console.log('[HANDLE LOGIN] Called');
    setLoading(true);
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
    return (
      <div className="loading">
        <div>Loading system...</div>
        <div style={{ fontSize: '0.8em', marginTop: '10px', opacity: 0.7 }}>
          Initializing...
        </div>
      </div>
    );
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