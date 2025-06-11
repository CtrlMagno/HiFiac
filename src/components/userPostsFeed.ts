import '../styles/components/postFeed.css';
import { loadComponentCSS, getAvatarUrl } from '../utils/cssLoader';
import { authStore, PostActions, postStore } from '../flux';
import { Post } from '../types/Post';
import CommentModal from './commentModal';

class UserPostsFeed extends HTMLElement {
    private shadow: ShadowRoot;
    private userPosts: Post[] = [];
    private isLoading = false;
    private processingLikes: Set<string> = new Set();

    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'open' });
    }

    connectedCallback(): void {
        this.setupStoreListeners();
        this.loadUserPosts();
        this.render();
    }

    disconnectedCallback(): void {
        postStore.removeChangeListener(this.handlePostStoreChange);
        authStore.removeChangeListener(this.handleAuthStoreChange);
    }

    private setupStoreListeners(): void {
        postStore.addChangeListener(this.handlePostStoreChange.bind(this));
        authStore.addChangeListener(this.handleAuthStoreChange.bind(this));
    }

    private handlePostStoreChange(): void {
        this.updateUserPosts();
        this.isLoading = postStore.isLoading();
        this.render();
    }

    private handleAuthStoreChange(): void {
        this.updateUserPosts();
        this.render();
    }

    private updateUserPosts(): void {
        const currentUser = authStore.getCurrentUser();
        if (currentUser) {
            this.userPosts = postStore.getUserPosts(currentUser.id);
        } else {
            this.userPosts = [];
        }
    }

    private async loadUserPosts(): Promise<void> {
        try {
            this.isLoading = true;
            this.render();
            
            // Cargar todos los posts y luego filtrar por usuario
            await PostActions.loadPosts(50); // Cargar más posts para que el usuario vea todos los suyos
        } catch (error) {
            console.error('Error loading user posts:', error);
        }
    }

    render(): void {
        if (!this.shadow) return;

        const currentUser = authStore.getCurrentUser();
        
        if (!currentUser) {
            this.shadow.innerHTML = `
                <style>
                ${loadComponentCSS('postFeed')}
                ${loadComponentCSS('userPostsFeed')}
                </style>
                <div class="FeedContainer">
                    <div class="LoadingState">
                        <p>Usuario no autenticado</p>
                    </div>
                </div>
            `;
            return;
        }

        this.shadow.innerHTML = `
            <style>
            ${loadComponentCSS('postFeed')}
            ${loadComponentCSS('userPostsFeed')}
            </style>
            <div class="FeedContainer">
                <div class="UserPostsHeader">
                    <h2>Mis Posts (${this.userPosts.length})</h2>
                </div>
                
                ${this.isLoading ? this.renderLoadingState() : ''}
                ${this.userPosts.length === 0 && !this.isLoading ? this.renderEmptyState() : ''}
                ${this.userPosts.map(post => this.renderPost(post)).join('')}
            </div>
        `;

        this.setupPostEventListeners();
    }

    private renderLoadingState(): string {
        return `
            <div class="LoadingState">
                <div class="LoadingSpinner"></div>
                <p>Cargando tus posts...</p>
            </div>
        `;
    }

    private renderEmptyState(): string {
        return `
            <div class="EmptyState">
                <div class="EmptyIcon">📝</div>
                <h3>¡Aún no has creado posts!</h3>
                <p>Ve al inicio y comparte tu primera publicación.</p>
                <a href="home.html" class="CreateFirstPostButton">Crear mi primer post</a>
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

        // Comments
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

        if (this.processingLikes.has(postId)) {
            return;
        }

        this.processingLikes.add(postId);
        button.style.opacity = '0.5';
        button.style.pointerEvents = 'none';

        try {
            const post = this.userPosts.find(p => p.id === postId);
            const isLiked = post?.likedBy?.includes(currentUser.id) || false;

            if (isLiked) {
                await PostActions.unlikePost(postId, currentUser.id);
            } else {
                await PostActions.likePost(postId, currentUser.id);
            }
        } catch (error) {
            console.error('Error handling like:', error);
        } finally {
            this.processingLikes.delete(postId);
            button.style.opacity = '1';
            button.style.pointerEvents = 'auto';
        }
    }

    private handleComment(event: Event): void {
        const button = event.currentTarget as HTMLButtonElement;
        const postId = button.dataset.postId;
        
        if (!postId) return;

        const post = this.userPosts.find(p => p.id === postId);
        if (!post) {
            console.error('Post no encontrado:', postId);
            return;
        }

        const modal = document.querySelector('comment-modal') as CommentModal;
        if (!modal) {
            console.error('Modal de comentarios no encontrado');
            alert('Error: Modal de comentarios no disponible');
            return;
        }

        modal.showModal(post);
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

if (!customElements.get('user-posts-feed')) {
    customElements.define('user-posts-feed', UserPostsFeed);
}

export default UserPostsFeed; 