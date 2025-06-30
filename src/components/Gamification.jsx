import React, { useState, useEffect } from 'react';
import { getLevelFromXP, getXPForNextLevel, ACHIEVEMENTS, getUserShopData } from '../data/gamification';
import './Gamification.css';

function Gamification({ gamificationData, onPurchase, onThemeChange }) {
  const [showShop, setShowShop] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [notification, setNotification] = useState(null);
  
  const currentLevel = getLevelFromXP(gamificationData.xp);
  const xpForNext = getXPForNextLevel(gamificationData.xp);
  const xpProgress = currentLevel.level < 20 ? 
    ((gamificationData.xp - currentLevel.xpRequired) / (xpForNext + (gamificationData.xp - currentLevel.xpRequired))) * 100 : 100;
  
  const shopData = getUserShopData(gamificationData.coins, gamificationData.purchases);
  
  // Show notifications for achievements
  useEffect(() => {
    if (gamificationData.newAchievements && gamificationData.newAchievements.length > 0) {
      gamificationData.newAchievements.forEach((achievement, index) => {
        setTimeout(() => {
          setNotification({
            type: 'achievement',
            title: 'Achievement Unlocked!',
            message: achievement.name,
            icon: achievement.icon
          });
        }, index * 3000);
      });
    }
  }, [gamificationData.newAchievements]);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 2500);
      return () => clearTimeout(timer);
    }
  }, [notification]);
  
  const handlePurchase = (item) => {
    if (item.cost <= gamificationData.coins) {
      onPurchase(item);
      setNotification({
        type: 'purchase',
        title: 'Purchase Complete!',
        message: `You bought ${item.name}`,
        icon: item.icon
      });
    }
  };
  
  return (
    <>
      {/* Gamification Bar */}
      <div className="gamification-bar">
        <div className="level-info">
          <span className="level-icon">{currentLevel.icon}</span>
          <div className="level-details">
            <span className="level-title">Level {currentLevel.level}: {currentLevel.title}</span>
            <div className="xp-bar">
              <div className="xp-fill" style={{ width: `${xpProgress}%` }} />
            </div>
            <span className="xp-text">{gamificationData.xp} XP</span>
          </div>
        </div>
        
        <div className="currency-info">
          <span className="coins">COINS: {gamificationData.coins}</span>
          <button onClick={() => setShowShop(!showShop)} className="shop-btn">
            SHOP
          </button>
          <button onClick={() => setShowAchievements(!showAchievements)} className="achievements-btn">
            ACHIEVEMENTS ({gamificationData.achievements.length})
          </button>
        </div>
      </div>
      
      {/* Notifications */}
      {notification && (
        <div className={`notification ${notification.type}`}>
          <span className="notification-icon">{notification.icon}</span>
          <div>
            <h4>{notification.title}</h4>
            <p>{notification.message}</p>
          </div>
        </div>
      )}
      
      {/* Shop Modal */}
      {showShop && (
        <div className="modal-overlay" onClick={() => setShowShop(false)}>
          <div className="shop-modal" onClick={e => e.stopPropagation()}>
            <h2>SHOP</h2>
            <p className="coins-display">Your Coins: {gamificationData.coins}</p>
            
            <div className="shop-section">
              <h3>THEMES</h3>
              <div className="shop-items">
                {shopData.themes.map(theme => (
                  <div key={theme.id} className={`shop-item ${theme.owned ? 'owned' : ''}`}>
                    <span className="item-icon">{theme.icon}</span>
                    <div className="item-info">
                      <h4>{theme.name}</h4>
                      <p>{theme.description}</p>
                    </div>
                    {theme.owned ? (
                      <button onClick={() => onThemeChange(theme.id)} className="use-btn">
                        Use
                      </button>
                    ) : (
                      <button 
                        onClick={() => handlePurchase(theme)}
                        disabled={theme.cost > gamificationData.coins}
                        className="buy-btn"
                      >
                        {theme.cost} COINS
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="shop-section">
              <h3>POWER-UPS</h3>
              <div className="shop-items">
                {shopData.badges.map(badge => (
                  <div key={badge.id} className={`shop-item ${badge.owned ? 'owned' : ''}`}>
                    <span className="item-icon">{badge.icon}</span>
                    <div className="item-info">
                      <h4>{badge.name}</h4>
                      <p>{badge.description}</p>
                    </div>
                    {badge.owned ? (
                      <span className="owned-label">Owned</span>
                    ) : (
                      <button 
                        onClick={() => handlePurchase(badge)}
                        disabled={badge.cost > gamificationData.coins}
                        className="buy-btn"
                      >
                        {badge.cost} COINS
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            <button onClick={() => setShowShop(false)} className="close-btn">Close</button>
          </div>
        </div>
      )}
      
      {/* Achievements Modal */}
      {showAchievements && (
        <div className="modal-overlay" onClick={() => setShowAchievements(false)}>
          <div className="achievements-modal" onClick={e => e.stopPropagation()}>
            <h2>ACHIEVEMENTS</h2>
            <p>Unlocked: {gamificationData.achievements.length} / {ACHIEVEMENTS.length}</p>
            
            <div className="achievements-list">
              {ACHIEVEMENTS.map(achievement => {
                const isUnlocked = gamificationData.achievements.includes(achievement.id);
                return (
                  <div key={achievement.id} className={`achievement-item ${isUnlocked ? 'unlocked' : 'locked'}`}>
                    <span className="achievement-icon">{isUnlocked ? achievement.icon : '[LOCKED]'}</span>
                    <div className="achievement-info">
                      <h4>{achievement.name}</h4>
                      <p>{achievement.description}</p>
                      {isUnlocked && (
                        <span className="rewards">+{achievement.xpReward} XP, +{achievement.coinsReward} COINS</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            
            <button onClick={() => setShowAchievements(false)} className="close-btn">Close</button>
          </div>
        </div>
      )}
    </>
  );
}

export default Gamification;