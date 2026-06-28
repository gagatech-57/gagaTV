import React, { useState } from 'react';
import { PlayCircle, Award, Clapperboard, HelpCircle } from 'lucide-react';

const SeriesGrid = ({ list, onSelectEpisode, activeEpisode, type }) => {
  const [selectedSeries, setSelectedSeries] = useState(null);

  const handleCardClick = (series) => {
    setSelectedSeries(selectedSeries?.id === series.id ? null : series);
  };

  return (
    <div className="channel-list-section animate-fade-in">
      <div className="section-header">
        <h3 className="section-title">
          <Clapperboard size={20} className="text-gradient-accent" />
          <span>{type === 'anime' ? 'Anime Series Library' : 'Premium Web Series'}</span>
        </h3>
        <span className="section-subtitle">{list.length} collections available</span>
      </div>

      {/* Main Grid */}
      <div className="channel-grid">
        {list.map((series) => {
          const isSelected = selectedSeries?.id === series.id;
          return (
            <div 
              key={series.id} 
              onClick={() => handleCardClick(series)}
              className={`channel-card glass-panel ${isSelected ? 'active-card' : ''}`}
              style={{
                border: isSelected ? '1px solid var(--accent-primary)' : '1px solid var(--border-color)',
                boxShadow: isSelected ? '0 0 15px rgba(16, 185, 129, 0.2)' : 'none'
              }}
            >
              <div className="card-logo-container">
                <img 
                  src={series.logo} 
                  alt={series.name} 
                  className="card-logo"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
              <div className="channel-card-info" style={{ marginTop: '8px' }}>
                <h4 className="channel-card-name" style={{ fontSize: '0.9rem', fontWeight: '600' }}>
                  {series.name}
                </h4>
                <div style={{ display: 'flex', gap: '4px', justifyContent: 'center', marginTop: '4px', flexWrap: 'wrap' }}>
                  {series.genres.slice(0, 2).map(g => (
                    <span key={g} style={{ fontSize: '0.68rem', padding: '2px 6px', borderRadius: '4px', background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)' }}>
                      {g}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Inline Detail & Episode Picker panel */}
      {selectedSeries && (
        <div className="glass-panel animate-fade-in" style={{
          padding: '24px',
          borderRadius: '16px',
          marginTop: '12px',
          border: '1px solid var(--glass-border)',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.4rem', color: 'var(--text-primary)' }}>
                {selectedSeries.name}
              </h3>
              <span style={{ fontSize: '0.72rem', padding: '4px 8px', borderRadius: '6px', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent-primary)', fontWeight: '600', textTransform: 'uppercase' }}>
                {selectedSeries.genres[0]}
              </span>
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: '8px', lineHeight: '1.5', maxWidth: '700px' }}>
              {selectedSeries.description}
            </p>
          </div>

          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '12px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <PlayCircle size={18} style={{ color: 'var(--accent-primary)' }} />
              Episodes ({selectedSeries.episodes.length})
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {selectedSeries.episodes.map((ep) => {
                const epFullName = `${selectedSeries.name} - ${ep.title}`;
                const isActive = activeEpisode && activeEpisode.name === epFullName;
                return (
                  <button
                    key={ep.id}
                    onClick={() => onSelectEpisode(selectedSeries, ep)}
                    className="glass-panel"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 18px',
                      borderRadius: '10px',
                      border: isActive ? '1px solid var(--accent-primary)' : '1px solid var(--border-color)',
                      background: isActive ? 'rgba(16, 185, 129, 0.05)' : 'rgba(255, 255, 255, 0.01)',
                      color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all var(--transition-fast)'
                    }}
                  >
                    <span style={{ fontSize: '0.88rem', fontWeight: isActive ? '600' : '400' }}>
                      {ep.title}
                    </span>
                    <PlayCircle 
                      size={18} 
                      style={{ 
                        color: isActive ? 'var(--accent-primary)' : 'var(--text-muted)',
                        fill: isActive ? 'rgba(16, 185, 129, 0.1)' : 'none'
                      }} 
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeriesGrid;
