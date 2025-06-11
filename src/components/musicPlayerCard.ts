import { loadComponentCSS } from '../utils/cssLoader';
import { MusicTrack } from '../types/Music';
import { audioPlayerService } from '../services/audioPlayerService';
import { musicService } from '../services/musicService';

class MusicPlayerCard extends HTMLElement {
    private shadow: ShadowRoot;
    private track: MusicTrack | null = null;
    private isPlaying = false;
    private isLoading = false;
    private unsubscribeAudio: (() => void) | null = null;

    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'open' });
    }

    connectedCallback(): void {
        // Suscribirse al estado del reproductor de audio
        this.unsubscribeAudio = audioPlayerService.addStateListener(this.handleAudioStateChange.bind(this));
    }

    disconnectedCallback(): void {
        // Limpiar suscripción
        if (this.unsubscribeAudio) {
            this.unsubscribeAudio();
        }
    }

    private handleAudioStateChange(state: any): void {
        if (this.track && state.currentTrack?.id === this.track.id) {
            this.isPlaying = state.isPlaying;
            this.isLoading = state.isLoading;
        } else {
            this.isPlaying = false;
            this.isLoading = false;
        }
        this.updatePlayButton();
    }

    public setTrack(track: MusicTrack): void {
        this.track = track;
        this.render();
    }

    render(): void {
        if (!this.shadow || !this.track) return;

        this.shadow.innerHTML = `
            <style>
            ${loadComponentCSS('musicPlayerCard')}
            </style>
            <div class="MusicCard">
                <div class="MusicCover">
                    <img src="${this.track.coverUrl}" alt="${this.track.album}" loading="lazy">
                    <div class="PlayOverlay" id="playOverlay">
                        <button id="playButton" class="PlayButton" title="${this.isPlaying ? 'Pausar' : 'Reproducir'}">
                            <span id="playIcon" class="PlayIcon">${this.getPlayIcon()}</span>
                        </button>
                    </div>
                </div>
                <div class="MusicInfo">
                    <div class="MusicTitle">${this.escapeHtml(this.track.title)}</div>
                    <div class="MusicArtist">${this.escapeHtml(this.track.artist)}</div>
                    <div class="MusicAlbum">${this.escapeHtml(this.track.album)}</div>
                    <div class="MusicDuration">${musicService.formatDuration(this.track.duration)}</div>
                </div>
                <div class="MusicActions">
                    <button id="mainPlayButton" class="MainPlayButton ${this.isPlaying ? 'playing' : ''}" 
                            title="${this.isPlaying ? 'Pausar' : 'Reproducir'}"
                            ${this.isLoading ? 'disabled' : ''}>
                        <span class="ButtonIcon">${this.getPlayIcon()}</span>
                        <span class="ButtonText">${this.isPlaying ? 'Pausar' : 'Reproducir'}</span>
                    </button>
                </div>
            </div>
        `;

        this.setupEventListeners();
    }

    private setupEventListeners(): void {
        const playButton = this.shadow.getElementById('playButton');
        const mainPlayButton = this.shadow.getElementById('mainPlayButton');

        playButton?.addEventListener('click', (e) => {
            e.stopPropagation();
            this.togglePlayback();
        });

        mainPlayButton?.addEventListener('click', (e) => {
            e.stopPropagation();
            this.togglePlayback();
        });
    }

    private async togglePlayback(): Promise<void> {
        if (!this.track) return;

        try {
            // Si está cargando, no hacer nada
            if (this.isLoading) return;

            // Si es la misma canción y está reproduciéndose, pausar
            if (audioPlayerService.isTrackPlaying(this.track.id)) {
                audioPlayerService.pause();
                return;
            }

            // Si es la misma canción pero pausada, reanudar
            if (audioPlayerService.isTrackLoaded(this.track.id) && !this.isPlaying) {
                audioPlayerService.resume();
                return;
            }

            // Si es una canción diferente o primera vez, necesitamos obtener el preview URL
            if (!this.track.previewUrl) {
                this.isLoading = true;
                this.updatePlayButton();

                // Obtener el track completo con preview URL
                const fullTrack = await musicService.getTrackById(this.track.id);
                if (fullTrack && fullTrack.previewUrl) {
                    this.track.previewUrl = fullTrack.previewUrl;
                } else {
                    throw new Error('No hay preview disponible para esta canción');
                }
            }

            // Reproducir la canción
            await audioPlayerService.playTrack(this.track);

        } catch (error) {
            console.error('Error playing track:', error);
            this.isLoading = false;
            this.updatePlayButton();
            
            // Mostrar error al usuario
            this.showError('No se pudo reproducir la canción');
        }
    }

    private getPlayIcon(): string {
        if (this.isLoading) {
            return '⏳';
        }
        return this.isPlaying ? '⏸️' : '▶️';
    }

    private updatePlayButton(): void {
        const playIcon = this.shadow.getElementById('playIcon');
        const playButton = this.shadow.getElementById('playButton');
        const mainPlayButton = this.shadow.getElementById('mainPlayButton');
        const buttonText = mainPlayButton?.querySelector('.ButtonText');
        const buttonIcon = mainPlayButton?.querySelector('.ButtonIcon');

        if (playIcon) {
            playIcon.textContent = this.getPlayIcon();
        }

        if (playButton) {
            playButton.title = this.isPlaying ? 'Pausar' : 'Reproducir';
            (playButton as HTMLButtonElement).disabled = this.isLoading;
        }

        if (mainPlayButton) {
            mainPlayButton.title = this.isPlaying ? 'Pausar' : 'Reproducir';
            (mainPlayButton as HTMLButtonElement).disabled = this.isLoading;
            
            if (this.isPlaying) {
                mainPlayButton.classList.add('playing');
            } else {
                mainPlayButton.classList.remove('playing');
            }
        }

        if (buttonText) {
            buttonText.textContent = this.isPlaying ? 'Pausar' : 'Reproducir';
        }

        if (buttonIcon) {
            buttonIcon.textContent = this.getPlayIcon();
        }
    }

    private showError(message: string): void {
        // Crear elemento de error temporal
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(220, 53, 69, 0.9);
            color: white;
            padding: 8px 12px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 500;
            z-index: 1000;
            pointer-events: none;
        `;
        errorDiv.textContent = message;

        // Agregar al shadow root
        this.shadow.appendChild(errorDiv);

        // Remover después de 3 segundos
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.parentNode.removeChild(errorDiv);
            }
        }, 3000);
    }

    private escapeHtml(text: string): string {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

if (!customElements.get('music-player-card')) {
    customElements.define('music-player-card', MusicPlayerCard);
}

export default MusicPlayerCard; 