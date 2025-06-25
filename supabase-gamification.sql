-- Add gamification columns to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS xp INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS coins INTEGER DEFAULT 100;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS level INTEGER DEFAULT 1;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS achievements JSONB DEFAULT '[]'::jsonb;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS purchases JSONB DEFAULT '[]'::jsonb;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS gamification_stats JSONB DEFAULT '{
  "daysCompleted": 0,
  "currentStreak": 0,
  "longestStreak": 0,
  "perfectScores": 0,
  "speedDemonCount": 0,
  "highAccuracyDays": 0,
  "taskCompletionDays": 0,
  "lessonsRead": 0,
  "highestMockScore": 0,
  "totalProblems": 0,
  "correctProblems": 0
}'::jsonb;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS selected_theme VARCHAR(50) DEFAULT 'dark';

-- Add lesson_read to progress data
-- This will be handled in the application layer since progress.data is JSONB