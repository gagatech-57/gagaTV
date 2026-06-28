import React from 'react';
import { Heart, Tv } from 'lucide-react';

const ChannelCard = ({ 
  channel, 
  isActive, 
  onSelect, 
  isFavorite, 
  onToggleFavorite 
}) => {
  const getFirstLetter = (name) => {
    if (!name) return 'TV';
    return name.trim().charAt(0).toUpperCase();
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    onToggleFavorite(channel);
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
        <Heart size={16} fill={isFavorite ? 'currentColor' : 'none'} />
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
              // Hide broken image and show a fallback avatar
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
            fontSize: '1.5rem',
            fontWeight: '800',
            color: 'var(--text-muted)'
          }}
        >
          {getFirstLetter(channel.displayName || channel.name)}
        </div>
      </div>

      <div className="card-name" title={channel.displayName || channel.name}>
        {channel.displayName || channel.name}
      </div>
      
      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 'auto' }}>
        {channel.group}
      </div>
    </div>
  );
};

export default ChannelCard;
