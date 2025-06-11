import { User } from './User';
import { MusicTrack } from './Music';

export interface Music {
  id: string;
  songName: string;
  artist: string;
  albumName: string;
  albumCover?: string;
  duration?: number;
  spotifyUrl?: string;
}

export interface Comment {
  id: string;
  userId: string;
  user?: User; // Opcional para cuando se carga desde Firebase
  content: string;
  createdAt: string; // ISO string para compatibilidad con Firebase
}

export interface Post {
  id: string;
  userId: string;
  user?: User; // Opcional para cuando se carga desde Firebase
  content: string;
  imageUrl?: string; // Para imágenes del post
  musicTrack?: MusicTrack; // Nueva integración con Deezer
  music?: Music; // Mantener para compatibilidad
  musicUrl?: string; // URL directa de la música (para Deezer/Spotify)
  musicTitle?: string; // Título de la canción
  musicArtist?: string; // Artista de la canción
  createdAt: string; // ISO string para compatibilidad con Firebase
  updatedAt: string; // ISO string para compatibilidad con Firebase
  likesCount: number;
  commentsCount: number;
  comments: Comment[];
  likedBy: string[]; // Array de user IDs que han dado like
  isLiked?: boolean; // Si el usuario actual ha dado like
}

export interface CreatePostData {
  content: string;
  imageUrl?: string;
  musicTrack?: MusicTrack; // Nueva integración con Deezer
  musicId?: string;
  musicUrl?: string;
  musicTitle?: string;
  musicArtist?: string;
}

export interface CreateCommentData {
  postId: string;
  content: string;
} 