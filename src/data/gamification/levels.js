// Level progression system
export const LEVELS = [
  { level: 1, title: 'Math Novice', xpRequired: 0, icon: '🌱' },
  { level: 2, title: 'Number Cruncher', xpRequired: 100, icon: '🔢' },
  { level: 3, title: 'Quick Calculator', xpRequired: 250, icon: '🧮' },
  { level: 4, title: 'Mental Math Student', xpRequired: 450, icon: '📚' },
  { level: 5, title: 'Arithmetic Apprentice', xpRequired: 700, icon: '🎓' },
  { level: 6, title: 'Speed Solver', xpRequired: 1000, icon: '⚡' },
  { level: 7, title: 'Math Warrior', xpRequired: 1400, icon: '⚔️' },
  { level: 8, title: 'Number Ninja', xpRequired: 1850, icon: '🥷' },
  { level: 9, title: 'Calculation Champion', xpRequired: 2350, icon: '🏆' },
  { level: 10, title: 'Math Maestro', xpRequired: 2900, icon: '🎭' },
  { level: 11, title: 'Arithmetic Ace', xpRequired: 3500, icon: '♠️' },
  { level: 12, title: 'Mental Math Master', xpRequired: 4150, icon: '🧠' },
  { level: 13, title: 'Number Wizard', xpRequired: 4850, icon: '🧙' },
  { level: 14, title: 'Calculation Virtuoso', xpRequired: 5600, icon: '🎵' },
  { level: 15, title: 'Math Prodigy', xpRequired: 6400, icon: '✨' },
  { level: 16, title: 'Speed Demon', xpRequired: 7250, icon: '😈' },
  { level: 17, title: 'Number Sage', xpRequired: 8150, icon: '🦉' },
  { level: 18, title: 'Math Oracle', xpRequired: 9100, icon: '🔮' },
  { level: 19, title: 'Calculation God', xpRequired: 10100, icon: '⚡' },
  { level: 20, title: 'Mathematical Legend', xpRequired: 11150, icon: '👑' }
];

// XP rewards for different activities
export const XP_REWARDS = {
  // Daily Training  completeExercise: 10,
  perfectExercise: 20,
  completeDay: 50,
  perfectDay: 100,
  
  // Daily Tasks
  completeTask: 15,
  perfectTask: 25,
  allDailyTasks: 75,
  
  // Lessons
  readLesson: 20,
  
  // Mock Tests
  completeMockTest: 30,
  mockTestHighScore: 50,
  
  // Streaks
  dailyStreak3: 50,
  dailyStreak7: 150,
  dailyStreak14: 300,
  dailyStreak30: 500,
  
  // Achievements
  firstPerfectScore: 100,
  speedDemon: 75, // Complete exercise under time limit
  accuracyKing: 75, // 100% accuracy on 5+ exercises
  marathonRunner: 100, // Complete 10 exercises in one day
};

// Calculate level from XP
export function getLevelFromXP(xp) {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].xpRequired) {
      return LEVELS[i];
    }
  }
  return LEVELS[0];
}

// Calculate XP needed for next level
export function getXPForNextLevel(currentXP) {
  const currentLevel = getLevelFromXP(currentXP);
  const nextLevel = LEVELS.find(l => l.level === currentLevel.level + 1);
  if (!nextLevel) return 0;
  return nextLevel.xpRequired - currentXP;
}