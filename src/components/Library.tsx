import React, { useRef } from 'react';
import { motion } from 'motion/react';
import { Settings, Music, Clock, Play, Shuffle, MoreVertical, FolderOpen } from 'lucide-react';
import { useAudio } from '../context/AudioContext';
import { ScreenType, Track } from '../types';

interface LibraryProps {
  onNavigate: (screen: ScreenType) => void;
}

export default function Library({ onNavigate }: LibraryProps) {
  const { tracks, playTrack, setTracks, currentTrack, isPlaying, togglePlay } = useAudio();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const audioFiles = Array.from(files).filter(file => file.type.startsWith('audio/'));
    
    if (audioFiles.length > 0) {
      const newTracks: Track[] = audioFiles.map((file, index) => ({
        id: `local-${Date.now()}-${index}`,
        title: file.name.replace(/\.[^/.]+$/, ""), // Remove extension
        artist: 'Local Audio',
        file: file,
        // Generate a deterministic gradient based on filename for local files
        albumArt: `https://picsum.photos/seed/${encodeURIComponent(file.name)}/400/400`
      }));
      
      setTracks(newTracks);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="min-h-screen pb-24"
    >
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-xl shadow-lg border-b border-outline-variant/10">
        <div className="flex justify-between items-center px-6 h-16 w-full max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-surface-variant ring-2 ring-primary/20">
              <img 
                alt="User Profile" 
                className="w-full h-full object-cover" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA81JzxE0Yydk4zBFJrZexC3sQI2Z7n06QqMd3S5Yfa7a4kgB5RF5GrtKIr3MO1QNW-5Ri1I60Q3po5sKdjirGJeDl--6cwll4OM0Dp89KltCmvEQJmciS86YNEVQwjaDWK7hGEkkKuSqY9rTQI3w0M80bxICpX9aKM9IZThAN0H4FQAOF_RFKeiBeRNa4vlykDP_pmKGNFhcCKp6BtdGbXfLSgMMRtiYsXVUMRKyab0l9NvaEEuE5xTxY3KirhkaEHQ14SFbCWHZ3e"
              />
            </div>
            <h1 className="font-headline font-black text-2xl tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-primary to-primary-dim">
              Prime Music
            </h1>
          </div>
          <div className="flex items-center gap-1">
            <motion.button 
              whileTap={{ scale: 0.9 }}
              onClick={() => onNavigate('settings')}
              className="text-primary hover:bg-white/10 transition-colors duration-300 p-2 rounded-full flex items-center justify-center"
            >
              <Settings size={24} />
            </motion.button>
          </div>
        </div>
      </header>

      <main className="pt-20 px-6 max-w-7xl mx-auto space-y-8">
        {/* Summary Section */}
        <section className="pt-4 flex justify-between items-end">
          <div>
            <h2 className="font-headline text-3xl font-extrabold tracking-tight mb-2">My Library</h2>
            <div className="flex gap-4 text-on-surface-variant text-sm font-medium">
              <span className="flex items-center gap-1"><Music size={16} /> {tracks.length} Tracks</span>
              <span className="flex items-center gap-1"><Clock size={16} /> Local & Cloud</span>
            </div>
          </div>
          
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileSelect} 
            accept="audio/*" 
            multiple 
            className="hidden" 
          />
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 bg-surface-container-high hover:bg-surface-container-highest text-primary px-4 py-2 rounded-full text-sm font-bold border border-primary/20 transition-colors"
          >
            <FolderOpen size={16} />
            Load Local
          </motion.button>
        </section>

        {/* Sub-navigation Tabs */}
        <nav className="flex border-b border-outline-variant/20">
          <button className="px-6 py-3 text-primary border-b-2 border-primary font-bold">Songs</button>
          <button className="px-6 py-3 text-on-surface-variant hover:text-on-surface transition-colors font-semibold">Albums</button>
        </nav>

        {/* Action Buttons Section */}
        <section className="flex gap-4">
          <motion.button 
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              if (tracks.length > 0) {
                playTrack(0);
                onNavigate('now-playing');
              }
            }}
            className="flex-1 bg-gradient-to-br from-primary to-primary-dim text-on-primary h-12 rounded-xl font-bold flex items-center justify-center gap-2 shadow-[0_8px_16px_rgba(204,151,255,0.2)]"
          >
            <Play size={20} fill="currentColor" />
            Play All
          </motion.button>
          <motion.button 
            whileTap={{ scale: 0.95 }}
            className="flex-1 bg-surface-container-high text-on-surface h-12 rounded-xl font-bold flex items-center justify-center gap-2 border border-outline-variant/30 hover:bg-surface-container-highest transition-colors"
          >
            <Shuffle size={20} />
            Shuffle
          </motion.button>
        </section>

        {/* All Songs List */}
        <section className="space-y-2">
          {tracks.map((track, index) => {
            const isCurrentlyPlaying = currentTrack?.id === track.id;
            
            return (
              <motion.div 
                key={track.id}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => {
                  if (isCurrentlyPlaying) {
                    onNavigate('now-playing');
                  } else {
                    playTrack(index);
                    onNavigate('now-playing');
                  }
                }}
                className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors group ${
                  isCurrentlyPlaying ? 'bg-primary/10 border border-primary/20' : 'hover:bg-surface-variant/50'
                }`}
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-surface-container relative">
                    <img 
                      alt={track.title} 
                      className="w-full h-full object-cover" 
                      src={track.albumArt || `https://picsum.photos/seed/${track.id}/100/100`}
                    />
                    {isCurrentlyPlaying && isPlaying && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <div className="flex gap-1 items-end h-4">
                          <motion.div animate={{ height: ['4px', '12px', '4px'] }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-1 bg-primary rounded-full" />
                          <motion.div animate={{ height: ['8px', '16px', '8px'] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.2 }} className="w-1 bg-primary rounded-full" />
                          <motion.div animate={{ height: ['6px', '10px', '6px'] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.4 }} className="w-1 bg-primary rounded-full" />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="truncate">
                    <h4 className={`font-bold truncate ${isCurrentlyPlaying ? 'text-primary' : 'text-on-surface'}`}>
                      {track.title}
                    </h4>
                    <p className="text-on-surface-variant text-sm truncate">{track.artist}</p>
                  </div>
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    // Open menu
                  }}
                  className="p-2 text-on-surface-variant hover:text-on-surface rounded-full hover:bg-white/5"
                >
                  <MoreVertical size={20} />
                </button>
              </motion.div>
            );
          })}
          
          {tracks.length === 0 && (
            <div className="text-center py-12 text-on-surface-variant">
              <Music size={48} className="mx-auto mb-4 opacity-20" />
              <p>No tracks loaded.</p>
              <p className="text-sm mt-2">Click "Load Local" to add music from your device.</p>
            </div>
          )}
        </section>
      </main>
    </motion.div>
  );
}
