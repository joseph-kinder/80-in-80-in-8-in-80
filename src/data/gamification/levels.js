// Level system configuration
export const LEVELS = [
  { level: 1, title: 'Beginner', xpRequired: 0, icon: '[1]' },
  { level: 2, title: 'Novice Calculator', xpRequired: 100, icon: '[2]' },
  { level: 3, title: 'Number Cruncher', xpRequired: 250, icon: '[3]' },
  { level: 4, title: 'Mental Math Student', xpRequired: 450, icon: '[4]' },
  { level: 5, title: 'Arithmetic Apprentice', xpRequired: 700, icon: '[5]' },
  { level: 6, title: 'Speed Solver', xpRequired: 1000, icon: '[6]' },
  { level: 7, title: 'Math Warrior', xpRequired: 1400, icon: '[7]' },
  { level: 8, title: 'Number Ninja', xpRequired: 1850, icon: '[8]' },
  { level: 9, title: 'Calculation Champion', xpRequired: 2350, icon: '[9]' },
  { level: 10, title: 'Math Maestro', xpRequired: 2900, icon: '[10]' },
  { level: 11, title: 'Arithmetic Ace', xpRequired: 3500, icon: '[11]' },
  { level: 12, title: 'Mental Math Master', xpRequired: 4150, icon: '[12]' },
  { level: 13, title: 'Number Wizard', xpRequired: 4850, icon: '[13]' },
  { level: 14, title: 'Calculation Virtuoso', xpRequired: 5600, icon: '[14]' },
  { level: 15, title: 'Math Prodigy', xpRequired: 6400, icon: '[15]' },
  { level: 16, title: 'Speed Demon', xpRequired: 7250, icon: '[16]' },
  { level: 17, title: 'Number Sage', xpRequired: 8150, icon: '[17]' },
  { level: 18, title: 'Math Oracle', xpRequired: 9100, icon: '[18]' },
  { level: 19, title: 'Calculation God', xpRequired: 10100, icon: '[19]' },
  { level: 20, title: 'Mathematical Legend', xpRequired: 11150, icon: '[20]' }
];

// XP rewards for different activities
export const XP_REWARDS = {
  readLesson: 10,
  completeDay: 50,
  perfectDay: 100,
  completeMockTest: 30,
  highMockScore: 70,
  achievement: 'varies' // Each achievement has its own XP reward
};

// Get level information from XP
export function getLevelFromXP(xp) {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].xpRequired) {
      return LEVELS[i];
    }
  }
  return LEVELS[0];
}

// Get XP required for next level
export function getXPForNextLevel(currentXP) {
  const currentLevel = getLevelFromXP(currentXP);
  const nextLevel = LEVELS.find(l => l.level === currentLevel.level + 1);
  
  if (!nextLevel) return 0; // Max level reached
  
  return nextLevel.xpRequired - currentXP;
}