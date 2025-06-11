import '../styles/components/postCreator.css';
import { loadComponentCSS, getAvatarUrl } from '../utils/cssLoader';
import { authStore, PostActions } from '../flux';
import { postService } from '../services/postService';
import { MusicTrack } from '../types/Music';
import MusicSearchModal from './musicSearchModal';

class PostCreator extends HTMLElement {
    private shadow: ShadowRoot;
    private selectedFile: File | null = null;
    private selectedTrack: MusicTrack | null = null;

    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'open' });
    }

    connectedCallback(): void {
        this.render();
        this.setupEventListeners();
        this.setupAuthStoreListener();
    }

    disconnectedCallback(): void {
        // Limpiar listener cuando el componente se desconecta
        authStore.removeChangeListener(this.handleAuthChange);
    }

    private setupAuthStoreListener(): void {
        // Escuchar cambios en el AuthStore para actualizar la información del usuario
        authStore.addChangeListener(this.handleAuthChange.bind(this));
    }

    private handleAuthChange(): void {
        this.render();
        this.setupEventListeners(); // Re-setup event listeners after re-render
    }

    render(): void {
        if (!this.shadow) return;

        const currentUser = authStore.getCurrentUser();
        const userAvatar = getAvatarUrl(currentUser?.avatar);
        const userName = currentUser?.username || currentUser?.fullName || currentUser?.email || 'Usuario';

        this.shadow.innerHTML = `
            <style>
            ${loadComponentCSS('postCreator')}
            </style>
            <div class="GlobalContainer">
                <div class="PostCreatorCard">
                    <div class="CardHeader">
                        <img src="${userAvatar}" alt="Tu perfil" class="UserProfile">
                        <div class="UserInfo">
                            <p class="UserName">${userName}</p>
                            <p class="PostType">Crear nuevo post</p>
                        </div>
                    </div>

                    <div class="PostContent">
                        <textarea 
                            id="postText" 
                            class="TextArea" 
                            placeholder="¿Qué música estás escuchando hoy?"
                            maxlength="500"
                        ></textarea>
                        
                        <div class="CharacterCount">
                            <span id="charCount">0</span>/500
                        </div>

                        <div id="imagePreview" class="ImagePreview" style="display: none;">
                            <img id="previewImg" src="" alt="Vista previa">
                            <button id="removeImage" class="RemoveImageBtn">×</button>
                        </div>

                        <div id="musicPreview" class="MusicPreview" style="display: none;">
                            <div class="MusicInfo">
                                <img id="musicCover" src="" alt="Portada del álbum" class="MusicCover">
                                <div class="MusicDetails">
                                    <div id="musicTitle" class="MusicTitle"></div>
                                    <div id="musicArtist" class="MusicArtist"></div>
                                    <div id="musicAlbum" class="MusicAlbum"></div>
                                </div>
                            </div>
                            <button id="removeMusic" class="RemoveMusicBtn">×</button>
                        </div>

                        <div id="errorMessage" class="ErrorMessage" style="display: none;"></div>
                        <div id="successMessage" class="SuccessMessage" style="display: none;"></div>
                    </div>

                    <div class="CardFooter">
                        <div class="LeftActions">
                            <input type="file" id="imageInput" accept="image/*" style="display: none;">
                            <button id="imageBtn" class="ActionButton" title="Agregar imagen">
                                <span class="ImageIcon">📷</span>
                            </button>
                            <button id="musicBtn" class="ActionButton" title="Agregar música">
                                <span class="MusicIcon">🎵</span>
                            </button>
                        </div>

                        <div class="RightActions">
                            <button id="cancelBtn" class="CancelButton">Cancelar</button>
                            <button id="publishBtn" class="PublishButton">
                                <span class="ButtonText">Publicar</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Modal de búsqueda de música -->
            <music-search-modal id="musicModal"></music-search-modal>
        `;
    }

    private setupEventListeners(): void {
        const postText = this.shadow.getElementById('postText') as HTMLTextAreaElement;
        const charCount = this.shadow.getElementById('charCount') as HTMLSpanElement;
        const imageBtn = this.shadow.getElementById('imageBtn') as HTMLButtonElement;
        const imageInput = this.shadow.getElementById('imageInput') as HTMLInputElement;
        const removeImageBtn = this.shadow.getElementById('removeImage') as HTMLButtonElement;
        const musicBtn = this.shadow.getElementById('musicBtn') as HTMLButtonElement;
        const removeMusicBtn = this.shadow.getElementById('removeMusic') as HTMLButtonElement;
        const cancelBtn = this.shadow.getElementById('cancelBtn') as HTMLButtonElement;
        const publishBtn = this.shadow.getElementById('publishBtn') as HTMLButtonElement;

        // Contador de caracteres
        postText?.addEventListener('input', () => {
            const count = postText.value.length;
            charCount.textContent = count.toString();
        });

        // Botón de imagen
        imageBtn?.addEventListener('click', () => {
            imageInput?.click();
        });

        // Selección de imagen
        imageInput?.addEventListener('change', (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) {
                this.handleImageSelect(file);
            }
        });

        // Eliminar imagen
        removeImageBtn?.addEventListener('click', () => {
            this.removeImage();
        });

        // Botón de música
        musicBtn?.addEventListener('click', () => {
            this.showMusicModal();
        });

        // Eliminar música
        removeMusicBtn?.addEventListener('click', () => {
            this.removeMusic();
        });

        // Cancelar
        cancelBtn?.addEventListener('click', () => {
            this.resetForm();
        });

        // Publicar
        publishBtn?.addEventListener('click', () => {
            this.handlePublish();
        });
    }

    private handleImageSelect(file: File): void {
        if (!file.type.startsWith('image/')) {
            this.showMessage('Solo se permiten imágenes', 'error');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            this.showMessage('La imagen debe ser menor a 5MB', 'error');
            return;
        }

        this.selectedFile = file;

        const reader = new FileReader();
        reader.onload = (e) => {
            const url = e.target?.result as string;
            this.showImagePreview(url);
        };
        reader.readAsDataURL(file);
    }

    private showImagePreview(url: string): void {
        const preview = this.shadow.getElementById('imagePreview') as HTMLDivElement;
        const img = this.shadow.getElementById('previewImg') as HTMLImageElement;
        
        img.src = url;
        preview.style.display = 'block';
    }

    private removeImage(): void {
        this.selectedFile = null;
        const preview = this.shadow.getElementById('imagePreview') as HTMLDivElement;
        preview.style.display = 'none';
        
        const imageInput = this.shadow.getElementById('imageInput') as HTMLInputElement;
        imageInput.value = '';
    }

    private showMusicModal(): void {
        console.log('🎵 Intentando abrir modal de música...');
        const modal = this.shadow.getElementById('musicModal') as MusicSearchModal;
        console.log('🎯 Modal encontrado:', modal);
        
        if (modal) {
            console.log('✅ Abriendo modal de música');
            modal.showModal(this.handleMusicSelect.bind(this));
        } else {
            console.error('❌ Modal de música no encontrado');
        }
    }

    private handleMusicSelect(track: MusicTrack): void {
        console.log('🎵 handleMusicSelect called with track:', track);
        this.selectedTrack = track;
        console.log('✅ selectedTrack asignado en PostCreator');
        this.showMusicPreview(track);
        this.showMessage('🎵 Música agregada al post', 'success');
        console.log('✅ Preview y mensaje mostrados');
    }

    private showMusicPreview(track: MusicTrack): void {
        console.log('🖼️ showMusicPreview called with track:', track);
        
        const preview = this.shadow.getElementById('musicPreview') as HTMLDivElement;
        const cover = this.shadow.getElementById('musicCover') as HTMLImageElement;
        const title = this.shadow.getElementById('musicTitle') as HTMLDivElement;
        const artist = this.shadow.getElementById('musicArtist') as HTMLDivElement;
        const album = this.shadow.getElementById('musicAlbum') as HTMLDivElement;

        console.log('🔍 Elementos encontrados:', {
            preview: !!preview,
            cover: !!cover,
            title: !!title,
            artist: !!artist,
            album: !!album
        });

        if (preview && cover && title && artist && album) {
            cover.src = track.coverUrl;
            title.textContent = track.title;
            artist.textContent = track.artist;
            album.textContent = track.album;
            preview.style.display = 'block';
            console.log('✅ Preview de música mostrado correctamente');
        } else {
            console.error('❌ No se encontraron todos los elementos del preview');
        }
    }

    private removeMusic(): void {
        this.selectedTrack = null;
        const preview = this.shadow.getElementById('musicPreview') as HTMLDivElement;
        if (preview) {
            preview.style.display = 'none';
        }
    }

    private async handlePublish(): Promise<void> {
        const postText = this.shadow.getElementById('postText') as HTMLTextAreaElement;
        const content = postText.value.trim();

        if (!content) {
            this.showMessage('Escribe algo antes de publicar', 'error');
            return;
        }

        const currentUser = authStore.getCurrentUser();
        if (!currentUser) {
            this.showMessage('Debes estar logueado', 'error');
            return;
        }

        try {
            this.setLoadingState(true);

            let imageUrl = '';
            if (this.selectedFile) {
                imageUrl = await postService.uploadPostImage(this.selectedFile, currentUser.id);
            }

            const postData = { 
                content, 
                imageUrl,
                musicTrack: this.selectedTrack || undefined
            };
            await PostActions.createPost(postData, currentUser.id);

            this.showMessage('¡Post publicado!', 'success');
            setTimeout(() => this.resetForm(), 2000);

        } catch (error: any) {
            this.showMessage(error.message || 'Error al publicar', 'error');
        } finally {
            this.setLoadingState(false);
        }
    }

    private setLoadingState(loading: boolean): void {
        const publishBtn = this.shadow.getElementById('publishBtn') as HTMLButtonElement;
        publishBtn.disabled = loading;
        publishBtn.textContent = loading ? 'Publicando...' : 'Publicar';
    }

    private showMessage(message: string, type: 'success' | 'error'): void {
        const errorMsg = this.shadow.getElementById('errorMessage') as HTMLDivElement;
        const successMsg = this.shadow.getElementById('successMessage') as HTMLDivElement;
        
        errorMsg.style.display = 'none';
        successMsg.style.display = 'none';
        
        const targetMsg = type === 'success' ? successMsg : errorMsg;
        targetMsg.textContent = message;
        targetMsg.style.display = 'block';

        setTimeout(() => {
            targetMsg.style.display = 'none';
        }, 5000);
    }

    private resetForm(): void {
        const postText = this.shadow.getElementById('postText') as HTMLTextAreaElement;
        const charCount = this.shadow.getElementById('charCount') as HTMLSpanElement;
        
        postText.value = '';
        charCount.textContent = '0';
        this.removeImage();
        this.removeMusic();
        this.setLoadingState(false);
    }
}

if (!customElements.get('post-creator')) {
    customElements.define('post-creator', PostCreator);
}

export default PostCreator; 