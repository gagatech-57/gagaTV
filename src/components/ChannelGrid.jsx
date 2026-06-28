import React, { useState, useEffect, useRef } from 'react';
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
  // Infinite Scroll / Lazy Loading State to handle 5,500+ channels instantly
  const [visibleCount, setVisibleCount] = useState(80);
  const sentinelRef = useRef(null);

  // Reset pagination when channel dataset changes (on category search/filter)
  useEffect(() => {
    setVisibleCount(80);
  }, [channels, selectedCategory]);

  // Setup IntersectionObserver for native infinite scrolling
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setVisibleCount((prev) => Math.min(prev + 80, channels.length));
      }
    }, {
      rootMargin: '150px', // Pre-fetch before user reaches the exact end
      threshold: 0.1
    });

    const sentinel = sentinelRef.current;
    if (sentinel) {
      observer.observe(sentinel);
    }

    return () => {
      if (sentinel) {
        observer.unobserve(sentinel);
      }
      observer.disconnect();
    };
  }, [channels, visibleCount]);

  const visibleChannels = channels.slice(0, visibleCount);

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
        <>
          <div className="channel-grid animate-fade-in">
            {visibleChannels.map((channel) => {
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

          {/* Sentinel element to trigger loading the next batch of channels */}
          {visibleCount < channels.length && (
            <div 
              ref={sentinelRef} 
              style={{ 
                height: '40px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                color: 'var(--text-secondary)',
                fontSize: '0.82rem',
                opacity: 0.5,
                marginTop: '12px'
              }}
            >
              Loading more channels...
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ChannelGrid;
