// Achievement definitions
export const ACHIEVEMENTS = [
  // Progress Achievements
  {
    id: 'first_day',
    name: 'First Steps',
    description: 'Complete your first day of training',
    icon: '[1]',
    xpReward: 50,
    coinsReward: 10,
    condition: (stats) => stats.daysCompleted >= 1
  },
  {
    id: 'week_warrior',
    name: 'Week Warrior',
    description: 'Complete 7 days of training',
    icon: '[7]',
    xpReward: 100,
    coinsReward: 25,
    condition: (stats) => stats.daysCompleted >= 7
  },
  {
    id: 'monthly_master',
    name: 'Monthly Master',
    description: 'Complete 30 days of training',
    icon: '[30]',
    xpReward: 300,
    coinsReward: 100,
    condition: (stats) => stats.daysCompleted >= 30
  },
  {
    id: 'halfway_hero',
    name: 'Halfway Hero',
    description: 'Reach day 40',
    icon: '[40]',
    xpReward: 500,
    coinsReward: 200,
    condition: (stats) => stats.currentDay >= 40
  },
  {
    id: 'program_complete',
    name: 'Master of 80',
    description: 'Complete all 80 days',
    icon: '[80]',
    xpReward: 1000,
    coinsReward: 500,
    condition: (stats) => stats.daysCompleted >= 80
  },
  
  // Streak Achievements
  {
    id: 'streak_3',
    name: 'On Fire',
    description: 'Maintain a 3-day streak',
    icon: '[3*]',
    xpReward: 75,
    coinsReward: 20,
    condition: (stats) => stats.currentStreak >= 3
  },
  {
    id: 'streak_7',
    name: 'Dedicated',
    description: 'Maintain a 7-day streak',
    icon: '[7*]',
    xpReward: 150,
    coinsReward: 50,
    condition: (stats) => stats.currentStreak >= 7
  },
  {
    id: 'streak_14',
    name: 'Unstoppable',
    description: 'Maintain a 14-day streak',
    icon: '[14*]',
    xpReward: 300,
    coinsReward: 100,
    condition: (stats) => stats.currentStreak >= 14
  },
  {
    id: 'streak_30',
    name: 'Iron Will',
    description: 'Maintain a 30-day streak',
    icon: '[30*]',
    xpReward: 600,
    coinsReward: 250,
    condition: (stats) => stats.currentStreak >= 30
  },
  
  // Performance Achievements
  {
    id: 'first_perfect',
    name: 'Perfectionist',
    description: 'Get your first perfect score',
    icon: '[100]',
    xpReward: 100,
    coinsReward: 30,
    condition: (stats) => stats.perfectScores >= 1
  },
  {
    id: 'perfect_5',
    name: 'Precision Master',
    description: 'Get 5 perfect scores',
    icon: '[5x]',
    xpReward: 250,
    coinsReward: 100,
    condition: (stats) => stats.perfectScores >= 5
  },
  {
    id: 'perfect_20',
    name: 'Flawless',
    description: 'Get 20 perfect scores',
    icon: '[20x]',
    xpReward: 500,
    coinsReward: 300,
    condition: (stats) => stats.perfectScores >= 20
  },
  
  // Speed Achievements
  {
    id: 'speed_demon_1',
    name: 'Quick Thinker',
    description: 'Complete a day in under 8 minutes',
    icon: '[<8]',
    xpReward: 100,
    coinsReward: 40,
    condition: (stats) => stats.speedDemonCount >= 1
  },
  {
    id: 'speed_demon_10',
    name: 'Lightning Fast',
    description: 'Complete 10 days in under 8 minutes',
    icon: '[10<]',
    xpReward: 400,
    coinsReward: 150,
    condition: (stats) => stats.speedDemonCount >= 10
  },
  
  // Mock Test Achievements
  {
    id: 'mock_test_complete',
    name: 'Test Taker',
    description: 'Complete your first mock test',
    icon: '[T1]',
    xpReward: 50,
    coinsReward: 20,
    condition: (stats) => stats.highestMockScore > 0
  },
  {
    id: 'mock_test_80',
    name: 'Target Achieved',
    description: 'Score 80/80 on a mock test',
    icon: '[80!]',
    xpReward: 500,
    coinsReward: 200,
    condition: (stats) => stats.highestMockScore >= 80
  },
  
  // Learning Achievements
  {
    id: 'bookworm',
    name: 'Bookworm',
    description: 'Read 20 lessons',
    icon: '[L20]',
    xpReward: 150,
    coinsReward: 60,
    condition: (stats) => stats.lessonsRead >= 20
  },
  {
    id: 'scholar',
    name: 'Scholar',
    description: 'Read all 80 lessons',
    icon: '[L80]',
    xpReward: 400,
    coinsReward: 200,
    condition: (stats) => stats.lessonsRead >= 80
  }
];

// Check which achievements the user has earned
export function checkAchievements(stats, currentAchievements) {
  const newAchievements = [];
  
  ACHIEVEMENTS.forEach(achievement => {
    if (!currentAchievements.includes(achievement.id) && achievement.condition(stats)) {
      newAchievements.push(achievement);
    }
  });
  
  return newAchievements;
}