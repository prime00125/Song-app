import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Search, SlidersHorizontal, Headphones, MonitorSpeaker, RefreshCw, FolderOpen, RotateCcw, CloudUpload, Info, ChevronRight, Palette, LayoutDashboard } from 'lucide-react';
import { ScreenType } from '../types';

interface SettingsProps {
  onNavigate: (screen: ScreenType) => void;
}

export default function Settings({ onNavigate }: SettingsProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="min-h-screen bg-background text-on-surface pb-12"
    >
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-3xl shadow-[0_32px_32px_rgba(139,92,246,0.05)] border-b border-white/5">
        <div className="flex items-center justify-between px-6 py-5 max-w-screen-2xl mx-auto">
          <div className="flex items-center gap-4">
            <motion.button 
              whileTap={{ scale: 0.9 }}
              onClick={() => onNavigate('library')}
              className="text-primary hover:bg-primary/10 p-2 rounded-full transition-colors"
            >
              <ArrowLeft size={24} />
            </motion.button>
            <h1 className="font-headline text-xl font-bold uppercase tracking-tight text-primary">Settings</h1>
          </div>
        </div>
      </header>

      <main className="pt-28 px-6 max-w-4xl mx-auto space-y-12">
        {/* Search Section */}
        <section className="relative">
          <div className="flex items-center bg-surface-container-high rounded-full px-6 py-4 transition-all focus-within:ring-2 focus-within:ring-primary/20 border border-white/5">
            <Search className="text-outline mr-4" size={20} />
            <input 
              className="bg-transparent border-none focus:ring-0 w-full text-on-surface placeholder-outline-variant font-body outline-none" 
              placeholder="Search settings..." 
              type="text"
            />
          </div>
        </section>

        {/* Audio Section */}
        <section>
          <h2 className="font-headline text-on-surface-variant text-xs font-bold uppercase tracking-[0.2em] mb-6 px-2">Audio Engine</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="glass-panel p-6 rounded-xl flex flex-col justify-between hover:bg-surface-container-highest/60 transition-colors cursor-pointer group">
              <div className="flex items-start justify-between">
                <div className="bg-primary/10 p-3 rounded-xl text-primary">
                  <SlidersHorizontal size={24} />
                </div>
                <ChevronRight className="text-outline group-hover:text-primary transition-colors" size={20} />
              </div>
              <div className="mt-8">
                <h3 className="font-headline text-xl font-bold">Equalizer</h3>
                <p className="text-on-surface-variant text-sm mt-1">10-band studio grade parametric EQ</p>
              </div>
            </div>

            <div className="glass-panel p-6 rounded-xl space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-secondary/10 p-3 rounded-xl text-secondary">
                    <Headphones size={24} />
                  </div>
                  <div>
                    <h3 className="font-headline font-bold">Hi-Res Audio</h3>
                    <p className="text-on-surface-variant text-xs">24-bit / 192kHz Output</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-primary peer-checked:to-primary-dim"></div>
                </label>
              </div>
              
              <div className="h-[1px] bg-outline-variant/20"></div>
              
              <div className="flex items-center justify-between group cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="bg-tertiary/10 p-3 rounded-xl text-tertiary">
                    <MonitorSpeaker size={24} />
                  </div>
                  <div>
                    <h3 className="font-headline font-bold">Audio Output</h3>
                    <p className="text-secondary text-xs">LDAC Bluetooth Headset</p>
                  </div>
                </div>
                <ChevronRight className="text-outline group-hover:text-primary transition-colors" size={20} />
              </div>
            </div>
          </div>
        </section>

        {/* Library Section */}
        <section>
          <h2 className="font-headline text-on-surface-variant text-xs font-bold uppercase tracking-[0.2em] mb-6 px-2">Library Management</h2>
          <div className="bg-surface-container-low rounded-xl overflow-hidden border border-white/5">
            <div className="p-4 flex items-center justify-between hover:bg-surface-container-high transition-colors cursor-pointer group">
              <div className="flex items-center gap-4">
                <RefreshCw className="text-outline group-hover:text-primary" size={20} />
                <span className="font-body font-medium">Scan for Music</span>
              </div>
              <span className="text-xs text-outline-variant italic">Last scan: 2h ago</span>
            </div>
            
            <div className="p-4 flex items-center justify-between hover:bg-surface-container-high transition-colors cursor-pointer group border-t border-white/5">
              <div className="flex items-center gap-4">
                <FolderOpen className="text-outline group-hover:text-primary" size={20} />
                <span className="font-body font-medium">Manage Folders</span>
              </div>
              <ChevronRight className="text-outline-variant" size={20} />
            </div>
            
            <div className="p-4 flex items-center justify-between hover:bg-surface-container-high transition-colors border-t border-white/5">
              <div className="flex items-center gap-4">
                <RotateCcw className="text-outline" size={20} />
                <div className="flex flex-col">
                  <span className="font-body font-medium">Auto-Update Library</span>
                  <span className="text-xs text-on-surface-variant">Background monitoring enabled</span>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-primary peer-checked:to-primary-dim"></div>
              </label>
            </div>
          </div>
        </section>

        {/* Personalization Section */}
        <section>
          <h2 className="font-headline text-on-surface-variant text-xs font-bold uppercase tracking-[0.2em] mb-6 px-2">Personalization</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="glass-panel p-5 rounded-xl">
              <p className="text-xs text-on-surface-variant font-bold uppercase mb-4">Theme</p>
              <div className="flex gap-2">
                <button className="flex-1 bg-surface-container-highest border border-primary p-2 rounded-lg text-[10px] font-bold text-white">DARK</button>
                <button className="flex-1 bg-surface-container-low border border-outline-variant/20 p-2 rounded-lg text-[10px] font-bold text-outline hover:text-white transition-colors">LIGHT</button>
              </div>
            </div>
            
            <div className="glass-panel p-5 rounded-xl">
              <p className="text-xs text-on-surface-variant font-bold uppercase mb-4">Accent</p>
              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <div className="w-6 h-6 rounded-full bg-primary ring-2 ring-white ring-offset-2 ring-offset-surface"></div>
                  <div className="w-6 h-6 rounded-full bg-secondary opacity-50 cursor-pointer hover:opacity-100 transition-opacity"></div>
                  <div className="w-6 h-6 rounded-full bg-tertiary opacity-50 cursor-pointer hover:opacity-100 transition-opacity"></div>
                </div>
                <Palette className="text-outline" size={20} />
              </div>
            </div>
            
            <div className="glass-panel p-5 rounded-xl cursor-pointer hover:bg-surface-container-highest/60 transition-colors group">
              <p className="text-xs text-on-surface-variant font-bold uppercase mb-4">Layout</p>
              <div className="flex items-center justify-between">
                <span className="font-body text-sm">Glass Flow</span>
                <LayoutDashboard className="text-primary" size={20} />
              </div>
            </div>
          </div>
        </section>

        {/* System Section */}
        <section>
          <h2 className="font-headline text-on-surface-variant text-xs font-bold uppercase tracking-[0.2em] mb-6 px-2">System</h2>
          <div className="space-y-3">
            <button className="w-full flex items-center justify-between p-5 bg-surface-container-low rounded-xl hover:bg-surface-container-high transition-all active:scale-[0.98] border border-white/5">
              <div className="flex items-center gap-4">
                <CloudUpload className="text-outline" size={20} />
                <span className="font-body font-medium">Backup & Restore</span>
              </div>
              <ChevronRight className="text-outline-variant" size={20} />
            </button>
            
            <button className="w-full flex items-center justify-between p-5 bg-surface-container-low rounded-xl hover:bg-surface-container-high transition-all active:scale-[0.98] border border-white/5">
              <div className="flex items-center gap-4">
                <Info className="text-outline" size={20} />
                <span className="font-body font-medium">About Sonic Atmosphere</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-primary font-bold">v2.4.0</span>
                <ChevronRight className="text-outline-variant" size={20} />
              </div>
            </button>
          </div>
        </section>
      </main>
    </motion.div>
  );
}
