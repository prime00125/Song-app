import React, { createContext, useContext, useState, useRef, useEffect, ReactNode } from 'react';
import { Track } from '../types';

interface AudioContextType {
  tracks: Track[];
  currentTrackIndex: number;
  isPlaying: boolean;
  progress: number;
  duration: number;
  currentTrack: Track | null;
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  seek: (time: number) => void;
  setTracks: (tracks: Track[]) => void;
  playTrack: (index: number) => void;
  isShuffle: boolean;
  toggleShuffle: () => void;
  isRepeat: boolean;
  toggleRepeat: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

// Mock data to show UI before local files are loaded
const MOCK_TRACKS: Track[] = [
  {
    id: '1',
    title: 'Neon Nights',
    artist: 'Retro Future',
    albumArt: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB7ZHBxwzX88ZDqCgWVJnMU1bEu9WAKdCYAfO8Kyw0uF4pDFvQBOua5r8YjEnmLNsuaxtmwT04u5OF3yYVtq-m2HUG_3fGxpMPlsgmLykBz2b4BFmfYPHShZCvGAs6NVh99RKanJTwqZDvoMhFtTh4VO1wKuEl8849J0unqdvAc7Vs1kpMH97a6S8XscwzVuvXwGFL6dzLc6LXLskiDXEwB23P86yn4lrmdnUXdDQ_wTazhpNHM2gFoiqgpdofg-7XEI4SrP-N_GjCy',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
  },
  {
    id: '2',
    title: 'Silent Keys',
    artist: 'Lumière',
    albumArt: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAxtEJEV_Yc34nNGUQ2B7lqXe1r4LkXz4v_vCR0WxJKaoFcSvQa-EwRQYS9fbPhtoA7ejZ6rhEGyoq-SbEaOQoZJD9zcu4ogaoVJrWCrLGtXlwzkQOLRN6uNrikpxYjcREbZKcplM-4QiuUWO-5COzzJsPzvn_bAoqGxbV74HwXkM7jMjDX0E_4_S7MxNTUxEjnCjaCB9f_fD0avaq-ldGxpC5wBxXhEuByr0QQk3jP__S7wKf3cX6IWj1b4kVhSyE0z7i9QjlFwn3N',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3'
  },
  {
    id: '3',
    title: 'Cyber Dreams',
    artist: 'Neural Horizon',
    albumArt: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBXAxiuZw5gtit0kmDpm7YT-LwLciyzrSIXEjVLYCGng_BJH5l1N9fCyWFjrx19rqKE-kCDZHewjaq0D_ufwhcfO373Ur2KRRW8NV-ZXp_RypvwwcO7TpUuYlFQP2jYWOxIe0cU0fabYO7S1QmgH7vIewhq0ycZcJP2PFFAc01ghCBujF0Nii6dB6qOKasR6nscOQ-POf2UZQqiU4yzkHTElIE8V0NRua2au59Y8vyKjtvSY1XAhgw8j4TdGtU1Ge4V1_XyKN52dYaL',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3'
  },
  {
    id: '4',
    title: 'Electric Pulse',
    artist: 'Synthwave Collective',
    albumArt: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBtEzYm6hl9GH5ygwcDAhhOb3jawF4fBs3RxI_jlP8QEkyu6-iIN30UhOqpxGJubIE1nV0z_QAyouQrwi5me-U6C7-7mxYzGzYOMZ3IaQZyEM8VZfmJhSPJ1UrzY4VzJbKD-t4qCYPqrdgvx2ydJSBeWiXcqbNP1ZzWtip1VgWK50mudYcleTlCJEidXGFuG4yUBiWLzxyxApOtZAntc7uYqmorRJ2IsUb8TeDSMSd_kvm0Bl5tJimxr0ZmeH6FRwc4DrSbScGQik4T',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3'
  }
];

export const AudioProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tracks, setTracksState] = useState<Track[]>(MOCK_TRACKS);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const animationRef = useRef<number>();

  const currentTrack = tracks[currentTrackIndex] || null;

  // Initialize audio element
  useEffect(() => {
    audioRef.current = new Audio();
    
    const audio = audioRef.current;
    
    const setAudioData = () => {
      setDuration(audio.duration);
    };

    const setAudioTime = () => {
      setProgress(audio.currentTime);
    };

    const handleEnded = () => {
      if (isRepeat) {
        audio.currentTime = 0;
        audio.play();
      } else {
        nextTrack();
      }
    };

    audio.addEventListener('loadeddata', setAudioData);
    audio.addEventListener('timeupdate', setAudioTime);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('loadeddata', setAudioData);
      audio.removeEventListener('timeupdate', setAudioTime);
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
      audio.src = '';
    };
  }, [isRepeat]); // Re-bind if repeat changes, or handle inside

  // Handle track change
  useEffect(() => {
    if (audioRef.current && currentTrack) {
      const audio = audioRef.current;
      
      // Clean up previous object URL if it was a local file
      if (audio.src && audio.src.startsWith('blob:')) {
        URL.revokeObjectURL(audio.src);
      }

      if (currentTrack.file) {
        audio.src = URL.createObjectURL(currentTrack.file);
      } else if (currentTrack.url) {
        audio.src = currentTrack.url;
      }

      audio.load();
      if (isPlaying) {
        audio.play().catch(e => console.error("Playback failed", e));
      }
    }
  }, [currentTrackIndex, tracks]);

  // Handle play/pause state changes
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => {
          console.error("Playback failed", e);
          setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  const play = () => setIsPlaying(true);
  const pause = () => setIsPlaying(false);
  const togglePlay = () => setIsPlaying(!isPlaying);

  const nextTrack = () => {
    if (tracks.length === 0) return;
    if (isShuffle) {
      let nextIdx = Math.floor(Math.random() * tracks.length);
      while (nextIdx === currentTrackIndex && tracks.length > 1) {
        nextIdx = Math.floor(Math.random() * tracks.length);
      }
      setCurrentTrackIndex(nextIdx);
    } else {
      setCurrentTrackIndex((prev) => (prev + 1) % tracks.length);
    }
    setIsPlaying(true);
  };

  const prevTrack = () => {
    if (tracks.length === 0) return;
    if (progress > 3 && audioRef.current) {
      // If played more than 3 seconds, restart current track
      audioRef.current.currentTime = 0;
    } else {
      setCurrentTrackIndex((prev) => (prev - 1 + tracks.length) % tracks.length);
    }
    setIsPlaying(true);
  };

  const seek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setProgress(time);
    }
  };

  const setTracks = (newTracks: Track[]) => {
    setTracksState(newTracks);
    setCurrentTrackIndex(0);
    setIsPlaying(false);
    setProgress(0);
  };

  const playTrack = (index: number) => {
    setCurrentTrackIndex(index);
    setIsPlaying(true);
  };

  const toggleShuffle = () => setIsShuffle(!isShuffle);
  const toggleRepeat = () => setIsRepeat(!isRepeat);

  return (
    <AudioContext.Provider value={{
      tracks,
      currentTrackIndex,
      isPlaying,
      progress,
      duration,
      currentTrack,
      play,
      pause,
      togglePlay,
      nextTrack,
      prevTrack,
      seek,
      setTracks,
      playTrack,
      isShuffle,
      toggleShuffle,
      isRepeat,
      toggleRepeat
    }}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};
