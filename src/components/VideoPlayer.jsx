import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Maximize2, 
  RefreshCw, 
  Tv, 
  Heart, 
  Sliders, 
  Camera, 
  Settings, 
  ExternalLink,
  SlidersHorizontal,
  X,
  FastForward,
  Rewind,
  LayoutGrid
} from 'lucide-react';

// Dynamic URL resolver to map offline playlist streams to active HLS links
const getPlayableUrl = (channel) => {
  if (!channel) return '';
  const name = channel.name.toLowerCase();
  const displayName = (channel.displayName || '').toLowerCase();
  
  // 1. Polimer News / TV
  if (name.includes('polimer news') || displayName.includes('polimer news')) {
    return 'https://live-cf-polimernews.dailyhunt.in/master.m3u8';
  }
  if (name.includes('polimer tv') || displayName.includes('polimer tv')) {
    return 'https://cdn-2.pishow.tv/live/1241/master.m3u8';
  }
  
  // 2. Kalaignar News / Seithigal / Murasu / TV / Isaiyaruvi / Sirippoli
  if (name.includes('kalaignar news') || name.includes('seithigal') || displayName.includes('kalaignar news') || displayName.includes('seithigal')) {
    return 'https://live-cf-kalaignarnews.dailyhunt.in/master.m3u8';
  }
  if (name.includes('murasu') || displayName.includes('murasu')) {
    return 'https://yuppmedtaorire.akamaized.net/v1/master/a0d007312bfd99c47f76b77ae26b1ccdaae76cb1/murasu_nim_https/050522/murasu/playlist.m3u8';
  }
  if (name.includes('isai') || displayName.includes('isai')) {
    return 'http://ptuf.ridsys.in/riptv/live/KALAIGNAR_ISAI_ARUVI/index.m3u8';
  }
  if (name.includes('sirippoli') || displayName.includes('sirippoli')) {
    return 'http://ptuf.ridsys.in/riptv/live/KALAIGNAR_SIRIPOLI/index.m3u8';
  }
  if (name.includes('kalaignar tv') || displayName.includes('kalaignar tv')) {
    return 'https://live-cf-kalaignarnews.dailyhunt.in/master.m3u8';
  }

  // 3. Thanthi TV / One
  if (name.includes('thanthi tv') || displayName.includes('thanthi tv')) {
    return 'https://cdn-3.pishow.tv/live/1612/master.m3u8';
  }
  if (name.includes('thanthi one') || displayName.includes('thanthi one')) {
    return 'https://mumt07.tangotv.in/zHjX9OFlTHANTHIONE/index.m3u8';
  }

  // 4. Sathiyam TV
  if (name.includes('sathiyam') || displayName.includes('sathiyam')) {
    return 'https://live-cf-sathiyamtv.dailyhunt.in/master.m3u8';
  }

  // 5. News 7 Tamil
  if (name.includes('news 7') || name.includes('news7') || displayName.includes('news 7') || displayName.includes('news7')) {
    return 'https://segment.yuppcdn.net/240122/news7/playlist.m3u8';
  }

  // 6. Puthiya Thalaimurai
  if (name.includes('puthiya') || displayName.includes('puthiya')) {
    return 'https://segment.yuppcdn.net/240122/puthiya/playlist.m3u8';
  }

  // 7. Makkal TV
  if (name.includes('makkal') || displayName.includes('makkal')) {
    return 'https://5k8q87azdy4v-hls-live.wmncdn.net/MAKKAL/271ddf829afe78e34be62287/index.m3u8';
  }

  // 8. DD Tamil / Podhigai
  if (name.includes('dd tamil') || name.includes('podhigai') || displayName.includes('dd tamil') || displayName.includes('podhigai')) {
    return 'https://d2lk5u59tns74c.cloudfront.net/out/v1/abf46b14847e454f9a72df29c368fb2f/index.m3u8';
  }

  // 9. Roja Movies / TV
  if (name.includes('roja') || displayName.includes('roja')) {
    return 'https://stream.rojatv.cloud/rojatv/rojatv/index.m3u8';
  }

  // 10. Zee Tamil News mapping
  if (name.includes('zee tamil news') || displayName.includes('zee tamil news')) {
    return 'https://raw.githubusercontent.com/amazeyourself/adaptive-streaming-hls/master/zeetamilnews/zeetamilnews.m3u8';
  }

  // Default fallback (returns original URL)
  return channel.url;
};

const getOfficialUrl = (channel) => {
  if (!channel) return '';
  const name = channel.name.toLowerCase();
  
  if (name.includes('sun tv') || name.includes('ktv') || name.includes('sun music') || name.includes('sun life') || name.includes('gemini')) {
    return 'https://www.sunnxt.com/';
  }
  if (name.includes('zee') || name.includes('sarthak') || name.includes('anmol') || name.includes('zindagi')) {
    return 'https://www.zee5.com/';
  }
  if (name.includes('vijay') || name.includes('sports') || name.includes('star plus') || name.includes('star gold') || name.includes('bindass') || name.includes('utsav')) {
    return 'https://www.hotstar.com/';
  }
  if (name.includes('colors') || name.includes('sab') || name.includes('sony') || name.includes('max')) {
    return 'https://www.sonyliv.com/';
  }
  return '';
};

const VideoPlayer = ({ channel, isFavorite, onToggleFavorite, showGuide, onToggleGuide }) => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Custom video filters (Cinema mode)
  const [brightness, setBrightness] = useState(1);
  const [contrast, setContrast] = useState(1);
  const [saturation, setSaturation] = useState(1);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  
  // Control toggles
  const [controlsVisible, setControlsVisible] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [pipActive, setPipActive] = useState(false);
  
  // Tap Gestures state
  const [feedback, setFeedback] = useState({ show: false, text: '', key: 0 });
  const tapTimeoutRef = useRef(null);

  const hlsInstanceRef = useRef(null);
  const controlsTimeoutRef = useRef(null);
  const connectionTimeoutRef = useRef(null);

  // Helper for logo initials
  const getInitials = (name) => {
    if (!name) return 'TV';
    const words = name.trim().split(/\s+/);
    if (words.length >= 2) {
      return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
    }
    return name.trim().substring(0, 2).toUpperCase();
  };

  // Reset video settings and player states on channel change
  useEffect(() => {
    setIsPlaying(false);
    setIsLoading(true);
    setHasError(false);
    setErrorMsg('');
    setShowSettings(false);
    setPlaybackSpeed(1);
    
    // Clear timeouts
    clearTimeout(connectionTimeoutRef.current);
    
    if (!channel) {
      setIsLoading(false);
      return;
    }

    const video = videoRef.current;
    if (!video) return;

    // Clean up previous HLS instance
    cleanUpHls();

    // Start connection timeout (8 seconds)
    connectionTimeoutRef.current = setTimeout(() => {
      if (isLoading || !isPlaying) {
        console.warn("HLS connection timeout reached.");
        setHasError(true);
        setErrorMsg('Connection timed out. The stream is offline or blocked by CORS.');
        setIsLoading(false);
        cleanUpHls();
      }
    }, 8000);

    const streamUrl = getPlayableUrl(channel);

    if (Hls.isSupported()) {
      const hls = new Hls({
        maxMaxBufferLength: 8,
        enableWorker: true,
        lowLatencyMode: true,
        xhrSetup: (xhr) => {
          xhr.withCredentials = false;
        }
      });
      hlsInstanceRef.current = hls;

      hls.loadSource(streamUrl);
      hls.attachMedia(video);

      hls.on(Hls.Events.MEDIA_ATTACHED, () => {
        video.muted = isMuted;
        video.volume = volume;
        video.playbackRate = playbackSpeed;
        video.play().catch(() => {
          console.log("Autoplay blocked. Click play to start.");
          setIsPlaying(false);
          setIsLoading(false);
        });
      });

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        clearTimeout(connectionTimeoutRef.current);
        setIsLoading(false);
        setIsPlaying(true);
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error('HLS error details:', data);
        if (data.fatal) {
          clearTimeout(connectionTimeoutRef.current);
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              console.log('Trying network recovery...');
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              console.log('Trying media recovery...');
              hls.recoverMediaError();
              break;
            default:
              setHasError(true);
              setErrorMsg('Stream server is offline or blocked (CORS).');
              setIsLoading(false);
              cleanUpHls();
              break;
          }
        }
      });

    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Native iOS/Safari HLS support
      video.src = streamUrl;
      
      const onLoadedMetadata = () => {
        clearTimeout(connectionTimeoutRef.current);
        video.muted = isMuted;
        video.volume = volume;
        video.playbackRate = playbackSpeed;
        video.play().then(() => {
          setIsPlaying(true);
          setIsLoading(false);
        }).catch(() => {
          setIsPlaying(false);
          setIsLoading(false);
        });
      };

      const onError = () => {
        clearTimeout(connectionTimeoutRef.current);
        setHasError(true);
        setErrorMsg('Stream failed to load.');
        setIsLoading(false);
      };

      video.addEventListener('loadedmetadata', onLoadedMetadata);
      video.addEventListener('error', onError);

      return () => {
        video.removeEventListener('loadedmetadata', onLoadedMetadata);
        video.removeEventListener('error', onError);
      };
    } else {
      clearTimeout(connectionTimeoutRef.current);
      setHasError(true);
      setErrorMsg('This browser does not support HLS streaming.');
      setIsLoading(false);
    }

    return () => {
      cleanUpHls();
      clearTimeout(connectionTimeoutRef.current);
    };
  }, [channel]);

  // Sync volume & speeds on change
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed, channel]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!channel || hasError) return;
      if (e.key === ' ' || e.key === 'k') {
        e.preventDefault();
        togglePlay();
      } else if (e.key === 'm') {
        e.preventDefault();
        toggleMute();
      } else if (e.key === 'f') {
        e.preventDefault();
        toggleFullscreen();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [channel, isPlaying, isMuted, volume, isFullscreen, hasError]);

  const cleanUpHls = () => {
    if (hlsInstanceRef.current) {
      hlsInstanceRef.current.destroy();
      hlsInstanceRef.current = null;
    }
  };

  const retryStream = () => {
    setHasError(false);
    setIsLoading(true);
    
    const video = videoRef.current;
    if (!video || !channel) return;

    cleanUpHls();
    clearTimeout(connectionTimeoutRef.current);

    connectionTimeoutRef.current = setTimeout(() => {
      if (!videoRef.current?.paused) return; // Playing
      setHasError(true);
      setErrorMsg('Stream offline or blocked (CORS).');
      setIsLoading(false);
      cleanUpHls();
    }, 8000);

    const streamUrl = getPlayableUrl(channel);

    if (Hls.isSupported()) {
      const hls = new Hls({ maxMaxBufferLength: 8 });
      hlsInstanceRef.current = hls;
      hls.loadSource(streamUrl);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        clearTimeout(connectionTimeoutRef.current);
        setIsLoading(false);
        setIsPlaying(true);
        video.play().catch(() => {});
      });
      hls.on(Hls.Events.ERROR, (e, data) => {
        if (data.fatal) {
          clearTimeout(connectionTimeoutRef.current);
          setHasError(true);
          setErrorMsg('Failed to connect to stream.');
          setIsLoading(false);
          cleanUpHls();
        }
      });
    } else {
      video.src = streamUrl;
    }
  };

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      video.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        setIsPlaying(false);
      });
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    const newMuteState = !isMuted;
    video.muted = newMuteState;
    setIsMuted(newMuteState);
  };

  const handleVolumeChange = (e) => {
    const newVol = parseFloat(e.target.value);
    const video = videoRef.current;
    if (video) {
      video.volume = newVol;
      video.muted = newVol === 0;
      setIsMuted(newVol === 0);
    }
    setVolume(newVol);
  };

  const toggleFullscreen = () => {
    const container = containerRef.current;
    if (!container) return;

    if (!document.fullscreenElement) {
      container.requestFullscreen().then(() => {
        setIsFullscreen(true);
        if (screen.orientation && screen.orientation.lock) {
          screen.orientation.lock('portrait').catch(() => {});
        }
      }).catch(err => {
        console.error(err);
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
        if (screen.orientation && screen.orientation.unlock) {
          screen.orientation.unlock();
        }
      });
    }
  };

  const handleMouseMove = () => {
    setControlsVisible(true);
    clearTimeout(controlsTimeoutRef.current);
    
    if (isPlaying && !showSettings) {
      controlsTimeoutRef.current = setTimeout(() => {
        setControlsVisible(false);
      }, 3000);
    }
  };

  // Double-tap Seek Gesture Handlers for Mobile (Left / Center / Right Overlay Zones)
  const handleZoneClick = (e, zone) => {
    if (e.button !== 0) return; // Only trigger on left clicks / touches
    e.stopPropagation();

    const video = videoRef.current;
    if (!video) return;

    if (e.detail === 2) { // Native browser Double Click / Double Tap
      clearTimeout(tapTimeoutRef.current);
      if (zone === 'left') {
        video.currentTime = Math.max(0, video.currentTime - 10);
        triggerFeedback('Rewind -10s');
      } else if (zone === 'right') {
        video.currentTime = Math.min(video.duration || 99999, video.currentTime + 10);
        triggerFeedback('Forward +10s');
      } else if (zone === 'center') {
        togglePlay();
        triggerFeedback(isPlaying ? 'Pause' : 'Play');
      }
    } else {
      // Single tap: toggle overlay controls visibility
      tapTimeoutRef.current = setTimeout(() => {
        handleMouseMove();
      }, 220);
    }
  };

  const triggerFeedback = (text) => {
    setFeedback({ show: true, text, key: Date.now() });
  };

  useEffect(() => {
    if (!isPlaying) {
      setControlsVisible(true);
      clearTimeout(controlsTimeoutRef.current);
    }
  }, [isPlaying]);

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  // Sync PiP state changes
  useEffect(() => {
    const onLeavePip = () => setPipActive(false);
    const onEnterPip = () => setPipActive(true);
    
    const video = videoRef.current;
    if (video) {
      video.addEventListener('enterpictureinpicture', onEnterPip);
      video.addEventListener('leavepictureinpicture', onLeavePip);
    }
    return () => {
      if (video) {
        video.removeEventListener('enterpictureinpicture', onEnterPip);
        video.removeEventListener('leavepictureinpicture', onLeavePip);
      }
    };
  }, [channel]);

  // Picture in Picture Toggle
  const togglePip = async () => {
    const video = videoRef.current;
    if (!video) return;

    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
        setPipActive(false);
      } else {
        await video.requestPictureInPicture();
        setPipActive(true);
      }
    } catch (err) {
      console.warn("PiP failed: ", err);
    }
  };

  // Capture Video Snapshot
  const captureSnapshot = () => {
    const video = videoRef.current;
    if (!video) return;

    try {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || video.clientWidth;
      canvas.height = video.videoHeight || video.clientHeight;
      
      const ctx = canvas.getContext('2d');
      ctx.filter = `brightness(${brightness}) contrast(${contrast}) saturate(${saturation})`;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `${channel.displayName || channel.name}_snapshot.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      alert("Cannot capture screenshot due to CORS security restrictions on this public stream. Try another channel.");
      console.warn("Snapshot failed:", err);
    }
  };

  // Reset video settings
  const resetFilters = () => {
    setBrightness(1);
    setContrast(1);
    setSaturation(1);
    setPlaybackSpeed(1);
  };

  return (
    <div className="player-section">
      <div 
        ref={containerRef}
        className="player-panel"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => isPlaying && !showSettings && setControlsVisible(false)}
      >
        {!channel ? (
          <div className="player-fallback">
            <Tv size={50} style={{ opacity: 0.15 }} />
            <h3 className="player-fallback-title">No Channel Selected</h3>
            <p className="player-fallback-desc">Select a TV channel from the grid on the right to start watching live broadcasts on Gaga TV.</p>
          </div>
        ) : hasError ? (
          <div className="player-fallback animate-fade-in">
            <Tv size={50} style={{ color: 'var(--accent-primary)' }} />
            <h3 className="player-fallback-title">Stream Offline</h3>
            <p className="player-fallback-desc">{errorMsg}</p>
            <p style={{ fontSize: '0.8rem', opacity: 0.4, maxWidth: '280px', marginTop: '-8px' }}>
              Free stream links can occasionally drop. Try reloading or picking another channel.
            </p>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '4px' }}>
              <button onClick={retryStream} className="player-fallback-btn">
                <RefreshCw size={14} style={{ marginRight: '8px', display: 'inline' }} />
                Retry Connection
              </button>
              {getOfficialUrl(channel) && (
                <a 
                  href={getOfficialUrl(channel)} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="player-fallback-btn"
                  style={{ 
                    background: 'linear-gradient(135deg, var(--accent-secondary) 0%, var(--accent-primary) 100%)', 
                    color: '#060b16',
                    fontWeight: '600',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <ExternalLink size={14} style={{ marginRight: '8px' }} />
                  Watch on Official Portal
                </a>
              )}
            </div>
          </div>
        ) : (
          <div className="video-container">
            <video
              ref={videoRef}
              className="video-element"
              onDoubleClick={toggleFullscreen}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              style={{
                filter: `brightness(${brightness}) contrast(${contrast}) saturate(${saturation})`
              }}
              playsInline
            />

            {/* Gesture Detection Overlay Zones */}
            <div className="gesture-overlay">
              <div className="gesture-zone left" onClick={(e) => handleZoneClick(e, 'left')}></div>
              <div className="gesture-zone center" onClick={(e) => handleZoneClick(e, 'center')}></div>
              <div className="gesture-zone right" onClick={(e) => handleZoneClick(e, 'right')}></div>
            </div>

            {/* Gesture Ripple / HUD Feedback */}
            {feedback.show && (
              <div key={feedback.key} className="gesture-feedback glass-panel animate-feedback">
                {feedback.text.includes('Forward') && <FastForward size={24} />}
                {feedback.text.includes('Rewind') && <Rewind size={24} />}
                {feedback.text === 'Play' && <Play size={24} fill="white" />}
                {feedback.text === 'Pause' && <Pause size={24} fill="white" />}
                <span>{feedback.text}</span>
              </div>
            )}

            {isLoading && (
              <div 
                className="player-fallback" 
                style={{ 
                  position: 'absolute', 
                  inset: 0, 
                  background: 'rgba(3, 6, 15, 0.9)',
                  backdropFilter: 'blur(8px)' 
                }}
              >
                <div className="app-loading-spinner" style={{ borderTopColor: 'var(--accent-secondary)' }}></div>
                <p style={{ marginTop: '12px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  Loading feed...
                </p>
              </div>
            )}

            {/* Custom Overlay Controls */}
            <div className={`player-controls-overlay ${controlsVisible ? 'visible' : ''}`}>
              {/* Header Info */}
              <div className="player-header">
                <div className="player-channel-info">
                  {channel.logo ? (
                    <img 
                      src={channel.logo} 
                      alt="" 
                      className="player-channel-logo" 
                      onError={(e) => {
                        e.target.style.display = 'none';
                        const parent = e.target.parentElement;
                        if (parent) {
                          const placeholder = parent.querySelector('.player-logo-placeholder');
                          if (placeholder) placeholder.style.display = 'flex';
                        }
                      }}
                    />
                  ) : null}
                  <div 
                    className="player-logo-placeholder"
                    style={{
                      display: channel.logo ? 'none' : 'flex',
                      width: '44px',
                      height: '44px',
                      borderRadius: '8px',
                      background: 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-indigo) 100%)',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '1rem',
                      color: 'white',
                      border: '1px solid rgba(255,255,255,0.1)'
                    }}
                  >
                    {getInitials(channel.displayName || channel.name)}
                  </div>
                  <div>
                    <h4 className="player-channel-name">{channel.displayName || channel.name}</h4>
                    <div className="player-channel-meta">
                      <span className="live-indicator">
                        <span className="live-dot"></span>
                        LIVE
                      </span>
                      <span>•</span>
                      <span>{channel.group}</span>
                      {channel.language && (
                        <>
                          <span>•</span>
                          <span>{channel.language}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => onToggleFavorite(channel)}
                  className="control-btn"
                  style={{ color: isFavorite ? 'var(--accent-primary)' : 'white' }}
                >
                  <Heart size={20} fill={isFavorite ? 'var(--accent-primary)' : 'none'} />
                </button>
              </div>

              {/* Advanced Settings Drawer */}
              {showSettings && (
                <div className="player-settings-panel glass-panel">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div className="settings-section-title">Cinema Controls</div>
                    <button 
                      onClick={resetFilters} 
                      style={{ background: 'none', border: 'none', color: 'var(--accent-secondary)', fontSize: '0.72rem', cursor: 'pointer', fontWeight: 600 }}
                    >
                      Reset All
                    </button>
                  </div>
                  
                  {/* Brightness */}
                  <div className="settings-slider-row">
                    <div className="settings-slider-labels">
                      <span>Brightness</span>
                      <span>{Math.round(brightness * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0.5"
                      max="1.5"
                      step="0.05"
                      value={brightness}
                      onChange={(e) => setBrightness(parseFloat(e.target.value))}
                      className="settings-slider"
                    />
                  </div>

                  {/* Contrast */}
                  <div className="settings-slider-row">
                    <div className="settings-slider-labels">
                      <span>Contrast</span>
                      <span>{Math.round(contrast * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0.5"
                      max="1.5"
                      step="0.05"
                      value={contrast}
                      onChange={(e) => setContrast(parseFloat(e.target.value))}
                      className="settings-slider"
                    />
                  </div>

                  {/* Saturation */}
                  <div className="settings-slider-row">
                    <div className="settings-slider-labels">
                      <span>Saturation</span>
                      <span>{Math.round(saturation * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0.5"
                      max="1.5"
                      step="0.05"
                      value={saturation}
                      onChange={(e) => setSaturation(parseFloat(e.target.value))}
                      className="settings-slider"
                    />
                  </div>

                  {/* Playback Speed */}
                  <div>
                    <div className="settings-section-title" style={{ marginTop: '4px' }}>Playback Speed</div>
                    <div className="settings-btn-group">
                      {[0.5, 1, 1.25, 1.5, 2].map((speed) => (
                        <button
                          key={speed}
                          onClick={() => setPlaybackSpeed(speed)}
                          className={`settings-btn ${playbackSpeed === speed ? 'active' : ''}`}
                        >
                          {speed}x
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Footer Controls */}
              <div className="player-footer-controls">
                <div className="control-bar">
                  <div className="control-group">
                    <button onClick={togglePlay} className="control-btn">
                      {isPlaying ? <Pause size={20} fill="white" /> : <Play size={20} fill="white" />}
                    </button>
                    
                    {/* Unique Volume Bar Control */}
                    <div className="volume-container unique-volume-control">
                      <button onClick={toggleMute} className="control-btn volume-mute-toggle">
                        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                      </button>
                      <div className="unique-volume-slider-wrapper">
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.05"
                          value={isMuted ? 0 : volume}
                          onChange={handleVolumeChange}
                          className="volume-slider unique-range-input"
                          style={{
                            background: `linear-gradient(to right, var(--accent-primary) ${(isMuted ? 0 : volume) * 100}%, rgba(255,255,255,0.15) ${(isMuted ? 0 : volume) * 100}%)`
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="control-group">
                    {/* Capture Frame */}
                    <button 
                      onClick={captureSnapshot} 
                      className="control-btn" 
                      data-tooltip="Capture Screenshot"
                    >
                      <Camera size={18} />
                    </button>

                    {/* Picture in Picture */}
                    <button 
                      onClick={togglePip} 
                      className={`control-btn ${pipActive ? 'active' : ''}`} 
                      data-tooltip="Picture in Picture"
                    >
                      <ExternalLink size={18} />
                    </button>

                    {/* Settings Sliders */}
                    <button 
                      onClick={() => setShowSettings(!showSettings)} 
                      className={`control-btn ${showSettings ? 'active' : ''}`} 
                      data-tooltip="Cinema Filters"
                    >
                      <Sliders size={18} />
                    </button>

                    {/* Reload */}
                    <button onClick={retryStream} className="control-btn" data-tooltip="Refresh Broadcast">
                      <RefreshCw size={16} />
                    </button>

                    {/* Toggle Channel Guide (Theater Mode) */}
                    <button 
                      onClick={onToggleGuide} 
                      className={`control-btn guide-toggle-btn ${!showGuide ? 'active' : ''}`} 
                      data-tooltip={showGuide ? "Hide Channel Guide" : "Show Channel Guide"}
                    >
                      <LayoutGrid size={18} />
                    </button>
                    
                    {/* Fullscreen */}
                    <button onClick={toggleFullscreen} className="control-btn">
                      <Maximize size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {channel && (
        <div className="channel-detail-panel glass-panel">
          <div className="detail-header">
            <div className="detail-title-group">
              {channel.logo ? (
                <img 
                  src={channel.logo} 
                  alt="" 
                  className="detail-logo"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    const parent = e.target.parentElement;
                    if (parent) {
                      const placeholder = parent.querySelector('.detail-logo-placeholder');
                      if (placeholder) placeholder.style.display = 'flex';
                    }
                  }}
                />
              ) : null}
              <div 
                className="detail-logo-placeholder"
                style={{
                  display: channel.logo ? 'none' : 'flex',
                  width: '44px',
                  height: '44px',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-indigo) 100%)',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '1rem',
                  color: 'white',
                  border: '1px solid rgba(255,255,255,0.1)'
                }}
              >
                {getInitials(channel.displayName || channel.name)}
              </div>
              <div>
                <h2 className="detail-title">{channel.displayName || channel.name}</h2>
                <div className="detail-badge-group">
                  {channel.isTamil && <span className="badge badge-tamil">Tamil</span>}
                  {channel.isIndia && <span className="badge badge-india">India</span>}
                  <span className="badge">{channel.group}</span>
                </div>
              </div>
            </div>
            
            <div className="detail-actions">
              <button 
                onClick={() => onToggleFavorite(channel)}
                className={`action-btn ${isFavorite ? 'active' : ''}`}
                data-tooltip={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
              >
                <Heart size={20} fill={isFavorite ? 'var(--accent-primary)' : 'none'} style={isFavorite ? { color: 'var(--accent-primary)' } : {}} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
