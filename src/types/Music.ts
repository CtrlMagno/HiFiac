// Tipos para la integración con Deezer API

export interface DeezerTrack {
  id: number;
  title: string;
  title_short: string;
  title_version?: string;
  duration: number;
  rank: number;
  explicit_lyrics: boolean;
  explicit_content_lyrics: number;
  explicit_content_cover: number;
  preview: string; // URL del preview de 30 segundos
  artist: DeezerArtist;
  album: DeezerAlbum;
  type: string;
}

export interface DeezerArtist {
  id: number;
  name: string;
  link: string;
  picture: string;
  picture_small: string;
  picture_medium: string;
  picture_big: string;
  picture_xl: string;
  tracklist: string;
  type: string;
}

export interface DeezerAlbum {
  id: number;
  title: string;
  cover: string;
  cover_small: string;
  cover_medium: string;
  cover_big: string;
  cover_xl: string;
  md5_image: string;
  tracklist: string;
  type: string;
}

export interface DeezerSearchResponse {
  data: DeezerTrack[];
  total: number;
  next?: string;
  prev?: string;
}

// Tipos simplificados para usar en nuestros posts
export interface MusicTrack {
  id: string; // Deezer track ID
  title: string;
  artist: string;
  album: string;
  duration: number; // en segundos
  previewUrl: string; // URL del preview de 30s
  coverUrl: string; // URL de la portada del álbum
  deezerUrl?: string; // URL completa en Deezer
}

// Estados del reproductor
export interface AudioPlayerState {
  currentTrack: MusicTrack | null;
  isPlaying: boolean;
  isLoading: boolean;
  progress: number; // 0-100
  volume: number; // 0-100
  duration: number; // en segundos
  currentTime: number; // en segundos
}

// Para búsqueda de música
export interface MusicSearchQuery {
  query: string;
  limit?: number;
  index?: number;
}

export interface MusicSearchResult {
  tracks: MusicTrack[];
  total: number;
  hasMore: boolean;
} 