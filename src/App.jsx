import React, { useState, useEffect, useMemo } from 'react';
import { fetchAllChannels } from './utils/m3uParser';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import VideoPlayer from './components/VideoPlayer';
import ChannelGrid from './components/ChannelGrid';
import { Tv, Menu } from 'lucide-react';
import './App.css';

function App() {
  const [channels, setChannels] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [recents, setRecents] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState(null);
  
  // Filtering states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeSection, setActiveSection] = useState('all');
  
  // UI states
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Load channels on mount
  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchAllChannels();
        setChannels(data);
        
        // Auto-select first channel if available
        if (data.length > 0) {
          // Find a Tamil channel to play by default for a nice local starting experience
          const defaultTamilChannel = data.find(ch => ch.isTamil);
          setSelectedChannel(defaultTamilChannel || data[0]);
        }
      } catch (err) {
        console.error("Error loading channels:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();

    // Load favorites and recents from localStorage
    const savedFavorites = localStorage.getItem('gagatv_favorites');
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites));
      } catch (e) {
        console.error(e);
      }
    }

    const savedRecents = localStorage.getItem('gagatv_recents');
    if (savedRecents) {
      try {
        setRecents(JSON.parse(savedRecents));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // Sync favorites with localStorage
  const handleToggleFavorite = (channel) => {
    setFavorites(prev => {
      const isFav = prev.some(fav => fav.url === channel.url);
      let updated;
      if (isFav) {
        updated = prev.filter(fav => fav.url !== channel.url);
      } else {
        updated = [...prev, channel];
      }
      localStorage.setItem('gagatv_favorites', JSON.stringify(updated));
      return updated;
    });
  };

  // Add channel to recents
  const handleSelectChannel = (channel) => {
    setSelectedChannel(channel);
    
    setRecents(prev => {
      // Remove channel if already in list to move it to the top
      const filtered = prev.filter(item => item.url !== channel.url);
      const updated = [channel, ...filtered].slice(0, 15); // Keep last 15
      localStorage.setItem('gagatv_recents', JSON.stringify(updated));
      return updated;
    });

    // Auto-scroll to player on mobile devices
    if (window.innerWidth <= 1200) {
      const playerEl = document.querySelector('.player-panel');
      if (playerEl) {
        playerEl.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // Filter channels based on active section
  const sectionChannels = useMemo(() => {
    switch (activeSection) {
      case 'tamil':
        return channels.filter(ch => ch.isTamil);
      case 'india':
        return channels.filter(ch => ch.isIndia);
      case 'favorites':
        return favorites;
      case 'recent':
        return recents;
      case 'all':
      default:
        return channels;
    }
  }, [channels, activeSection, favorites, recents]);

  // Extract unique categories in the current section
  const sectionCategories = useMemo(() => {
    const cats = new Set();
    sectionChannels.forEach(ch => {
      if (ch.group) cats.add(ch.group);
    });
    return ['All', ...Array.from(cats).sort()];
  }, [sectionChannels]);

  // Apply category and search query filters
  const filteredChannels = useMemo(() => {
    let result = sectionChannels;

    if (selectedCategory !== 'All') {
      result = result.filter(ch => ch.group === selectedCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(ch => 
        (ch.displayName || ch.name || '').toLowerCase().includes(query) || 
        (ch.group || '').toLowerCase().includes(query)
      );
    }

    return result;
  }, [sectionChannels, selectedCategory, searchQuery]);

  // Calculate counts for badges
  const sidebarCounts = useMemo(() => {
    const tamilCount = channels.filter(ch => ch.isTamil).length;
    const indiaCount = channels.filter(ch => ch.isIndia).length;
    
    // Calculate categories counts under current region/activeSection
    // To make category counts change dynamically based on section
    const catCounts = {};
    sectionChannels.forEach(ch => {
      if (ch.group) {
        catCounts[ch.group] = (catCounts[ch.group] || 0) + 1;
      }
    });

    return {
      all: channels.length,
      tamil: tamilCount,
      india: indiaCount,
      categories: catCounts
    };
  }, [channels, sectionChannels]);

  // Guide toggle state (theater mode)
  const [showGuide, setShowGuide] = useState(true);

  if (loading) {
    return (
      <div className="app-loading-screen">
        <div className="app-loading-spinner"></div>
        <h2 className="app-loading-text">Connecting to Gaga TV Live...</h2>
        <p style={{ color: 'var(--text-secondary)', opacity: 0.5, fontSize: '0.85rem' }}>Loading premium streams & public guides</p>
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(4px)',
            zIndex: 90
          }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Panel */}
      <Sidebar
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        activeSection={activeSection}
        onChangeSection={setActiveSection}
        counts={sidebarCounts}
        favoritesCount={favorites.length}
        recentCount={recents.length}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content Pane */}
      <div className="content-wrapper">
        <TopBar
          searchQuery={searchQuery}
          onSearchChange={(query) => {
            setSearchQuery(query);
          }}
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
          totalResults={filteredChannels.length}
        />

        <main className={`dashboard-view ${!showGuide ? 'guide-hidden' : ''}`}>
          {/* Large Hero Video Player (Left Column) */}
          <VideoPlayer
            channel={selectedChannel}
            isFavorite={selectedChannel ? favorites.some(fav => fav.url === selectedChannel.url) : false}
            onToggleFavorite={handleToggleFavorite}
            showGuide={showGuide}
            onToggleGuide={() => setShowGuide(!showGuide)}
          />

          {/* Channels grid (Right Column / Bottom Column) */}
          {showGuide && (
            <ChannelGrid
              channels={filteredChannels}
              selectedChannel={selectedChannel}
              onSelectChannel={handleSelectChannel}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
              categories={sectionCategories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
