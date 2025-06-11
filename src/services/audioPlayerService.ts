import { MusicTrack, AudioPlayerState } from '../types/Music';

export class AudioPlayerService {
  private audio: HTMLAudioElement | null = null;
  private currentState: AudioPlayerState = {
    currentTrack: null,
    isPlaying: false,
    isLoading: false,
    progress: 0,
    volume: 70,
    duration: 0,
    currentTime: 0
  };
  private listeners: Array<(state: AudioPlayerState) => void> = [];

  constructor() {
    this.initializeAudioElement();
  }

  private initializeAudioElement(): void {
    if (this.audio) {
      this.cleanupAudio();
    }

    this.audio = new Audio();
    this.audio.preload = 'none';
    this.audio.volume = this.currentState.volume / 100;

    // Event listeners
    this.audio.addEventListener('loadstart', () => {
      this.updateState({ isLoading: true });
    });

    this.audio.addEventListener('canplay', () => {
      this.updateState({ 
        isLoading: false,
        duration: this.audio?.duration || 0
      });
    });

    this.audio.addEventListener('play', () => {
      this.updateState({ isPlaying: true, isLoading: false });
    });

    this.audio.addEventListener('pause', () => {
      this.updateState({ isPlaying: false });
    });

    this.audio.addEventListener('ended', () => {
      this.updateState({ 
        isPlaying: false, 
        progress: 0, 
        currentTime: 0 
      });
    });

    this.audio.addEventListener('timeupdate', () => {
      if (this.audio && this.audio.duration) {
        const currentTime = this.audio.currentTime;
        const progress = (currentTime / this.audio.duration) * 100;
        this.updateState({ 
          currentTime, 
          progress: Math.min(progress, 100) 
        });
      }
    });

    this.audio.addEventListener('error', (e) => {
      console.error('Audio error:', e);
      this.updateState({ 
        isPlaying: false, 
        isLoading: false 
      });
      this.notifyError('Error al reproducir la canción');
    });

    this.audio.addEventListener('volumechange', () => {
      this.updateState({ 
        volume: (this.audio?.volume || 0) * 100 
      });
    });
  }

  // Reproducir una canción
  async playTrack(track: MusicTrack): Promise<void> {
    try {
      // Si ya está reproduciéndose la misma canción, solo pausar/reanudar
      if (this.currentState.currentTrack?.id === track.id) {
        if (this.currentState.isPlaying) {
          this.pause();
        } else {
          this.resume();
        }
        return;
      }

      // Detener canción actual si existe
      if (this.currentState.currentTrack) {
        this.stop();
      }

      this.updateState({ 
        currentTrack: track, 
        isLoading: true,
        progress: 0,
        currentTime: 0
      });

      if (!this.audio) {
        this.initializeAudioElement();
      }

      // Cargar nueva canción
      this.audio!.src = track.previewUrl;
      this.audio!.load();

      // Intentar reproducir
      const playPromise = this.audio!.play();
      
      if (playPromise !== undefined) {
        await playPromise;
      }

    } catch (error: any) {
      console.error('Error playing track:', error);
      this.updateState({ 
        isPlaying: false, 
        isLoading: false 
      });
      this.notifyError('No se pudo reproducir la canción');
    }
  }

  // Pausar reproducción
  pause(): void {
    if (this.audio && !this.audio.paused) {
      this.audio.pause();
    }
  }

  // Reanudar reproducción
  resume(): void {
    if (this.audio && this.audio.paused && this.currentState.currentTrack) {
      this.audio.play().catch(error => {
        console.error('Error resuming audio:', error);
        this.notifyError('Error al reanudar la reproducción');
      });
    }
  }

  // Detener completamente la reproducción
  stop(): void {
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
    }
    this.updateState({ 
      currentTrack: null, 
      isPlaying: false, 
      progress: 0,
      currentTime: 0,
      duration: 0
    });
  }

  // Cambiar volumen (0-100)
  setVolume(volume: number): void {
    const clampedVolume = Math.max(0, Math.min(100, volume));
    if (this.audio) {
      this.audio.volume = clampedVolume / 100;
    }
    this.updateState({ volume: clampedVolume });
  }

  // Buscar posición específica (0-100)
  seekTo(percentage: number): void {
    if (this.audio && this.audio.duration) {
      const clampedPercentage = Math.max(0, Math.min(100, percentage));
      const seekTime = (clampedPercentage / 100) * this.audio.duration;
      this.audio.currentTime = seekTime;
      this.updateState({ 
        progress: clampedPercentage, 
        currentTime: seekTime 
      });
    }
  }

  // Obtener estado actual
  getCurrentState(): AudioPlayerState {
    return { ...this.currentState };
  }

  // Suscribirse a cambios de estado
  addStateListener(listener: (state: AudioPlayerState) => void): () => void {
    this.listeners.push(listener);
    
    // Devolver función para cancelar suscripción
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  // Verificar si una canción específica está reproduciéndose
  isTrackPlaying(trackId: string): boolean {
    return this.currentState.currentTrack?.id === trackId && this.currentState.isPlaying;
  }

  // Verificar si una canción específica está cargada
  isTrackLoaded(trackId: string): boolean {
    return this.currentState.currentTrack?.id === trackId;
  }

  // Limpiar recursos
  destroy(): void {
    this.cleanupAudio();
    this.listeners = [];
  }

  private cleanupAudio(): void {
    if (this.audio) {
      this.audio.pause();
      this.audio.src = '';
      this.audio.load();
      this.audio = null;
    }
  }

  private updateState(updates: Partial<AudioPlayerState>): void {
    this.currentState = { ...this.currentState, ...updates };
    this.notifyListeners();
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => {
      try {
        listener(this.getCurrentState());
      } catch (error) {
        console.error('Error notifying audio state listener:', error);
      }
    });
  }

  private notifyError(message: string): void {
    console.error('Audio Player Error:', message);
    // Aquí podrías integrar con un sistema de notificaciones
  }

  // Formatear tiempo en MM:SS
  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
}

// Instancia singleton global
export const audioPlayerService = new AudioPlayerService();
export default audioPlayerService; 