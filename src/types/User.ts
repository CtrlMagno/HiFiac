export interface User {
  id: string;
  username: string;
  email: string;
  fullName?: string;
  avatar?: string; // URL de la imagen de perfil
  bio?: string;
  location?: string;
  website?: string;
  joinDate?: string; // ISO string para compatibilidad con Firebase
  followersCount: number;
  followingCount: number;
  postsCount: number;
  isVerified?: boolean;
  // Mantener para compatibilidad con código existente
  profileImage?: string;
  createdAt?: string; // ISO string para compatibilidad con Firebase
  updatedAt?: string; // ISO string para compatibilidad con Firebase
}

export interface CreateUserData {
  username: string;
  email: string;
  password: string;
  fullName?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface UpdateUserData {
  username?: string;
  email?: string;
  bio?: string;
  profileImage?: string;
} 