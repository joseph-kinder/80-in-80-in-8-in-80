import { createClient } from '@supabase/supabase-js'

// You'll need to replace these with your actual Supabase project credentials
// Copy .env.example to .env and fill in your values
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY'

console.log('[SUPABASE] Initializing with URL:', supabaseUrl);
console.log('[SUPABASE] URL is placeholder?', supabaseUrl === 'YOUR_SUPABASE_URL');

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Auth helpers
export const signUp = async (email, password, username, baselineScore) => {
  // First, sign up the user
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password
  })
  
  if (authError) throw authError
  
  // Create profile using RPC function to bypass RLS
  if (authData.user) {
    const { error: profileError } = await supabase.rpc('create_user_profile', {
      user_id: authData.user.id,
      user_name: username,
      user_baseline_score: baselineScore
    })
    
    if (profileError) {
      console.error('Profile creation error:', profileError)
      // Try direct insert as fallback
      const { error: insertError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          username,
          baseline_score: baselineScore,
          current_day: 1
        })
      
      if (insertError) {
        console.error('Direct insert also failed:', insertError)
        throw insertError
      }
    }
  }
  
  return authData
}

export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  
  if (error) {
    // Check if it's an email confirmation error
    if (error.message.includes('Email not confirmed')) {
      throw new Error('Please check your email and confirm your account before signing in.')
    }
    throw error
  }
  
  return data
}

export const signInWithGoogle = async () => {
  // Use environment variable for production URL, fallback to current origin for development
  const redirectUrl = import.meta.env.VITE_APP_URL || window.location.origin
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: redirectUrl
    }
  })
  
  if (error) throw error
  return data
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export const getProfile = async (userId) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  
  if (error && error.code === 'PGRST116') {
    // No profile found
    return null
  }
  
  if (error) throw error
  return data
}

export const updateProgress = async (userId, day, progressData) => {
  const { error } = await supabase
    .from('progress')
    .upsert({
      user_id: userId,
      day: day,
      data: progressData,
      updated_at: new Date().toISOString()
    })
  
  if (error) throw error
}

export const getProgress = async (userId) => {
  const { data, error } = await supabase
    .from('progress')
    .select('*')
    .eq('user_id', userId)
  
  if (error) throw error
  
  // Convert to object format
  const progressObj = {}
  data.forEach(item => {
    progressObj[item.day] = item.data
  })
  
  return progressObj
}

export const updateCurrentDay = async (userId, currentDay) => {
  const { error } = await supabase
    .from('profiles')
    .update({ current_day: currentDay })
    .eq('id', userId)
  
  if (error) throw error
}

// Gamification functions
export const updateGamification = async (userId, updates) => {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({
        xp: updates.xp,
        coins: updates.coins,
        level: updates.level,
        achievements: updates.achievements,
        purchases: updates.purchases,
        gamification_stats: updates.stats,
        selected_theme: updates.selectedTheme
      })
      .eq('id', userId)
    
    if (error) {
      console.warn('Error updating gamification data:', error);
      // Don't throw, just log the error
    }
  } catch (error) {
    console.error('Error in updateGamification:', error);
  }
}

export const getGamificationData = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('xp, coins, level, achievements, purchases, gamification_stats, selected_theme')
      .eq('id', userId)
      .single()
    
    if (error) {
      console.warn('Error fetching gamification data:', error);
      // Return default values if columns don't exist
      return {
        xp: 0,
        coins: 100,
        level: 1,
        achievements: [],
        purchases: [],
        stats: {
          daysCompleted: 0,
          currentStreak: 0,
          longestStreak: 0,
          perfectScores: 0,
          speedDemonCount: 0,
          highAccuracyDays: 0,
          taskCompletionDays: 0,
          lessonsRead: 0,
          highestMockScore: 0,
          totalProblems: 0,
          correctProblems: 0
        },
        selectedTheme: 'dark'
      };
    }
    
    return {
      xp: data.xp || 0,
      coins: data.coins || 100,
      level: data.level || 1,
      achievements: data.achievements || [],
      purchases: data.purchases || [],
      stats: data.gamification_stats || {
        daysCompleted: 0,
        currentStreak: 0,
        longestStreak: 0,
        perfectScores: 0,
        speedDemonCount: 0,
        highAccuracyDays: 0,
        taskCompletionDays: 0,
        lessonsRead: 0,
        highestMockScore: 0,
        totalProblems: 0,
        correctProblems: 0
      },
      selectedTheme: data.selected_theme || 'dark'
    };
  } catch (error) {
    console.error('Error in getGamificationData:', error);
    // Return defaults on any error
    return {
      xp: 0,
      coins: 100,
      level: 1,
      achievements: [],
      purchases: [],
      stats: {
        daysCompleted: 0,
        currentStreak: 0,
        longestStreak: 0,
        perfectScores: 0,
        speedDemonCount: 0,
        highAccuracyDays: 0,
        taskCompletionDays: 0,
        lessonsRead: 0,
        highestMockScore: 0,
        totalProblems: 0,
        correctProblems: 0
      },
      selectedTheme: 'dark'
    };
  }
}