import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ChevronDown, Heart, Shuffle, SkipBack, Play, Pause, SkipForward, Repeat, Mic2, ListMusic, MonitorSpeaker } from 'lucide-react';
import { useAudio } from '../context/AudioContext';
import { ScreenType } from '../types';

interface NowPlayingProps {
  onNavigate: (screen: ScreenType) => void;
}

export default function NowPlaying({ onNavigate }: NowPlayingProps) {
  const { 
    currentTrack, 
    isPlaying, 
    togglePlay, 
    nextTrack, 
    prevTrack, 
    progress, 
    duration, 
    seek,
    isShuffle,
    toggleShuffle,
    isRepeat,
    toggleRepeat
  } = useAudio();

  const [isDragging, setIsDragging] = useState(false);
  const [dragProgress, setDragProgress] = useState(0);

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDragProgress(Number(e.target.value));
  };

  const handleSeekEnd = () => {
    seek(dragProgress);
    setIsDragging(false);
  };

  const handleSeekStart = () => {
    setIsDragging(true);
    setDragProgress(progress);
  };

  const displayProgress = isDragging ? dragProgress : progress;
  const progressPercent = duration > 0 ? (displayProgress / duration) * 100 : 0;

  if (!currentTrack) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4">
        <p className="text-on-surface-variant">No track playing</p>
        <button onClick={() => onNavigate('library')} className="text-primary underline">Go to Library</button>
      </div>
    );
  }

  const albumArtUrl = currentTrack.albumArt || `https://picsum.photos/seed/${currentTrack.id}/800/800`;

  return (
    <motion.div 
      initial={{ opacity: 0, y: '100%' }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed inset-0 z-50 bg-surface text-on-surface font-body selection:bg-primary selection:text-on-primary overflow-y-auto"
    >
      {/* Global Background Atmosphere */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-primary/20 blur-[120px] rounded-full"></div>
        <div className="absolute top-0 right-0 w-3/4 h-3/4 bg-secondary/10 blur-[150px] rounded-full"></div>
        <div className="absolute bottom-0 left-1/4 w-full h-full bg-tertiary/10 blur-[180px] rounded-full"></div>
        <div className="absolute inset-0 bg-mesh opacity-50"></div>
      </div>

      {/* Top Navigation Anchor */}
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-6 h-20 bg-surface/40 backdrop-blur-xl border-b border-white/5">
        <motion.button 
          whileTap={{ scale: 0.9 }}
          onClick={() => onNavigate('library')}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-all text-on-surface"
        >
          <ChevronDown size={28} />
        </motion.button>
        <div className="text-center">
          <p className="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant font-bold">Playing From</p>
          <h1 className="font-headline font-bold text-sm tracking-tight">My Library</h1>
        </div>
        <div className="w-10"></div> {/* Spacer for centering */}
      </header>

      {/* Main Content Canvas */}
      <main className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 pt-24 max-w-lg mx-auto pb-8">
        
        {/* Large Album Art Section */}
        <div className="relative w-full aspect-square mb-10 group">
          {/* Glow Effect */}
          <div 
            className="absolute inset-0 blur-[48px] scale-90 rounded-[2rem] opacity-60 group-hover:opacity-100 transition-opacity duration-700"
            style={{ 
              background: `url(${albumArtUrl}) center/cover`,
              filter: 'blur(48px) brightness(0.8) saturate(1.5)'
            }}
          ></div>
          
          {/* Main Image Container */}
          <motion.div 
            animate={{ scale: isPlaying ? 1.02 : 1 }}
            transition={{ duration: 0.5 }}
            className="relative w-full h-full rounded-[2rem] overflow-hidden shadow-2xl"
          >
            <img 
              alt="Album Art" 
              className="w-full h-full object-cover" 
              src={albumArtUrl}
              referrerPolicy="no-referrer"
            />
          </motion.div>
        </div>

        {/* Meta Data Editorial Layout */}
        <div className="w-full mb-8 flex justify-between items-end">
          <div className="flex-1 min-w-0 pr-4">
            <h2 className="font-headline text-3xl font-extrabold tracking-tight text-white mb-1 leading-tight truncate">
              {currentTrack.title}
            </h2>
            <p className="font-body text-lg text-secondary-dim font-medium truncate">
              {currentTrack.artist}
            </p>
          </div>
          <motion.button 
            whileTap={{ scale: 0.8 }}
            className="w-12 h-12 flex items-center justify-center text-tertiary-dim hover:text-tertiary transition-all"
          >
            <Heart size={28} fill="currentColor" />
          </motion.button>
        </div>

        {/* Progress Slider Component */}
        <div className="w-full mb-10 group">
          <div className="relative w-full h-12 flex items-center">
            <input 
              type="range" 
              min="0" 
              max={duration || 100} 
              value={displayProgress}
              onChange={handleSeekChange}
              onMouseDown={handleSeekStart}
              onMouseUp={handleSeekEnd}
              onTouchStart={handleSeekStart}
              onTouchEnd={handleSeekEnd}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div className="relative w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
            {/* Scrubber thumb (visual only) */}
            <div 
              className="absolute h-4 w-4 bg-white rounded-full shadow-[0_0_12px_rgba(204,151,255,0.6)] pointer-events-none transition-transform group-hover:scale-125"
              style={{ left: `calc(${progressPercent}% - 8px)` }}
            ></div>
          </div>
          <div className="flex justify-between font-label text-[11px] font-bold text-on-surface-variant tracking-wider -mt-2">
            <span>{formatTime(displayProgress)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* High-End Controls Cluster (Glassmorphism) */}
        <div className="w-full glass-panel rounded-[2.5rem] p-8 flex flex-col items-center shadow-[0_32px_64px_rgba(0,0,0,0.3)]">
          <div className="flex items-center justify-between w-full mb-8">
            <motion.button 
              whileTap={{ scale: 0.9 }}
              onClick={toggleShuffle}
              className={`${isShuffle ? 'text-primary' : 'text-on-surface-variant'} hover:text-primary transition-colors`}
            >
              <Shuffle size={24} />
            </motion.button>
            
            <div className="flex items-center gap-6 sm:gap-8">
              <motion.button 
                whileTap={{ scale: 0.8 }}
                onClick={prevTrack}
                className="text-on-surface hover:text-primary transition-all"
              >
                <SkipBack size={36} fill="currentColor" />
              </motion.button>
              
              <motion.button 
                whileTap={{ scale: 0.9 }}
                onClick={togglePlay}
                className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary-dim flex items-center justify-center text-on-primary shadow-[0_12px_32px_rgba(156,72,234,0.4)]"
              >
                {isPlaying ? (
                  <Pause size={40} fill="currentColor" />
                ) : (
                  <Play size={40} fill="currentColor" className="ml-2" />
                )}
              </motion.button>
              
              <motion.button 
                whileTap={{ scale: 0.8 }}
                onClick={nextTrack}
                className="text-on-surface hover:text-primary transition-all"
              >
                <SkipForward size={36} fill="currentColor" />
              </motion.button>
            </div>
            
            <motion.button 
              whileTap={{ scale: 0.9 }}
              onClick={toggleRepeat}
              className={`${isRepeat ? 'text-primary' : 'text-on-surface-variant'} hover:text-primary transition-colors`}
            >
              <Repeat size={24} />
            </motion.button>
          </div>
          
          {/* Utility Row */}
          <div className="flex items-center justify-between w-full pt-6 border-t border-white/5 px-2">
            <button className="flex items-center gap-2 font-label text-[10px] uppercase tracking-widest text-on-surface-variant hover:text-white transition-colors group">
              <Mic2 size={18} className="group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline">Lyrics</span>
            </button>
            <button className="flex items-center gap-2 font-label text-[10px] uppercase tracking-widest text-on-surface-variant hover:text-white transition-colors group">
              <ListMusic size={18} className="group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline">Queue</span>
            </button>
            <button className="flex items-center gap-2 font-label text-[10px] uppercase tracking-widest text-on-surface-variant hover:text-white transition-colors group">
              <MonitorSpeaker size={18} className="group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline">Devices</span>
            </button>
          </div>
        </div>
      </main>
    </motion.div>
  );
}
