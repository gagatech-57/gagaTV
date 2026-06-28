import React from 'react';
import { 
  Tv, 
  Heart, 
  Clock, 
  Newspaper, 
  Film, 
  Music, 
  Trophy, 
  Compass, 
  Info,
  X,
  Sparkles,
  Globe
} from 'lucide-react';

const Sidebar = ({ 
  selectedCategory, 
  onSelectCategory, 
  activeSection, 
  onChangeSection,
  counts,
  favoritesCount,
  recentCount,
  isOpen,
  onClose
}) => {

  const mainSections = [
    { id: 'all', label: 'All Channels', icon: Tv, count: counts.all || 0 },
    { id: 'tamil', label: 'Tamil Channels', icon: Sparkles, count: counts.tamil || 0, badge: 'tam' },
    { id: 'india', label: 'Indian Channels', icon: Globe, count: counts.india || 0, badge: 'in' },
    { id: 'favorites', label: 'Favorites', icon: Heart, count: favoritesCount, color: '#ef4444' },
    { id: 'recent', label: 'Recently Watched', icon: Clock, count: recentCount }
  ];

  const categoryIcons = {
    'News': Newspaper,
    'Movies': Film,
    'Music': Music,
    'Sports': Trophy,
    'Entertainment': Tv,
    'General': Compass
  };

  const handleSectionClick = (sectionId) => {
    onChangeSection(sectionId);
    onSelectCategory('All');
    if (window.innerWidth <= 768) onClose();
  };

  const handleCategoryClick = (category) => {
    onSelectCategory(category);
    // Switch to 'all' section if a specific category is chosen, or keep region filter
    if (activeSection !== 'all' && activeSection !== 'tamil' && activeSection !== 'india') {
      onChangeSection('all');
    }
    if (window.innerWidth <= 768) onClose();
  };

  return (
    <aside className={`sidebar glass-panel ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <h1 className="sidebar-logo">
          <Tv className="text-gradient-accent" size={28} strokeWidth={2.5} />
          <span className="text-gradient-primary">Gaga Play</span>
        </h1>
        <button 
          onClick={onClose} 
          className="menu-toggle-btn" 
          style={{ border: 'none', background: 'none', marginLeft: 'auto' }}
        >
          <X size={20} />
        </button>
      </div>

      <div className="sidebar-menu">
        <div className="sidebar-section-title">Navigation</div>
        {mainSections.map((section) => {
          const Icon = section.icon;
          const isActive = activeSection === section.id && selectedCategory === 'All';
          return (
            <button
              key={section.id}
              onClick={() => handleSectionClick(section.id)}
              className={`sidebar-item ${isActive ? 'active' : ''}`}
            >
              <div className="sidebar-item-inner">
                <Icon size={18} style={section.color ? { color: section.color } : {}} />
                <span>{section.label}</span>
              </div>
              <span className="sidebar-badge">{section.count}</span>
            </button>
          );
        })}

        <div className="sidebar-section-title">Categories</div>
        {Object.keys(counts.categories || {}).sort().map((cat) => {
          const Icon = categoryIcons[cat] || Compass;
          const isActive = selectedCategory === cat && (activeSection === 'all' || activeSection === 'tamil' || activeSection === 'india');
          return (
            <button
              key={cat}
              onClick={() => handleCategoryClick(cat)}
              className={`sidebar-item ${isActive ? 'active' : ''}`}
            >
              <div className="sidebar-item-inner">
                <Icon size={18} />
                <span>{cat}</span>
              </div>
              <span className="sidebar-badge">{counts.categories[cat]}</span>
            </button>
          );
        })}
      </div>

      <div className="sidebar-footer">
        <div>Gaga Play OTT Portal</div>
        <div style={{ fontSize: '0.7rem', opacity: 0.6 }}>Free Stream Aggregator v1.2.0</div>
      </div>
    </aside>
  );
};

export default Sidebar;
