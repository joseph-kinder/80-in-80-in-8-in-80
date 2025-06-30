// Shop items that can be purchased with coins
export const SHOP_ITEMS = {
  themes: [
    {
      id: 'theme_dark',
      name: 'Dark Mode',
      description: 'Easy on the eyes for late night training',
      icon: '[D]',
      cost: 0,
      type: 'theme',
      unlocked: true
    },
    {
      id: 'theme_light',
      name: 'Light Mode',
      description: 'Classic bright theme',
      icon: '[L]',
      cost: 0,
      type: 'theme',
      unlocked: true
    },
    {
      id: 'theme_matrix',
      name: 'Matrix Theme',
      description: 'Green terminal aesthetic',
      icon: '[M]',
      cost: 100,
      type: 'theme',
      cssClass: 'matrix-theme'
    },
    {
      id: 'theme_sunset',
      name: 'Sunset Theme',
      description: 'Warm orange and pink gradients',
      icon: '[S]',
      cost: 150,
      type: 'theme',
      cssClass: 'sunset-theme'
    },
    {
      id: 'theme_ocean',
      name: 'Ocean Theme',
      description: 'Deep blue and aqua colors',
      icon: '[O]',
      cost: 200,
      type: 'theme',
      cssClass: 'ocean-theme'
    },
    {
      id: 'theme_forest',
      name: 'Forest Theme',
      description: 'Natural green and brown tones',
      icon: '[F]',
      cost: 200,
      type: 'theme',
      cssClass: 'forest-theme'
    },
    {
      id: 'theme_space',
      name: 'Space Theme',
      description: 'Dark with purple and blue accents',
      icon: '[SP]',
      cost: 300,
      type: 'theme',
      cssClass: 'space-theme'
    },
    {
      id: 'theme_retro',
      name: 'Retro Theme',
      description: 'Neon colors and synthwave vibes',
      icon: '[R]',
      cost: 400,
      type: 'theme',
      cssClass: 'retro-theme'
    }
  ],
  
  badges: [
    {
      id: 'badge_focus',
      name: 'Focus Boost',
      description: 'Highlights important information during training',
      icon: '[+F]',
      cost: 250,
      type: 'badge',
      effect: 'visual_aid'
    },
    {
      id: 'badge_motivator',
      name: 'Motivator',
      description: 'Shows encouraging messages during challenges',
      icon: '[+M]',
      cost: 300,
      type: 'badge',
      effect: 'motivation'
    },
    {
      id: 'badge_elite',
      name: 'Elite Status',
      description: 'Special border around your profile',
      icon: '[+E]',
      cost: 500,
      type: 'badge',
      effect: 'cosmetic'
    },
    {
      id: 'badge_mentor',
      name: 'Math Mentor',
      description: 'Unlock additional tips and strategies',
      icon: '[+T]',
      cost: 750,
      type: 'badge',
      effect: 'tips'
    },
    {
      id: 'badge_legendary',
      name: 'Legendary Badge',
      description: 'The ultimate status symbol',
      icon: '[+L]',
      cost: 1000,
      type: 'badge',
      effect: 'cosmetic'
    }
  ]
};

// Get shop items with ownership status
export function getUserShopData(userCoins, userPurchases) {
  return {
    themes: SHOP_ITEMS.themes.map(theme => ({
      ...theme,
      owned: theme.unlocked || userPurchases.includes(theme.id),
      canAfford: userCoins >= theme.cost
    })),
    badges: SHOP_ITEMS.badges.map(badge => ({
      ...badge,
      owned: userPurchases.includes(badge.id),
      canAfford: userCoins >= badge.cost
    }))
  };
}