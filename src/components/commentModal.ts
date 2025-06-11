import '../styles/components/commentModal.css';
import { loadComponentCSS, getAvatarUrl } from '../utils/cssLoader';
import { authStore, PostActions, postStore } from '../flux';
import { Post, Comment } from '../types/Post';

interface CommentModalData {
    post: Post;
    isVisible: boolean;
}

class CommentModal extends HTMLElement {
    private shadow: ShadowRoot;
    private modalData: CommentModalData | null = null;
    private isSubmitting = false;

    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'open' });
    }

    connectedCallback(): void {
        this.render();
        this.setupEventListeners();
        this.setupStoreListeners();
    }

    disconnectedCallback(): void {
        // Limpiar listeners cuando el componente se desconecta
        postStore.removeChangeListener(this.handlePostStoreChange);
    }

    private setupStoreListeners(): void {
        // Escuchar cambios en el PostStore para actualizar comentarios
        postStore.addChangeListener(this.handlePostStoreChange.bind(this));
    }

    private handlePostStoreChange(): void {
        // Si el modal está visible, actualizar el post con los nuevos datos
        if (this.modalData?.isVisible && this.modalData.post) {
            const updatedPost = postStore.getAllPosts().find(p => p.id === this.modalData!.post.id);
            if (updatedPost) {
                this.modalData.post = updatedPost;
                this.render();
            }
        }
    }

    // Método público para mostrar el modal
    public showModal(post: Post): void {
        this.modalData = {
            post,
            isVisible: true
        };
        this.render();
        document.body.style.overflow = 'hidden'; // Prevenir scroll del body
    }

    // Método público para ocultar el modal
    public hideModal(): void {
        if (this.modalData) {
            this.modalData.isVisible = false;
        }
        this.render();
        document.body.style.overflow = 'auto'; // Restaurar scroll del body
    }

    private setupEventListeners(): void {
        // Cerrar modal al hacer click en el overlay
        this.shadow.addEventListener('click', (e) => {
            const target = e.target as HTMLElement;
            if (target.classList.contains('ModalOverlay')) {
                this.hideModal();
            }
        });

        // Cerrar modal con Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modalData?.isVisible) {
                this.hideModal();
            }
        });
    }

    private async handleSubmitComment(event: Event): Promise<void> {
        event.preventDefault();
        
        if (this.isSubmitting || !this.modalData) return;

        const form = event.target as HTMLFormElement;
        const textarea = form.querySelector('.CommentInput') as HTMLTextAreaElement;
        const content = textarea.value.trim();

        if (!content || content.length === 0) {
            this.showError('El comentario no puede estar vacío');
            return;
        }

        if (content.length > 500) {
            this.showError('El comentario no puede tener más de 500 caracteres');
            return;
        }

        const currentUser = authStore.getCurrentUser();
        if (!currentUser) {
            this.showError('Debes estar logueado para comentar');
            return;
        }

        this.isSubmitting = true;
        this.updateSubmitButton(true);

        try {
            await PostActions.addComment(
                this.modalData.post.id, 
                { postId: this.modalData.post.id, content }, 
                currentUser.id
            );

            // Limpiar el formulario
            textarea.value = '';
            this.updateCharacterCount(0);
            
            // Mostrar mensaje de éxito temporal
            this.showSuccess('¡Comentario agregado!');
            
            // El modal se actualizará automáticamente via store listener
        } catch (error) {
            console.error('Error adding comment:', error);
            this.showError('Error al agregar el comentario. Inténtalo de nuevo.');
        } finally {
            this.isSubmitting = false;
            this.updateSubmitButton(false);
        }
    }

    private updateCharacterCount(count: number): void {
        const counter = this.shadow.querySelector('.CharacterCount');
        if (counter) {
            counter.textContent = `${count}/500`;
            counter.classList.toggle('limit-warning', count > 450);
            counter.classList.toggle('limit-danger', count > 500);
        }
    }

    private updateSubmitButton(isSubmitting: boolean): void {
        const submitBtn = this.shadow.querySelector('.SubmitButton') as HTMLButtonElement;
        if (submitBtn) {
            submitBtn.disabled = isSubmitting;
            submitBtn.textContent = isSubmitting ? 'Enviando...' : 'Comentar';
        }
    }

    private showError(message: string): void {
        this.showMessage(message, 'error');
    }

    private showSuccess(message: string): void {
        this.showMessage(message, 'success');
        setTimeout(() => this.hideMessage(), 3000);
    }

    private showMessage(message: string, type: 'error' | 'success'): void {
        const messageContainer = this.shadow.querySelector('.MessageContainer');
        if (messageContainer) {
            messageContainer.className = `MessageContainer ${type}`;
            messageContainer.textContent = message;
            messageContainer.classList.add('visible');
        }
    }

    private hideMessage(): void {
        const messageContainer = this.shadow.querySelector('.MessageContainer');
        if (messageContainer) {
            messageContainer.classList.remove('visible');
        }
    }

    render(): void {
        if (!this.shadow) return;

        if (!this.modalData || !this.modalData.isVisible) {
            this.shadow.innerHTML = '';
            return;
        }

        const { post } = this.modalData;
        const currentUser = authStore.getCurrentUser();

        this.shadow.innerHTML = `
            <style>
            ${loadComponentCSS('commentModal')}
            </style>
            <div class="ModalOverlay">
                <div class="ModalContainer">
                    <div class="ModalHeader">
                        <h3>Comentarios</h3>
                        <button class="CloseButton" onclick="this.getRootNode().host.hideModal()">×</button>
                    </div>

                    <div class="PostPreview">
                        <div class="PostAuthor">
                            <img src="${getAvatarUrl(post.user?.avatar)}" 
                                 alt="${post.user?.username || 'Usuario'}" 
                                 class="AuthorAvatar">
                            <span class="AuthorName">${post.user?.username || 'Usuario'}</span>
                        </div>
                        <p class="PostText">${this.escapeHtml(post.content)}</p>
                    </div>

                    <div class="CommentsSection">
                        <div class="CommentsHeader">
                            <span class="CommentsCount">${post.commentsCount || 0} comentarios</span>
                        </div>
                        
                        <div class="CommentsList">
                            ${post.comments && post.comments.length > 0 
                                ? post.comments.map(comment => this.renderComment(comment)).join('')
                                : '<div class="NoComments">Sé el primero en comentar</div>'
                            }
                        </div>
                    </div>

                    ${currentUser ? `
                        <div class="CommentForm">
                            <div class="MessageContainer"></div>
                            <div class="CurrentUserInfo">
                                <img src="${getAvatarUrl(currentUser.avatar)}" 
                                     alt="${currentUser.username || currentUser.fullName || 'Usuario'}" 
                                     class="CurrentUserAvatar">
                                <div class="CurrentUserDetails">
                                    <span class="CurrentUserName">${currentUser.username || currentUser.fullName || 'Usuario'}</span>
                                    <span class="CommentPrompt">Escribir comentario</span>
                                </div>
                            </div>
                            <form class="CommentFormElement">
                                <div class="CommentInputContainer">
                                    <textarea 
                                        class="CommentInput" 
                                        placeholder="¿Qué opinas sobre esta publicación?"
                                        maxlength="500"
                                        rows="3"></textarea>
                                </div>
                                <div class="CommentFormFooter">
                                    <span class="CharacterCount">0/500</span>
                                    <button type="submit" class="SubmitButton">Comentar</button>
                                </div>
                            </form>
                        </div>
                    ` : `
                        <div class="LoginPrompt">
                            <p>Inicia sesión para comentar</p>
                            <a href="login.html" class="LoginButton">Iniciar sesión</a>
                        </div>
                    `}
                </div>
            </div>
        `;

        this.setupModalEventListeners();
    }

    private setupModalEventListeners(): void {
        // Form submission
        const form = this.shadow.querySelector('.CommentFormElement');
        if (form) {
            form.addEventListener('submit', this.handleSubmitComment.bind(this));
        }

        // Character count
        const textarea = this.shadow.querySelector('.CommentInput') as HTMLTextAreaElement;
        if (textarea) {
            textarea.addEventListener('input', (e) => {
                const target = e.target as HTMLTextAreaElement;
                this.updateCharacterCount(target.value.length);
            });

            // Auto-resize textarea
            textarea.addEventListener('input', (e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                target.style.height = Math.min(target.scrollHeight, 120) + 'px';
            });
        }

        // Close button
        const closeBtn = this.shadow.querySelector('.CloseButton');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.hideModal());
        }
    }

    private renderComment(comment: Comment): string {
        const timeAgo = this.formatTimeAgo(comment.createdAt);
        
        return `
            <div class="CommentItem">
                <img src="${getAvatarUrl(comment.user?.avatar)}" 
                     alt="${comment.user?.username || 'Usuario'}" 
                     class="CommentAvatar">
                <div class="CommentContent">
                    <div class="CommentHeader">
                        <span class="CommentAuthor">${comment.user?.username || 'Usuario'}</span>
                        <span class="CommentTime">${timeAgo}</span>
                    </div>
                    <p class="CommentText">${this.escapeHtml(comment.content)}</p>
                </div>
            </div>
        `;
    }

    private formatTimeAgo(dateString: string): string {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMinutes = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffMinutes < 1) return 'Ahora';
        if (diffMinutes < 60) return `hace ${diffMinutes}m`;
        if (diffHours < 24) return `hace ${diffHours}h`;
        if (diffDays < 7) return `hace ${diffDays}d`;
        
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

if (!customElements.get('comment-modal')) {
    customElements.define('comment-modal', CommentModal);
}

export default CommentModal; 