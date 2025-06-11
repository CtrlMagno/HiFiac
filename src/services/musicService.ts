import { 
  DeezerSearchResponse, 
  DeezerTrack, 
  MusicTrack, 
  MusicSearchQuery, 
  MusicSearchResult 
} from '../types/Music';

export class MusicService {
  private readonly DEEZER_API_BASE = 'https://api.deezer.com';
  private readonly CORS_PROXIES = [
    'https://api.allorigins.win/raw?url=',
    'https://corsproxy.io/?',
    'https://api.codetabs.com/v1/proxy?quest='
  ]; // Proxies con fallback
  
  private getProxyUrl(deezerUrl: string, proxyIndex: number = 0): string {
    const proxy = this.CORS_PROXIES[proxyIndex];
    
    if (proxy.includes('allorigins.win')) {
      // allorigins.win necesita encodeURIComponent
      return `${proxy}${encodeURIComponent(deezerUrl)}`;
    } else if (proxy.includes('corsproxy.io')) {
      // corsproxy.io usa formato diferente
      return `${proxy}${encodeURIComponent(deezerUrl)}`;
    } else if (proxy.includes('codetabs.com')) {
      // codetabs no necesita encoding
      return `${proxy}${deezerUrl}`;
    }
    
    // Formato por defecto
    return `${proxy}${deezerUrl}`;
  }

  private async fetchWithFallback(deezerUrl: string): Promise<Response> {
    for (let i = 0; i < this.CORS_PROXIES.length; i++) {
      const proxy = this.CORS_PROXIES[i];
      const apiUrl = this.getProxyUrl(deezerUrl, i);
      
      console.log(`🔄 Intentando proxy ${i + 1}/${this.CORS_PROXIES.length}: ${proxy}`);
      console.log(`🌐 URL completa: ${apiUrl}`);
      
      try {
        const response = await fetch(apiUrl);
        console.log(`📡 Respuesta del proxy ${i + 1}: ${response.status} ${response.statusText}`);
        
        if (response.ok) {
          return response;
        } else if (response.status !== 408 && response.status !== 503 && response.status !== 502) {
          // Si no es un error de servidor, probablemente es un error de API
          return response;
        }
        
        console.log(`⚠️ Proxy ${i + 1} falló con status ${response.status}, probando siguiente...`);
        
      } catch (error) {
        console.log(`❌ Proxy ${i + 1} falló completamente:`, error);
        
        // Si es el último proxy, lanzar el error
        if (i === this.CORS_PROXIES.length - 1) {
          throw error;
        }
      }
    }
    
    throw new Error('Todos los proxies CORS fallaron');
  }

  // Buscar canciones en Deezer
  async searchTracks(query: MusicSearchQuery): Promise<MusicSearchResult> {
    try {
      const { query: searchTerm, limit = 25, index = 0 } = query;
      
      if (!searchTerm || searchTerm.trim().length < 2) {
        return {
          tracks: [],
          total: 0,
          hasMore: false
        };
      }

      const encodedQuery = encodeURIComponent(searchTerm.trim());
      const deezerUrl = `${this.DEEZER_API_BASE}/search?q=${encodedQuery}&limit=${limit}&index=${index}`;

      console.log('🎵 Buscando en Deezer:', searchTerm);
      console.log('🔗 URL de Deezer:', deezerUrl);
      
      const response = await this.fetchWithFallback(deezerUrl);
      
      if (!response.ok) {
        throw new Error(`Error en la búsqueda: ${response.status}`);
      }

      const responseText = await response.text();
      console.log('📄 Primeros 100 caracteres de la respuesta:', responseText.substring(0, 100));
      
      // Verificar si la respuesta es HTML en lugar de JSON
      if (responseText.trim().startsWith('<')) {
        throw new Error('El proxy CORS devolvió HTML en lugar de JSON. Intenta de nuevo más tarde.');
      }

      const data: DeezerSearchResponse = JSON.parse(responseText);
      console.log('🔍 Estructura de datos recibida:', {
        hasData: !!data.data,
        dataLength: data.data?.length || 0,
        total: data.total
      });
      
      // Verificar que tenemos la estructura esperada
      if (!data.data || !Array.isArray(data.data)) {
        throw new Error('Respuesta de la API de Deezer no tiene la estructura esperada');
      }
      
      const tracks = data.data.map(track => this.convertDeezerTrackToMusicTrack(track));
      
      return {
        tracks,
        total: data.total,
        hasMore: (index + limit) < data.total
      };

    } catch (error: any) {
      console.error('Error searching tracks:', error);
      throw new Error(error.message || 'Error al buscar canciones');
    }
  }

  // Obtener información de una canción específica
  async getTrackById(trackId: string): Promise<MusicTrack | null> {
    try {
      const deezerUrl = `${this.DEEZER_API_BASE}/track/${trackId}`;
      const response = await this.fetchWithFallback(deezerUrl);
      
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`Error al obtener canción: ${response.status}`);
      }

      const track: DeezerTrack = await response.json();
      return this.convertDeezerTrackToMusicTrack(track);

    } catch (error: any) {
      console.error('Error getting track by id:', error);
      return null;
    }
  }

  // Convertir DeezerTrack a nuestro MusicTrack
  private convertDeezerTrackToMusicTrack(deezerTrack: DeezerTrack): MusicTrack {
    return {
      id: deezerTrack.id.toString(),
      title: deezerTrack.title,
      artist: deezerTrack.artist.name,
      album: deezerTrack.album.title,
      duration: deezerTrack.duration,
      previewUrl: deezerTrack.preview,
      coverUrl: deezerTrack.album.cover_medium || deezerTrack.album.cover,
      deezerUrl: `https://www.deezer.com/track/${deezerTrack.id}`
    };
  }

  // Formatear duración en segundos a MM:SS
  formatDuration(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  // Validar si un preview URL está disponible
  async validatePreviewUrl(url: string): Promise<boolean> {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      return response.ok;
    } catch {
      return false;
    }
  }

  // Buscar canciones populares por artista
  async searchByArtist(artistName: string, limit: number = 10): Promise<MusicSearchResult> {
    return this.searchTracks({
      query: `artist:"${artistName}"`,
      limit,
      index: 0
    });
  }

  // Buscar canciones por álbum
  async searchByAlbum(albumName: string, limit: number = 10): Promise<MusicSearchResult> {
    return this.searchTracks({
      query: `album:"${albumName}"`,
      limit,
      index: 0
    });
  }

  // Obtener sugerencias basadas en una canción
  async getSimilarTracks(trackId: string): Promise<MusicTrack[]> {
    try {
      // Como Deezer no tiene endpoint directo de recomendaciones,
      // buscamos canciones del mismo artista
      const track = await this.getTrackById(trackId);
      if (!track) {
        return [];
      }

      const result = await this.searchByArtist(track.artist, 5);
      // Filtrar la canción original
      return result.tracks.filter(t => t.id !== trackId);

    } catch (error) {
      console.error('Error getting similar tracks:', error);
      return [];
    }
  }

  // Verificar si Deezer está disponible
  async isDeezerAvailable(): Promise<boolean> {
    try {
      const response = await this.fetchWithFallback(this.DEEZER_API_BASE + '/genre');
      return response.ok;
    } catch {
      return false;
    }
  }
}

// Instancia singleton
export const musicService = new MusicService();
export default musicService; 