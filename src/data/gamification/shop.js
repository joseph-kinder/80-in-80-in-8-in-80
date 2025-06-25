// Shop items that can be purchased with coins
export const SHOP_ITEMS = {
  themes: [
    {
      id: 'theme_dark',
      name: 'Dark Mode',
      description: 'Easy on the eyes for late night training',
      icon: '🌙',
      cost: 0,
      type: 'theme',
      unlocked: true
    },
    {
      id: 'theme_light',
      name: 'Light Mode',
      description: 'Classic bright theme',
      icon: '☀️',
      cost: 0,
      type: 'theme',
      unlocked: true
    },
    {
      id: 'theme_matrix',
      name: 'Matrix Theme',
      description: 'Green terminal aesthetic',
      icon: '💚',
      cost: 100,
      type: 'theme',
      cssClass: 'matrix-theme'
    },
    {
      id: 'theme_sunset',
      name: 'Sunset Theme',
      description: 'Warm orange and pink gradients',
      icon: '🌅',
      cost: 150,
      type: 'theme',
      cssClass: 'sunset-theme'
    }
  ]
};    {
      id: 'theme_ocean',
      name: 'Ocean Theme',
      description: 'Deep blue and aqua colors',
      icon: '🌊',
      cost: 200,
      type: 'theme',
      cssClass: 'ocean-theme'
    },
    {
      id: 'theme_forest',
      name: 'Forest Theme',
      description: 'Natural greens and earth tones',
      icon: '🌲',
      cost: 250,
      type: 'theme',
      cssClass: 'forest-theme'
    },
    {
      id: 'theme_space',
      name: 'Space Theme',
      description: 'Dark with stars and cosmic colors',
      icon: '🚀',
      cost: 300,
      type: 'theme',
      cssClass: 'space-theme'
    },
    {
      id: 'theme_retro',
      name: 'Retro Theme',
      description: '80s synthwave aesthetic',
      icon: '🕹️',
      cost: 400,
      type: 'theme',
      cssClass: 'retro-theme'
    }
  ],
  
  powerups: [
    {
      id: 'hint_token',
      name: 'Hint Token',
      description: 'Get a hint for any problem',
      icon: '💡',
      cost: 50,
      type: 'consumable',
      quantity: 1
    },
    {
      id: 'skip_token',
      name: 'Skip Token',
      description: 'Skip a difficult problem',
      icon: '⏭️',
      cost: 75,
      type: 'consumable',
      quantity: 1
    },
    {
      id: 'time_freeze',
      name: 'Time Freeze',
      description: 'Pause the timer for 30 seconds',
      icon: '⏸️',
      cost: 100,
      type: 'consumable',
      quantity: 1
    },
    {
      id: 'second_chance',
      name: 'Second Chance',
      description: 'Retry a failed exercise',
      icon: '🔄',
      cost: 150,
      type: 'consumable',
      quantity: 1
    }
  ],
  
  badges: [
    {
      id: 'badge_gold_star',
      name: 'Gold Star Badge',
      description: 'Show off your excellence',
      icon: '⭐',
      cost: 200,
      type: 'badge'
    },
    {
      id: 'badge_lightning',
      name: 'Lightning Badge',
      description: 'For the speed demons',
      icon: '⚡',
      cost: 250,
      type: 'badge'
    },
    {
      id: 'badge_brain',
      name: 'Big Brain Badge',
      description: 'Maximum intelligence',
      icon: '🧠',
      cost: 300,
      type: 'badge'
    }
  ]
};

// Get user's available items
export function getUserShopData(coins, purchases = []) {
  const shopData = {
    coins,
    themes: [],
    powerups: {},
    badges: []
  };
  
  // Process themes
  SHOP_ITEMS.themes.forEach(theme => {
    shopData.themes.push({
      ...theme,
      owned: purchases.includes(theme.id) || theme.unlocked
    });
  });
  
  // Process powerups (count quantities)
  purchases.forEach(purchaseId => {
    const powerup = SHOP_ITEMS.powerups.find(p => p.id === purchaseId);
    if (powerup) {
      shopData.powerups[purchaseId] = (shopData.powerups[purchaseId] || 0) + 1;
    }
  });
  
  // Process badges
  SHOP_ITEMS.badges.forEach(badge => {
    shopData.badges.push({
      ...badge,
      owned: purchases.includes(badge.id)
    });
  });
  
  return shopData;
}