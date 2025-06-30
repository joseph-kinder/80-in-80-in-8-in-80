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
    setLoading(true);
    supabase.auth.getSession()
      .then(async ({ data: { session } }) => {
        try {
          if (session?.user) {
            await loadUserData(session.user);
          }
        } catch (error) {
          console.error('Error loading user data on initial load:', error);
        } finally {
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error('Error getting session:', error);
        setLoading(false);
      });

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        setLoading(true);
        try {
          await loadUserData(session.user);
        } catch (error) {
          console.error('Error loading user data on auth change:', error);
        } finally {
          setLoading(false);
        }
      }
      if (event === 'SIGNED_OUT') {
        setUser(null);
        setProgress({});
        setGamificationData(initializeGamification());
        setLoading(false);
      }
    });

    setCurriculum(generateFullCurriculum());

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

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
        
        // Try to load gamification data, but don't fail if columns don't exist
        let userGamification;
        try {
          userGamification = await getGamificationData(authUser.id);
        } catch (gamError) {
          console.warn('Gamification data not available, using defaults:', gamError);
          userGamification = initializeGamification();
        }
        
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
      setGamificationData(initializeGamification());
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