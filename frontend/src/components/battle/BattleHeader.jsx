// src/components/battle/BattleHeader.jsx
import React, { useState, useEffect } from 'react';

const BattleHeader = ({ 
  turn, 
  playerEnergy, 
  enemyEnergy,
  difficulty,
  activePlayer,
  maxEnergy = 25,
  consecutiveActions = { player: 0, enemy: 0 },
  energyMomentum = { player: 0, enemy: 0 },
  playerActiveSynergies = [],
  enemyActiveSynergies = [],
  energyMomentumDetails = { player: null, enemy: null }
}) => {
  // Mobile detection
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const isMobile = windowWidth <= 768;
  const isVerySmall = windowWidth <= 400;
  
  // Helper to format synergy names and icons
  const formatSynergyDisplay = (synergy) => {
    const synergyIcons = {
      'species': '👥',
      'legendary_presence': '⭐',
      'stat_synergy': '💪',
      'form_protection': '🛡️',
      'balanced_team': '⚖️',
      'full_field': '🔥',
      'fortress_formation': '🏰',
      'arcane_resonance': '✨',
      'blitz_assault': '⚡',
      'enduring_will': '🔋',
      'swift_casting': '🌟'
    };
    
    return {
      icon: synergy.icon || synergyIcons[synergy.type] || synergyIcons[synergy.name?.toLowerCase().replace(' ', '_')] || '🎯',
      name: synergy.name || formatSynergyName(synergy)
    };
  };
  
  // Helper to format synergy names
  const formatSynergyName = (synergy) => {
    switch (synergy.type) {
      case 'species':
        return `${synergy.species} x${synergy.count}`;
      case 'stat_synergy':
        return synergy.name || `${synergy.stats[0]} + ${synergy.stats[1]}`;
      case 'legendary_presence':
        return 'Legendary Presence';
      case 'balanced_team':
        return 'Balanced Team';
      case 'full_field':
        return 'Full Force';
      case 'form_protection':
        return 'Guardian Presence';
      default:
        return synergy.name || 'Unknown Synergy';
    }
  };
  
  // Helper for combo colors
  const getComboColor = (comboCount) => {
    if (comboCount >= 5) return '#ff6b6b';
    if (comboCount >= 3) return '#ffd93d';
    if (comboCount >= 2) return '#6bcf7f';
    return '#ffffff';
  };
  
  const getDifficultyColor = (diff) => {
    switch (diff.toLowerCase()) {
      case 'easy': return '#4CAF50';
      case 'medium': return '#FFC107';
      case 'hard': return '#FF9800';
      case 'expert': return '#FF5722';
      default: return '#4CAF50';
    }
  };
  
  // Calculate total synergy bonus
  const calculateTotalBonus = (synergies) => {
    if (!synergies || synergies.length === 0) return 0;
    return synergies.reduce((total, syn) => total + (syn.bonus || 0), 0);
  };
  
  // Calculate combo bonus
  const calculateComboBonus = (consecutiveActions) => {
    if (consecutiveActions <= 1) return 1.0;
    
    // Balanced combo scaling - caps at 25% bonus
    const bonusPerAction = 0.05;
    const maxBonus = 0.25;
    
    return 1 + Math.min(consecutiveActions * bonusPerAction, maxBonus);
  };
  
  const playerTotalBonus = calculateTotalBonus(playerActiveSynergies);
  const enemyTotalBonus = calculateTotalBonus(enemyActiveSynergies);
  
  // Mobile limits
  const maxSynergies = isMobile ? 3 : 4;
  
  // Very small screens - two row layout
  if (isVerySmall) {
    return (
      <div className="battle-header mobile-compact">
        {/* Top row */}
        <div className="battle-header-top">
          <div className={`turn-indicator ${activePlayer === 'enemy' ? 'enemy-turn' : ''}`}>
            {activePlayer === 'player' ? '👤' : '🤖'}
            <span>T{turn}</span>
          </div>
          
          <div className="difficulty-indicator compact" 
            style={{ backgroundColor: getDifficultyColor(difficulty) }}>
            {difficulty.charAt(0).toUpperCase()}
          </div>
          
          <div className="energy-displays compact">
            <div className="player-energy">
              <span className="energy-label">You</span>
              <span className="energy-value">{playerEnergy}</span>
              {consecutiveActions.player > 1 && (
                <span className="combo-mini" style={{ color: getComboColor(consecutiveActions.player) }}>
                  x{consecutiveActions.player}
                </span>
              )}
            </div>
            <div className="enemy-energy">
              <span className="energy-label">Foe</span>
              <span className="energy-value">{enemyEnergy}</span>
              {consecutiveActions.enemy > 1 && (
                <span className="combo-mini" style={{ color: getComboColor(consecutiveActions.enemy) }}>
                  x{consecutiveActions.enemy}
                </span>
              )}
            </div>
          </div>
        </div>
        
        {/* Bottom row - synergies */}
        {(playerActiveSynergies.length > 0 || enemyActiveSynergies.length > 0) && (
          <div className="field-synergies compact">
            {playerActiveSynergies.length > 0 && (
              <div className="synergy-display player compact">
                <span className="synergy-label">Y:</span>
                <div className="synergy-list">
                  {playerActiveSynergies.slice(0, maxSynergies).map((synergy, index) => {
                    const { icon } = formatSynergyDisplay(synergy);
                    return (
                      <div 
                        key={index} 
                        className={`synergy-badge ${synergy.type}`}
                        title={`${synergy.name}: +${Math.round(synergy.bonus * 100)}%`}
                      >
                        <span className="synergy-icon">{icon}</span>
                        <span className="synergy-bonus">{Math.round(synergy.bonus * 100)}</span>
                      </div>
                    );
                  })}
                  {playerActiveSynergies.length > maxSynergies && (
                    <div className="synergy-badge more">+{playerActiveSynergies.length - maxSynergies}</div>
                  )}
                </div>
              </div>
            )}
            
            {enemyActiveSynergies.length > 0 && (
              <div className="synergy-display enemy compact">
                <span className="synergy-label">E:</span>
                <div className="synergy-list">
                  {enemyActiveSynergies.slice(0, maxSynergies).map((synergy, index) => {
                    const { icon } = formatSynergyDisplay(synergy);
                    return (
                      <div 
                        key={index} 
                        className={`synergy-badge ${synergy.type} enemy`}
                        title={`${synergy.name}: +${Math.round(synergy.bonus * 100)}%`}
                      >
                        <span className="synergy-icon">{icon}</span>
                        <span className="synergy-bonus">{Math.round(synergy.bonus * 100)}</span>
                      </div>
                    );
                  })}
                  {enemyActiveSynergies.length > maxSynergies && (
                    <div className="synergy-badge more enemy">+{enemyActiveSynergies.length - maxSynergies}</div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
  
  // Regular mobile/desktop layout
  return (
    <div className="battle-header">
      <div className="battle-info">
        {/* Turn and difficulty indicators */}
        <div className="turn-counter">
          <span className="turn-label">Turn</span>
          <span className="turn-number">{turn}</span>
        </div>
        
        <div className="difficulty-indicator" 
          style={{ backgroundColor: getDifficultyColor(difficulty) }}>
          {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
        </div>
        
        {/* Turn indicator */}
        <div className={`turn-indicator ${activePlayer === 'enemy' ? 'enemy-turn' : ''}`}>
          {activePlayer === 'player' ? (
            <span className="player-active">{isMobile ? '👤' : 'Your Turn'}</span>
          ) : (
            <span className="enemy-active">{isMobile ? '🤖' : 'Enemy Turn'}</span>
          )}
          {isMobile && <span className="turn-number">T{turn}</span>}
        </div>
        
        {/* Synergies in center */}
        {(playerActiveSynergies.length > 0 || enemyActiveSynergies.length > 0) && (
          <div className="field-synergies">
            {playerActiveSynergies.length > 0 && (
              <div className="synergy-display player">
                <span className="synergy-label">{isMobile ? 'Y:' : 'Your:'}</span>
                <div className="synergy-list">
                  {playerActiveSynergies.slice(0, maxSynergies).map((synergy, index) => {
                    const { icon, name } = formatSynergyDisplay(synergy);
                    return (
                      <div 
                        key={index} 
                        className={`synergy-badge ${synergy.type}`}
                        title={`${name}: +${Math.round(synergy.bonus * 100)}%`}
                      >
                        <span className="synergy-icon">{icon}</span>
                        <span className="synergy-bonus">
                          {isMobile ? Math.round(synergy.bonus * 100) : `+${Math.round(synergy.bonus * 100)}%`}
                        </span>
                      </div>
                    );
                  })}
                  {playerActiveSynergies.length > maxSynergies && (
                    <div className="synergy-badge more" title={`${playerActiveSynergies.length - maxSynergies} more synergies`}>
                      +{playerActiveSynergies.length - maxSynergies}
                    </div>
                  )}
                  {!isMobile && playerTotalBonus > 0 && (
                    <div className="synergy-total">
                      Total: +{Math.round(playerTotalBonus * 100)}%
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {enemyActiveSynergies.length > 0 && (
              <div className="synergy-display enemy">
                <span className="synergy-label">{isMobile ? 'E:' : 'Enemy:'}</span>
                <div className="synergy-list">
                  {enemyActiveSynergies.slice(0, maxSynergies).map((synergy, index) => {
                    const { icon, name } = formatSynergyDisplay(synergy);
                    return (
                      <div 
                        key={index} 
                        className={`synergy-badge ${synergy.type} enemy`}
                        title={`${name}: +${Math.round(synergy.bonus * 100)}%`}
                      >
                        <span className="synergy-icon">{icon}</span>
                        <span className="synergy-bonus">
                          {isMobile ? Math.round(synergy.bonus * 100) : `+${Math.round(synergy.bonus * 100)}%`}
                        </span>
                      </div>
                    );
                  })}
                  {enemyActiveSynergies.length > maxSynergies && (
                    <div className="synergy-badge more enemy" title={`${enemyActiveSynergies.length - maxSynergies} more synergies`}>
                      +{enemyActiveSynergies.length - maxSynergies}
                    </div>
                  )}
                  {!isMobile && enemyTotalBonus > 0 && (
                    <div className="synergy-total enemy">
                      Total: +{Math.round(enemyTotalBonus * 100)}%
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Energy displays */}
      <div className="energy-displays">
        <div className="player-energy-section">
          {consecutiveActions.player > 1 && (
            <div className="combo-counter player" style={{ color: getComboColor(consecutiveActions.player) }}>
              <span className="combo-label">{!isMobile && 'COMBO'}</span>
              <span className="combo-value">x{consecutiveActions.player}</span>
              {consecutiveActions.player >= 2 && !isMobile && (
                <span className="combo-bonus">
                  +{Math.round((calculateComboBonus(consecutiveActions.player) - 1) * 100)}%
                </span>
              )}
            </div>
          )}
          
          <div className="player-energy">
            <div className="energy-label">{isMobile ? 'You' : 'Your Energy'}</div>
            <div className="energy-value-container">
              <div className="energy-value">{playerEnergy}</div>
              {energyMomentum.player > 0 && (
                <div className="momentum-indicator" title={`Energy momentum: ${energyMomentum.player}`}>
                  <div 
                    className="momentum-progress"
                    style={{ 
                      width: `${(energyMomentum.player % 10) * 10}%`,
                      backgroundColor: '#FFD700'
                    }}
                  />
                  {!isMobile && (
                    <span className="momentum-text">
                      {energyMomentum.player}/10
                    </span>
                  )}
                </div>
              )}
            </div>
            {!isMobile && (
              <>
                <div className="energy-bar-container">
                  <div className="energy-bar" 
                    style={{ width: `${Math.min(100, (playerEnergy / maxEnergy) * 100)}%` }} />
                  {energyMomentumDetails.player && energyMomentumDetails.player.bonusRegen > 0 && (
                    <div className="bonus-regen-preview">
                      +{energyMomentumDetails.player.bonusRegen}
                    </div>
                  )}
                </div>
                {energyMomentumDetails.player && energyMomentum.player > 0 && (
                  <div className="momentum-info">
                    {energyMomentumDetails.player.nextThreshold} energy to next bonus
                  </div>
                )}
              </>
            )}
          </div>
        </div>
        
        <div className="enemy-energy-section">
          {consecutiveActions.enemy > 1 && (
            <div className="combo-counter enemy" style={{ color: getComboColor(consecutiveActions.enemy) }}>
              <span className="combo-label">{!isMobile && 'COMBO'}</span>
              <span className="combo-value">x{consecutiveActions.enemy}</span>
              {consecutiveActions.enemy >= 2 && !isMobile && (
                <span className="combo-bonus">
                  +{Math.round((calculateComboBonus(consecutiveActions.enemy) - 1) * 100)}%
                </span>
              )}
            </div>
          )}
          
          <div className="enemy-energy">
            <div className="energy-label">{isMobile ? 'Foe' : 'Enemy Energy'}</div>
            <div className="energy-value-container">
              <div className="energy-value">{enemyEnergy}</div>
              {energyMomentum.enemy > 0 && (
                <div className="momentum-indicator enemy" title={`Enemy momentum: ${energyMomentum.enemy}`}>
                  <div 
                    className="momentum-progress"
                    style={{ 
                      width: `${(energyMomentum.enemy % 10) * 10}%`,
                      backgroundColor: '#FF5722'
                    }}
                  />
                  {!isMobile && (
                    <span className="momentum-text">
                      {energyMomentum.enemy}/10
                    </span>
                  )}
                </div>
              )}
            </div>
            {!isMobile && (
              <>
                <div className="energy-bar-container">
                  <div className="energy-bar enemy" 
                    style={{ width: `${Math.min(100, (enemyEnergy / maxEnergy) * 100)}%` }} />
                  {energyMomentumDetails.enemy && energyMomentumDetails.enemy.bonusRegen > 0 && (
                    <div className="bonus-regen-preview enemy">
                      +{energyMomentumDetails.enemy.bonusRegen}
                    </div>
                  )}
                </div>
                {energyMomentumDetails.enemy && energyMomentum.enemy > 0 && (
                  <div className="momentum-info enemy">
                    {energyMomentumDetails.enemy.nextThreshold} energy to next bonus
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BattleHeader;
