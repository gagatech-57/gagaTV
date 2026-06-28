import React from 'react';
import { Search, X, Menu, Tv } from 'lucide-react';

const TopBar = ({ 
  searchQuery, 
  onSearchChange, 
  onMenuToggle, 
  totalResults 
}) => {
  return (
    <header className="topbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button onClick={onMenuToggle} className="menu-toggle-btn">
          <Menu size={20} />
        </button>
        
        <div className="search-container">
          <Search className="search-icon" size={18} />
          <input
            type="text"
            className="search-input"
            placeholder="Search channels..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {searchQuery && (
            <button 
              onClick={() => onSearchChange('')} 
              className="search-clear"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      <div className="topbar-actions">
        {totalResults !== undefined && (
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Found <strong style={{ color: 'var(--text-primary)' }}>{totalResults}</strong> channels
          </div>
        )}
        <div className="action-btn" data-tooltip="Live Status: Online">
          <div className="live-dot animate-pulse-glow" style={{ width: '8px', height: '8px' }}></div>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
