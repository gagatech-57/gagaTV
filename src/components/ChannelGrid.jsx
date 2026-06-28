import React from 'react';
import ChannelCard from './ChannelCard';
import { Tv } from 'lucide-react';

const ChannelGrid = ({ 
  channels, 
  selectedChannel, 
  onSelectChannel, 
  favorites, 
  onToggleFavorite,
  categories = [],
  selectedCategory = 'All',
  onSelectCategory
}) => {
  return (
    <div className="channel-list-section">
      <div className="section-header">
        <h3 className="section-title">
          <Tv size={20} className="text-gradient-accent" />
          <span>Channel Guide</span>
        </h3>
        <span className="section-subtitle">{channels.length} channels available</span>
      </div>

      {categories.length > 0 && (
        <div className="category-filter-bar">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => onSelectCategory(category)}
              className={`category-pill ${selectedCategory === category ? 'active' : ''}`}
            >
              {category}
            </button>
          ))}
        </div>
      )}

      {channels.length === 0 ? (
        <div className="empty-grid glass-panel animate-fade-in">
          <Tv size={40} style={{ opacity: 0.3 }} />
          <h4 className="empty-grid-title">No Channels Found</h4>
          <p style={{ fontSize: '0.88rem', opacity: 0.6 }}>
            No channels match your current search queries or filters. Try adjusting your search query or selecting a different category.
          </p>
        </div>
      ) : (
        <div className="channel-grid animate-fade-in">
          {channels.map((channel) => {
            const isFav = favorites.some(fav => fav.url === channel.url);
            const isActive = selectedChannel && selectedChannel.url === channel.url;
            return (
              <ChannelCard
                key={channel.url}
                channel={channel}
                isActive={isActive}
                onSelect={onSelectChannel}
                isFavorite={isFav}
                onToggleFavorite={onToggleFavorite}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ChannelGrid;
