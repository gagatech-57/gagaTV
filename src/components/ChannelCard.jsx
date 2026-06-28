import React from 'react';
import { Heart } from 'lucide-react';

const ChannelCard = ({ 
  channel, 
  isActive, 
  onSelect, 
  isFavorite, 
  onToggleFavorite 
}) => {
  const getInitials = (name) => {
    if (!name) return 'TV';
    const words = name.trim().split(/\s+/);
    if (words.length >= 2) {
      return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
    }
    return name.trim().substring(0, 2).toUpperCase();
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    onToggleFavorite(channel);
  };

  // Generate a premium unique gradient background based on channel name
  const getRandomGradient = (name) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const colors = [
      ['#6366f1', '#a855f7'], // Indigo -> Purple
      ['#3b82f6', '#06b6d4'], // Blue -> Cyan
      ['#ec4899', '#f43f5e'], // Pink -> Rose
      ['#14b8a6', '#00f5a0'], // Teal -> Mint
      ['#f59e0b', '#ec4899']  // Amber -> Pink
    ];
    const index = Math.abs(hash) % colors.length;
    return `linear-gradient(135deg, ${colors[index][0]} 0%, ${colors[index][1]} 100%)`;
  };

  return (
    <div 
      className={`channel-card ${isActive ? 'active' : ''} glass-panel`}
      onClick={() => onSelect(channel)}
    >
      <button 
        onClick={handleFavoriteClick}
        className={`card-favorite-btn ${isFavorite ? 'is-fav' : ''}`}
        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
      >
        <Heart size={15} fill={isFavorite ? 'currentColor' : 'none'} />
      </button>

      {channel.isTamil && (
        <span className="card-badge badge badge-tamil" style={{ position: 'absolute', top: '10px', right: '10px', padding: '2px 6px', fontSize: '0.65rem' }}>
          TAM
        </span>
      )}

      <div className="card-logo-container">
        {channel.logo ? (
          <img 
            src={channel.logo} 
            alt="" 
            className="card-logo"
            loading="lazy"
            onError={(e) => {
              e.target.style.display = 'none';
              const parent = e.target.parentElement;
              if (parent) {
                const placeholder = parent.querySelector('.card-logo-placeholder-js');
                if (placeholder) placeholder.style.display = 'flex';
              }
            }}
          />
        ) : null}
        <div 
          className="card-logo-placeholder card-logo-placeholder-js" 
          style={{ 
            display: channel.logo ? 'none' : 'flex',
            width: '100%',
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.25rem',
            fontWeight: '800',
            color: 'white',
            background: getRandomGradient(channel.displayName || channel.name),
            borderRadius: '10px',
            textShadow: '0 2px 4px rgba(0,0,0,0.3)',
            boxShadow: 'inset 0 0 10px rgba(255,255,255,0.2)'
          }}
        >
          {getInitials(channel.displayName || channel.name)}
        </div>
      </div>

      <div className="card-name" title={channel.displayName || channel.name}>
        {channel.displayName || channel.name}
      </div>
      
      <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', opacity: 0.6, marginTop: 'auto' }}>
        {channel.group}
      </div>
    </div>
  );
};

export default ChannelCard;
