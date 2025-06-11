import { loadComponentCSS } from '../utils/cssLoader';
import { musicService } from '../services/musicService';
import { MusicTrack } from '../types/Music';

class MusicSearchModal extends HTMLElement {
    private shadow: ShadowRoot;
    private isVisible = false;
    private selectedTrack: MusicTrack | null = null;
    private searchTimeout: number | null = null;
    private onSelectCallback: ((track: MusicTrack) => void) | null = null;

    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'open' });
    }

    connectedCallback(): void {
        this.render();
        this.setupEventListeners();
    }

    render(): void {
        if (!this.shadow) return;

        this.shadow.innerHTML = `
            <style>
            ${loadComponentCSS('musicSearchModal')}
            </style>
            <div class="ModalOverlay" style="display: ${this.isVisible ? 'flex' : 'none'};">
                <div class="ModalContainer">
                    <div class="ModalHeader">
                        <h3>🎵 Buscar música</h3>
                        <button id="closeModal" class="CloseButton">×</button>
                    </div>

                    <div class="SearchSection">
                        <div class="SearchInput">
                            <input 
                                type="text" 
                                id="searchInput" 
                                placeholder="Busca artista, canción o álbum..."
                                autocomplete="off"
                            >
                            <button id="clearSearch" class="ClearButton" style="display: none;">×</button>
                        </div>
                        <div id="searchHint" class="SearchHint">
                            Escribe para buscar → Haz click en cualquier canción para elegirla
                        </div>
                    </div>

                    <div class="ResultsSection">
                        <div id="loadingState" class="LoadingState" style="display: none;">
                            <div class="LoadingSpinner"></div>
                            <p>Buscando canciones...</p>
                        </div>

                        <div id="emptyState" class="EmptyState">
                            <div class="EmptyIcon">🎵</div>
                            <p>Escribe algo para comenzar a buscar</p>
                        </div>

                        <div id="resultsContainer" class="ResultsContainer" style="display: none;">
                            <div id="resultsList" class="ResultsList"></div>
                        </div>

                        <div id="errorState" class="ErrorState" style="display: none;">
                            <div class="ErrorIcon">⚠️</div>
                            <p id="errorMessage">Error al buscar canciones</p>
                            <button id="retrySearch" class="RetryButton">Reintentar</button>
                        </div>
                    </div>

                    <div class="ModalFooter">
                        <button id="cancelBtn" class="CancelButton">Cancelar</button>
                        <button id="selectBtn" class="SelectButton" disabled>Seleccionar</button>
                    </div>
                </div>
            </div>
        `;
    }

    private setupEventListeners(): void {
        console.log('🔧 Configurando event listeners del modal...');
        const closeBtn = this.shadow.getElementById('closeModal');
        const cancelBtn = this.shadow.getElementById('cancelBtn');
        const selectBtn = this.shadow.getElementById('selectBtn');
        const searchInput = this.shadow.getElementById('searchInput') as HTMLInputElement;
        const clearBtn = this.shadow.getElementById('clearSearch');
        const retryBtn = this.shadow.getElementById('retrySearch');
        const overlay = this.shadow.querySelector('.ModalOverlay');
        
        console.log('🔍 Elementos encontrados:', {
            closeBtn: !!closeBtn,
            cancelBtn: !!cancelBtn, 
            selectBtn: !!selectBtn,
            searchInput: !!searchInput,
            clearBtn: !!clearBtn,
            retryBtn: !!retryBtn,
            overlay: !!overlay
        });

        closeBtn?.addEventListener('click', () => this.hideModal());
        cancelBtn?.addEventListener('click', () => this.hideModal());
        
        overlay?.addEventListener('click', (e) => {
            if (e.target === overlay) this.hideModal();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isVisible) {
                this.hideModal();
            }
        });

        if (searchInput) {
            console.log('✅ Agregando event listener al input de búsqueda');
            searchInput.addEventListener('input', (e) => {
                const query = (e.target as HTMLInputElement).value.trim();
                console.log('🔤 Input event triggered, query:', query);
                this.handleSearch(query);
                
                if (clearBtn) {
                    clearBtn.style.display = query ? 'block' : 'none';
                }
            });
        } else {
            console.error('❌ searchInput no encontrado, no se puede agregar event listener');
        }

        clearBtn?.addEventListener('click', () => {
            if (searchInput) {
                searchInput.value = '';
                searchInput.focus();
            }
            if (clearBtn) {
                clearBtn.style.display = 'none';
            }
            this.showEmptyState();
        });

        retryBtn?.addEventListener('click', () => {
            if (searchInput) {
                this.handleSearch(searchInput.value.trim());
            }
        });

        selectBtn?.addEventListener('click', () => {
            console.log('🔘 Click en botón Seleccionar final');
            console.log('🎵 selectedTrack:', this.selectedTrack);
            console.log('📞 onSelectCallback:', this.onSelectCallback);
            
            if (this.selectedTrack && this.onSelectCallback) {
                console.log('✅ Ejecutando callback con track:', this.selectedTrack);
                this.onSelectCallback(this.selectedTrack);
                console.log('🚪 Cerrando modal');
                this.hideModal();
            } else {
                console.error('❌ No se puede seleccionar:', {
                    hasTrack: !!this.selectedTrack,
                    hasCallback: !!this.onSelectCallback
                });
            }
        });
    }

    private handleSearch(query: string): void {
        console.log('🔎 handleSearch called with query:', query);
        
        if (this.searchTimeout) {
            console.log('⏰ Clearing previous timeout');
            clearTimeout(this.searchTimeout);
        }

        if (!query) {
            console.log('📝 Empty query, showing empty state');
            this.showEmptyState();
            return;
        }

        console.log('⏰ Setting timeout for search...');
        this.searchTimeout = window.setTimeout(async () => {
            console.log('🚀 Timeout executed, starting search...');
            await this.performSearch(query);
        }, 500);
    }

    private async performSearch(query: string): Promise<void> {
        try {
            console.log('🔍 Iniciando búsqueda para:', query);
            this.showLoadingState();
            
            // Test API availability first
            const isAvailable = await musicService.isDeezerAvailable();
            console.log('🎵 Deezer API disponible:', isAvailable);
            
            const results = await musicService.searchTracks({ query, limit: 20 });
            console.log('🎵 Resultados obtenidos:', results);
            
            if (results.tracks.length === 0) {
                console.log('⚠️ No se encontraron resultados');
                this.showNoResultsState();
            } else {
                console.log('✅ Mostrando', results.tracks.length, 'resultados');
                this.showResults(results.tracks);
            }

        } catch (error) {
            console.error('❌ Error searching music:', error);
            this.showErrorState(error instanceof Error ? error.message : 'Error desconocido');
        }
    }

    private showLoadingState(): void {
        this.hideAllStates();
        const loadingState = this.shadow.getElementById('loadingState');
        if (loadingState) loadingState.style.display = 'flex';
    }

    private showEmptyState(): void {
        this.hideAllStates();
        const emptyState = this.shadow.getElementById('emptyState');
        if (emptyState) emptyState.style.display = 'flex';
        
        this.selectedTrack = null;
        this.updateSelectButton();
    }

    private showNoResultsState(): void {
        this.hideAllStates();
        const emptyState = this.shadow.getElementById('emptyState');
        if (emptyState) {
            emptyState.style.display = 'flex';
            emptyState.innerHTML = `
                <div class="EmptyIcon">🔍</div>
                <p>No se encontraron canciones</p>
                <p>Intenta con otros términos de búsqueda</p>
            `;
        }
    }

    private showErrorState(message: string): void {
        this.hideAllStates();
        const errorState = this.shadow.getElementById('errorState');
        const errorMessage = this.shadow.getElementById('errorMessage');
        
        if (errorState) errorState.style.display = 'flex';
        if (errorMessage) errorMessage.textContent = message;
    }

    private showResults(tracks: MusicTrack[]): void {
        this.hideAllStates();
        
        const resultsContainer = this.shadow.getElementById('resultsContainer');
        const resultsList = this.shadow.getElementById('resultsList');
        
        if (!resultsContainer || !resultsList) return;
        
        resultsList.innerHTML = tracks.map(track => this.renderTrackItem(track)).join('');
        resultsContainer.style.display = 'block';
        
        this.setupTrackItemListeners();
    }

    private renderTrackItem(track: MusicTrack): string {
        const duration = musicService.formatDuration(track.duration);
        
        return `
            <div class="TrackItem" data-track-id="${track.id}">
                <div class="TrackCover">
                    <img src="${track.coverUrl}" alt="${track.album}" loading="lazy">
                    <div class="PlayOverlay">
                        <span class="PlayIcon">▶</span>
                    </div>
                </div>
                <div class="TrackInfo">
                    <div class="TrackTitle">${this.escapeHtml(track.title)}</div>
                    <div class="TrackArtist">${this.escapeHtml(track.artist)}</div>
                    <div class="TrackAlbum">${this.escapeHtml(track.album)}</div>
                </div>
                <div class="TrackDuration">${duration}</div>
                <div class="TrackActions">
                    <button class="SelectTrackBtn" data-track-id="${track.id}">
                        ✅ Elegir
                    </button>
                </div>
            </div>
        `;
    }

    private setupTrackItemListeners(): void {
        const trackItems = this.shadow.querySelectorAll('.TrackItem');
        const selectButtons = this.shadow.querySelectorAll('.SelectTrackBtn');

        console.log('🎯 Configurando listeners para tracks:', {
            trackItems: trackItems.length,
            selectButtons: selectButtons.length
        });

        trackItems.forEach((item, index) => {
            console.log(`🎵 Configurando listener para track item ${index + 1}`);
            item.addEventListener('click', (e) => {
                console.log('🖱️ Click en track item:', e.target);
                if ((e.target as Element).closest('.SelectTrackBtn')) {
                    console.log('🚫 Click interceptado por botón, ignorando...');
                    return;
                }
                
                const trackId = (item as HTMLElement).dataset.trackId;
                console.log('🎵 Track ID encontrado:', trackId);
                if (trackId) {
                    this.selectTrack(trackId);
                    
                    // Auto-confirmar la selección después de un breve delay
                    setTimeout(() => {
                        console.log('🚀 Auto-confirmando selección desde track item...');
                        if (this.selectedTrack && this.onSelectCallback) {
                            console.log('✅ Ejecutando callback automático con track:', this.selectedTrack);
                            this.onSelectCallback(this.selectedTrack);
                            console.log('🚪 Cerrando modal automáticamente');
                            this.hideModal();
                        }
                    }, 300); // 300ms delay para que el usuario vea la selección
                }
            });
        });

        selectButtons.forEach((btn, index) => {
            console.log(`🔘 Configurando listener para botón ${index + 1}`);
            btn.addEventListener('click', (e) => {
                console.log('🖱️ Click en botón seleccionar:', e.target);
                e.stopPropagation();
                const trackId = (btn as HTMLElement).dataset.trackId;
                console.log('🎵 Track ID del botón:', trackId);
                if (trackId) {
                    this.selectTrack(trackId);
                    
                    // Auto-confirmar la selección después de un breve delay
                    setTimeout(() => {
                        console.log('🚀 Auto-confirmando selección...');
                        if (this.selectedTrack && this.onSelectCallback) {
                            console.log('✅ Ejecutando callback automático con track:', this.selectedTrack);
                            this.onSelectCallback(this.selectedTrack);
                            console.log('🚪 Cerrando modal automáticamente');
                            this.hideModal();
                        }
                    }, 300); // 300ms delay para que el usuario vea la selección
                }
            });
        });
    }

    private selectTrack(trackId: string): void {
        console.log('🎯 selectTrack llamado con ID:', trackId);
        
        const resultsList = this.shadow.getElementById('resultsList');
        if (!resultsList) {
            console.error('❌ resultsList no encontrado');
            return;
        }

        const trackElement = this.shadow.querySelector(`[data-track-id="${trackId}"]`);
        console.log('🔍 Track element encontrado:', trackElement);
        if (!trackElement) {
            console.error('❌ Track element no encontrado para ID:', trackId);
            return;
        }

        // Remover selección anterior
        const previousSelected = this.shadow.querySelectorAll('.TrackItem.selected');
        console.log('🗑️ Removiendo selección anterior de', previousSelected.length, 'elementos');
        previousSelected.forEach(item => {
            item.classList.remove('selected');
        });

        // Agregar nueva selección
        trackElement.classList.add('selected');
        console.log('✅ Clase "selected" agregada al elemento');

        // Extraer información del track
        const title = trackElement.querySelector('.TrackTitle')?.textContent || '';
        const artist = trackElement.querySelector('.TrackArtist')?.textContent || '';
        const album = trackElement.querySelector('.TrackAlbum')?.textContent || '';
        const coverImg = trackElement.querySelector('.TrackCover img') as HTMLImageElement;
        const coverUrl = coverImg?.src || '';

        console.log('📝 Información extraída:', { title, artist, album, coverUrl });

        this.selectedTrack = {
            id: trackId,
            title,
            artist,
            album,
            coverUrl,
            duration: 30,
            previewUrl: '',
        };

        console.log('🎵 selectedTrack asignado:', this.selectedTrack);
        this.updateSelectButton();
    }

    private updateSelectButton(): void {
        console.log('🔄 updateSelectButton llamado');
        const selectBtn = this.shadow.getElementById('selectBtn') as HTMLButtonElement;
        console.log('🔘 Select button encontrado:', selectBtn);
        
        if (selectBtn) {
            const wasDisabled = selectBtn.disabled;
            selectBtn.disabled = !this.selectedTrack;
            selectBtn.textContent = this.selectedTrack ? 
                `✅ Confirmar "${this.selectedTrack.title}"` : 
                'Seleccionar una canción';
            
            console.log('🔘 Button state updated:', {
                disabled: selectBtn.disabled,
                wasDisabled,
                text: selectBtn.textContent,
                hasSelectedTrack: !!this.selectedTrack
            });
        } else {
            console.error('❌ Select button no encontrado');
        }
    }

    private hideAllStates(): void {
        const states = ['loadingState', 'emptyState', 'resultsContainer', 'errorState'];
        states.forEach(stateId => {
            const element = this.shadow.getElementById(stateId);
            if (element) element.style.display = 'none';
        });
    }

    private escapeHtml(text: string): string {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    public showModal(onSelect: (track: MusicTrack) => void): void {
        console.log('🎵 showModal called');
        this.onSelectCallback = onSelect;
        this.isVisible = true;
        this.selectedTrack = null;
        console.log('🎵 Estado del modal: isVisible =', this.isVisible);
        this.render();
        
        // Re-configurar event listeners después del render
        this.setupEventListeners();

        setTimeout(() => {
            const searchInput = this.shadow.getElementById('searchInput') as HTMLInputElement;
            console.log('🎵 Input de búsqueda:', searchInput);
            if (searchInput) {
                searchInput.focus();
                console.log('✅ Focus puesto en el input');
            }
        }, 100);
    }

    public hideModal(): void {
        this.isVisible = false;
        this.selectedTrack = null;
        this.onSelectCallback = null;
        
        const searchInput = this.shadow.getElementById('searchInput') as HTMLInputElement;
        if (searchInput) {
            searchInput.value = '';
        }
        
        this.render();
    }

    public isModalVisible(): boolean {
        return this.isVisible;
    }

    // Método de testing - remover en producción
    public async testSearch(query: string = 'eminem'): Promise<void> {
        console.log('🧪 Testing search with query:', query);
        this.isVisible = true;
        this.render();
        await this.performSearch(query);
    }
}

if (!customElements.get('music-search-modal')) {
    customElements.define('music-search-modal', MusicSearchModal);
}

// Función de testing global - remover en producción
(window as any).testMusicSearch = async (query: string = 'eminem') => {
    console.log('🧪 Testing music search globally...');
    const modals = document.querySelectorAll('music-search-modal');
    console.log('🔍 Found modals:', modals.length);
    
    if (modals.length > 0) {
        const modal = modals[0] as MusicSearchModal;
        await modal.testSearch(query);
    } else {
        console.error('❌ No music modals found');
        
        // Try direct API test
        console.log('🧪 Testing API directly...');
        const { musicService } = await import('../services/musicService');
        try {
            const results = await musicService.searchTracks({ query });
            console.log('✅ Direct API test results:', results);
        } catch (error) {
            console.error('❌ Direct API test failed:', error);
        }
    }
};

export default MusicSearchModal; 