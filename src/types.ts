export interface Track {
  id: string;
  title: string;
  artist: string;
  albumArt?: string;
  url?: string; // For remote mock data
  file?: File;  // For local files
  duration?: number;
}

export type ScreenType = 'library' | 'now-playing' | 'settings';
