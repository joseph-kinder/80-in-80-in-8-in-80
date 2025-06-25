export * from './levels.js';
export * from './achievements.js';
export * from './shop.js';

// Main gamification state manager
export const initializeGamification = () => {
  return {
    xp: 0,
    coins: 100, // Start with some coins
    level: 1,
    achievements: [],
    purchases: [],
    stats: {
      daysCompleted: 0,
      currentDay: 1,
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
    }
  };
};