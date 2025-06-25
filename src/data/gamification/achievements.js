// Achievement definitions
export const ACHIEVEMENTS = [
  // Progress Achievements
  {
    id: 'first_day',
    name: 'First Steps',
    description: 'Complete your first day of training',
    icon: '👶',
    xpReward: 50,
    coinsReward: 10,
    condition: (stats) => stats.daysCompleted >= 1
  },
  {
    id: 'week_warrior',
    name: 'Week Warrior',
    description: 'Complete 7 days of training',
    icon: '🗓️',
    xpReward: 100,
    coinsReward: 25,
    condition: (stats) => stats.daysCompleted >= 7
  },
  {
    id: 'monthly_master',
    name: 'Monthly Master',
    description: 'Complete 30 days of training',
    icon: '📅',
    xpReward: 300,
    coinsReward: 100,
    condition: (stats) => stats.daysCompleted >= 30
  },
  {
    id: 'halfway_hero',
    name: 'Halfway Hero',
    description: 'Reach day 40',
    icon: '🌓',
    xpReward: 500,
    coinsReward: 200,
    condition: (stats) => stats.currentDay >= 40
  }
];  {
    id: 'program_complete',
    name: 'Master of 80',
    description: 'Complete all 80 days',
    icon: '🎓',
    xpReward: 1000,
    coinsReward: 500,
    condition: (stats) => stats.daysCompleted >= 80
  },
  
  // Streak Achievements
  {
    id: 'streak_starter',
    name: 'Streak Starter',
    description: 'Maintain a 3-day streak',
    icon: '🔥',
    xpReward: 75,
    coinsReward: 20,
    condition: (stats) => stats.currentStreak >= 3
  },
  {
    id: 'streak_keeper',
    name: 'Streak Keeper',
    description: 'Maintain a 7-day streak',
    icon: '🔥🔥',
    xpReward: 150,
    coinsReward: 50,
    condition: (stats) => stats.currentStreak >= 7
  },
  {
    id: 'streak_master',
    name: 'Streak Master',
    description: 'Maintain a 30-day streak',
    icon: '🔥🔥🔥',
    xpReward: 500,
    coinsReward: 200,
    condition: (stats) => stats.currentStreak >= 30
  },
  
  // Performance Achievements
  {
    id: 'perfect_score',
    name: 'Perfectionist',
    description: 'Get a perfect score in any exercise',
    icon: '💯',
    xpReward: 100,
    coinsReward: 30,
    condition: (stats) => stats.perfectScores >= 1
  },
  {
    id: 'speed_demon',
    name: 'Speed Demon',
    description: 'Complete 20 problems in under 60 seconds',
    icon: '⚡',
    xpReward: 150,
    coinsReward: 40,
    condition: (stats) => stats.speedDemonCount >= 1
  },
  {
    id: 'accuracy_ace',
    name: 'Accuracy Ace',
    description: 'Maintain 95%+ accuracy for 5 consecutive days',
    icon: '🎯',
    xpReward: 200,
    coinsReward: 60,
    condition: (stats) => stats.highAccuracyDays >= 5
  },
  
  // Task Achievements
  {
    id: 'task_master',
    name: 'Task Master',
    description: 'Complete all daily tasks for 7 days',
    icon: '✅',
    xpReward: 250,
    coinsReward: 75,
    condition: (stats) => stats.taskCompletionDays >= 7
  },
  {
    id: 'lesson_learner',
    name: 'Eager Student',
    description: 'Read 20 daily lessons',
    icon: '📖',
    xpReward: 200,
    coinsReward: 50,
    condition: (stats) => stats.lessonsRead >= 20
  },
  
  // Mock Test Achievements
  {
    id: 'mock_master',
    name: 'Mock Test Master',
    description: 'Score 70+ on a mock test',
    icon: '🏅',
    xpReward: 300,
    coinsReward: 100,
    condition: (stats) => stats.highestMockScore >= 70
  },
  {
    id: 'mock_legend',
    name: 'Mock Test Legend',
    description: 'Score 80 on a mock test',
    icon: '🏆',
    xpReward: 500,
    coinsReward: 200,
    condition: (stats) => stats.highestMockScore >= 80
  }
];

// Check which achievements are newly earned
export function checkAchievements(stats, earnedAchievements = []) {
  const newAchievements = [];
  
  for (const achievement of ACHIEVEMENTS) {
    if (!earnedAchievements.includes(achievement.id) && achievement.condition(stats)) {
      newAchievements.push(achievement);
    }
  }
  
  return newAchievements;
}