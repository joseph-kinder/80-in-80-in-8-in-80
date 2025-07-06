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