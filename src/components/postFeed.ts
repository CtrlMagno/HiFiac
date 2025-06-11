import '../styles/components/postFeed.css';
import { loadComponentCSS, getAvatarUrl } from '../utils/cssLoader';
import { authStore, PostActions, postStore } from '../flux';
import { Post } from '../types/Post';
import CommentModal from './commentModal';
import MusicPlayerCard from './musicPlayerCard';

class PostFeed extends HTMLElement {
    private shadow: ShadowRoot;
    private posts: Post[] = [];
    private isLoading = false;
    private processingLikes: Set<string> = new Set(); // Para prevenir múltiples likes

    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'open' });
    }

    connectedCallback(): void {
        this.setupStoreListeners();
        this.loadPosts();
        this.render();
    }

    disconnectedCallback(): void {
        // Limpiar listeners cuando el componente se desconecta
        postStore.removeChangeListener(this.handlePostStoreChange);
    }

    private setupStoreListeners(): void {
        // Escuchar cambios en el PostStore
        postStore.addChangeListener(this.handlePostStoreChange.bind(this));
    }

    private handlePostStoreChange(): void {
        this.posts = postStore.getAllPosts();
        this.isLoading = postStore.isLoading();
        this.render();
    }

    private async loadPosts(): Promise<void> {
        try {
            this.isLoading = true;
            this.render();
            await PostActions.loadPosts(10); // Cargar primeros 10 posts
        } catch (error) {
            console.error('Error loading posts:', error);
        }
    }

    render(): void {
        if (!this.shadow) return;

        this.shadow.innerHTML = `
            <style>
            ${loadComponentCSS('postFeed')}
            
            /* FORZAR TAMAÑO DE AVATARES - MÁXIMA PRIORIDAD */
            .UserAvatar, img.UserAvatar, img[class="UserAvatar"] {
                width: 36px !important;
                height: 36px !important;
                min-width: 36px !important;
                min-height: 36px !important;
                max-width: 36px !important;
                max-height: 36px !important;
                border-radius: 50% !important;
                object-fit: cover !important;
                margin-right: 12px !important;
                border: 2px solid #e1e5e9 !important;
                flex-shrink: 0 !important;
                display: block !important;
            }
            
            .CommentAvatar, img.CommentAvatar, img[class="CommentAvatar"] {
                width: 32px !important;
                height: 32px !important;
                min-width: 32px !important;
                min-height: 32px !important;
                max-width: 32px !important;
                max-height: 32px !important;
                border-radius: 50% !important;
                object-fit: cover !important;
                border: 1px solid #e1e5e9 !important;
                flex-shrink: 0 !important;
                display: block !important;
            }
            
            /* Sobrescribir cualquier regla global de img */
            img[src*="user en circulo"] {
                width: 36px !important;
                height: 36px !important;
            }
            </style>
            <div class="FeedContainer">
                ${this.isLoading ? this.renderLoadingState() : ''}
                ${this.posts.length === 0 && !this.isLoading ? this.renderEmptyState() : ''}
                ${this.posts.map(post => this.renderPost(post)).join('')}
            </div>
        `;

        this.setupPostEventListeners();
        this.forceAvatarStyles();
        this.setupMusicPlayers();
    }

    private forceAvatarStyles(): void {
        // Forzar estilos via JavaScript como último recurso
        setTimeout(() => {
            const avatars = this.shadow.querySelectorAll('.UserAvatar');
            avatars.forEach((avatar: Element) => {
                if (avatar instanceof HTMLImageElement) {
                    avatar.style.width = '36px';
                    avatar.style.height = '36px';
                    avatar.style.minWidth = '36px';
                    avatar.style.minHeight = '36px';
                    avatar.style.maxWidth = '36px';
                    avatar.style.maxHeight = '36px';
                    avatar.style.borderRadius = '50%';
                    avatar.style.objectFit = 'cover';
                    avatar.style.marginRight = '12px';
                    avatar.style.border = '2px solid #e1e5e9';
                    avatar.style.flexShrink = '0';
                    avatar.style.display = 'block';
                }
            });

            const commentAvatars = this.shadow.querySelectorAll('.CommentAvatar');
            commentAvatars.forEach((avatar: Element) => {
                if (avatar instanceof HTMLImageElement) {
                    avatar.style.width = '32px';
                    avatar.style.height = '32px';
                    avatar.style.minWidth = '32px';
                    avatar.style.minHeight = '32px';
                    avatar.style.maxWidth = '32px';
                    avatar.style.maxHeight = '32px';
                    avatar.style.borderRadius = '50%';
                    avatar.style.objectFit = 'cover';
                    avatar.style.border = '1px solid #e1e5e9';
                    avatar.style.flexShrink = '0';
                    avatar.style.display = 'block';
                }
            });
        }, 10);
    }

    private setupMusicPlayers(): void {
        // Configurar los reproductores de música en los posts
        const musicCards = this.shadow.querySelectorAll('music-player-card');
        musicCards.forEach((card, index) => {
            const trackId = card.getAttribute('data-track-id');
            if (trackId) {
                // Encontrar el post que contiene esta música
                const post = this.posts.find(p => p.musicTrack?.id === trackId);
                if (post && post.musicTrack) {
                    // Configurar el componente de música
                    (card as MusicPlayerCard).setTrack(post.musicTrack);
                    
                    // Agregar clase de variante para diferentes colores
                    const musicContainer = card.parentElement;
                    if (musicContainer) {
                        const variantClass = `variant-${(index % 5) + 1}`;
                        card.classList.add(variantClass);
                    }
                }
            }
        });
    }

    private renderLoadingState(): string {
        return `
            <div class="LoadingState">
                <div class="LoadingSpinner"></div>
                <p>Cargando posts...</p>
            </div>
        `;
    }

    private renderEmptyState(): string {
        return `
            <div class="EmptyState">
                <div class="EmptyIcon">📝</div>
                <h3>¡No hay posts aún!</h3>
                <p>Sé el primero en compartir algo usando el formulario de arriba.</p>
            </div>
        `;
    }

    private renderPost(post: Post): string {
        const timeAgo = this.formatTimeAgo(post.createdAt);
        const currentUser = authStore.getCurrentUser();
        const isLiked = post.likedBy?.includes(currentUser?.id || '') || false;
        
        return `
            <div class="PostCard" data-post-id="${post.id}">
                <div class="PostHeader">
                    <img src="${getAvatarUrl(post.user?.avatar)}" 
                         alt="${post.user?.username || 'Usuario'}" 
                         class="UserAvatar"
                         style="width: 36px !important; height: 36px !important; min-width: 36px !important; min-height: 36px !important; max-width: 36px !important; max-height: 36px !important; border-radius: 50% !important; object-fit: cover !important; margin-right: 12px !important; border: 2px solid #e1e5e9 !important; flex-shrink: 0 !important; display: block !important;">
                    <div class="UserInfo">
                        <p class="Username">${post.user?.username || post.user?.fullName || 'Usuario'}</p>
                        <p class="PostTime">${timeAgo}</p>
                    </div>
                </div>

                <div class="PostContent">
                    <p class="PostText">${this.escapeHtml(post.content)}</p>
                    ${post.imageUrl ? `
                        <div class="PostImage">
                            <img src="${post.imageUrl}" alt="Imagen del post" class="PostImg">
                        </div>
                    ` : ''}
                    ${post.musicTrack ? `
                        <div class="PostMusic" data-post-id="${post.id}">
                            <music-player-card data-track-id="${post.musicTrack.id}"></music-player-card>
                        </div>
                    ` : ''}
                </div>

                <div class="PostFooter">
                    <div class="PostActions">
                        <button class="ActionBtn LikeBtn ${isLiked ? 'liked' : ''}" 
                                data-action="like" 
                                data-post-id="${post.id}">
                            <span class="ActionIcon">${isLiked ? '❤️' : '🤍'}</span>
                            <span class="ActionCount">${post.likesCount || 0}</span>
                        </button>
                        
                        <button class="ActionBtn CommentBtn" 
                                data-action="comment" 
                                data-post-id="${post.id}">
                            <span class="ActionIcon">💬</span>
                            <span class="ActionCount">${post.commentsCount || 0}</span>
                        </button>
                    </div>
                </div>

                ${post.comments && post.comments.length > 0 ? `
                    <div class="CommentsSection">
                        ${post.comments.slice(0, 3).map(comment => `
                            <div class="Comment">
                                <img src="${getAvatarUrl(comment.user?.avatar)}" 
                                     alt="${comment.user?.username || 'Usuario'}" 
                                     class="CommentAvatar"
                                     style="width: 32px !important; height: 32px !important; min-width: 32px !important; min-height: 32px !important; max-width: 32px !important; max-height: 32px !important; border-radius: 50% !important; object-fit: cover !important; border: 1px solid #e1e5e9 !important; flex-shrink: 0 !important; display: block !important;">
                                <div class="CommentContent">
                                    <span class="CommentUsername">${comment.user?.username || 'Usuario'}</span>
                                    <span class="CommentText">${this.escapeHtml(comment.content)}</span>
                                </div>
                            </div>
                        `).join('')}
                        ${post.comments.length > 3 ? `
                            <button class="ShowMoreComments" data-post-id="${post.id}">
                                Ver ${post.comments.length - 3} comentarios más...
                            </button>
                        ` : ''}
                    </div>
                ` : ''}
            </div>
        `;
    }

    private setupPostEventListeners(): void {
        // Likes
        const likeButtons = this.shadow.querySelectorAll('.LikeBtn');
        likeButtons.forEach(btn => {
            btn.addEventListener('click', this.handleLike.bind(this));
        });

        // Comments (básico por ahora)
        const commentButtons = this.shadow.querySelectorAll('.CommentBtn');
        commentButtons.forEach(btn => {
            btn.addEventListener('click', this.handleComment.bind(this));
        });

        // Show more comments
        const showMoreButtons = this.shadow.querySelectorAll('.ShowMoreComments');
        showMoreButtons.forEach(btn => {
            btn.addEventListener('click', this.handleComment.bind(this));
        });
    }

    private async handleLike(event: Event): Promise<void> {
        const button = event.currentTarget as HTMLButtonElement;
        const postId = button.dataset.postId;
        const currentUser = authStore.getCurrentUser();

        if (!currentUser || !postId) return;

        // Prevenir múltiples clics en el mismo post
        if (this.processingLikes.has(postId)) {
            console.log('Ya se está procesando una acción de like para este post');
            return;
        }

        // Marcar como procesando
        this.processingLikes.add(postId);
        
        // Deshabilitar el botón visualmente
        button.style.opacity = '0.5';
        button.style.pointerEvents = 'none';

        try {
            const post = this.posts.find(p => p.id === postId);
            const isLiked = post?.likedBy?.includes(currentUser.id) || false;

            console.log(`Post ${postId}: Usuario ${isLiked ? 'ya tiene' : 'no tiene'} like`);
            console.log(`Post.likedBy:`, post?.likedBy);
            console.log(`CurrentUser.id:`, currentUser.id);
            console.log(`Post.isLiked:`, post?.isLiked);

            if (isLiked) {
                console.log('Quitando like...');
                await PostActions.unlikePost(postId, currentUser.id);
            } else {
                console.log('Agregando like...');
                await PostActions.likePost(postId, currentUser.id);
            }
            
        } catch (error) {
            console.error('Error handling like:', error);
        } finally {
            // Limpiar el estado de procesamiento
            this.processingLikes.delete(postId);
            
            // Restaurar el botón
            button.style.opacity = '1';
            button.style.pointerEvents = 'auto';
        }
    }

    private handleComment(event: Event): void {
        const button = event.currentTarget as HTMLButtonElement;
        const postId = button.dataset.postId;
        
        if (!postId) return;

        // Encontrar el post para pasárselo al modal
        const post = this.posts.find(p => p.id === postId);
        if (!post) {
            console.error('Post no encontrado:', postId);
            return;
        }

        // Obtener referencia al modal desde el documento
        const modal = document.querySelector('comment-modal') as CommentModal;
        if (!modal) {
            console.error('Modal de comentarios no encontrado');
            alert('Error: Modal de comentarios no disponible');
            return;
        }

        // Mostrar el modal con el post
        modal.showModal(post);
    }

    private async addComment(postId: string, content: string): Promise<void> {
        const currentUser = authStore.getCurrentUser();
        if (!currentUser) return;

        try {
            await PostActions.addComment(postId, { postId, content }, currentUser.id);
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    }

    private formatTimeAgo(dateString: string): string {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMinutes = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffMinutes < 1) return 'Ahora';
        if (diffMinutes < 60) return `${diffMinutes}m`;
        if (diffHours < 24) return `${diffHours}h`;
        if (diffDays < 7) return `${diffDays}d`;
        
        return date.toLocaleDateString('es-ES', { 
            day: 'numeric', 
            month: 'short' 
        });
    }

    private escapeHtml(text: string): string {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

if (!customElements.get('post-feed')) {
    customElements.define('post-feed', PostFeed);
}

export default PostFeed; 