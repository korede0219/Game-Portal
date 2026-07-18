export interface Game {
  id: string;
  name: string;
  coverGradient: string;
  isFavorite: boolean;
  playtime: number; // in minutes
  lastPlayed: number; // timestamp, 0 if never
  dateAdded: number; // timestamp
  genre?: string;
  developer?: string;
  description?: string;
}

