import React, { useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { AudioProvider } from './context/AudioContext';
import Library from './components/Library';
import NowPlaying from './components/NowPlaying';
import Settings from './components/Settings';
import { ScreenType } from './types';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('library');

  return (
    <AudioProvider>
      <div className="bg-background min-h-screen text-on-surface overflow-hidden relative">
        <AnimatePresence mode="wait">
          {currentScreen === 'library' && (
            <Library key="library" onNavigate={setCurrentScreen} />
          )}
          {currentScreen === 'now-playing' && (
            <NowPlaying key="now-playing" onNavigate={setCurrentScreen} />
          )}
          {currentScreen === 'settings' && (
            <Settings key="settings" onNavigate={setCurrentScreen} />
          )}
        </AnimatePresence>
      </div>
    </AudioProvider>
  );
}
