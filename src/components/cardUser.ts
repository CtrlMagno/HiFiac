import '../styles/components/cardUser.css';
import { loadComponentCSS, getAvatarUrl } from '../utils/cssLoader';
import { authStore, postStore } from '../flux';

export default class CardUser extends HTMLElement {
    private shadow: ShadowRoot;

    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'open' });
    }

    connectedCallback(): void {
        this.setupStoreListeners();
        this.render();
    }

    disconnectedCallback(): void {
        // Limpiar listeners
        authStore.removeChangeListener(this.handleStoreChange);
        postStore.removeChangeListener(this.handleStoreChange);
    }

    private setupStoreListeners(): void {
        // Escuchar cambios en AuthStore y PostStore
        authStore.addChangeListener(this.handleStoreChange.bind(this));
        postStore.addChangeListener(this.handleStoreChange.bind(this));
    }

    private handleStoreChange(): void {
        this.render();
    }

    render(): void {
        if (!this.shadow) return;

        const currentUser = authStore.getCurrentUser();
        
        // Si no hay usuario, mostrar estado de carga o redirect
        if (!currentUser) {
            this.shadow.innerHTML = `
                <style>
                ${loadComponentCSS('cardUser')}
                </style>
                <div class="Container">
                    <div class="CardUser">
                        <div class="LoadingState">
                            <div class="LoadingSpinner"></div>
                            <p>Cargando perfil...</p>
                        </div>
                    </div>
                </div>
            `;
            return;
        }

        // Calcular estadísticas
        const userPosts = postStore.getUserPosts(currentUser.id);
        const postsCount = userPosts.length;
        const totalLikes = userPosts.reduce((sum, post) => sum + (post.likesCount || 0), 0);

        this.shadow.innerHTML = `
            <style>
            ${loadComponentCSS('cardUser')}
            </style>
            <div class="Container">
                <div class="CardUser">
                    <img src="${getAvatarUrl(currentUser.avatar)}" 
                         alt="${currentUser.username}" 
                         class="UserIcon">
                    <div class="UserInfo">
                        <div class="UserInfo1">
                            <p class="UserName">${currentUser.username || currentUser.fullName || 'Usuario'}</p>
                            <p class="UserDescription">${currentUser.bio || 'Sin descripción'}</p>
                            <div class="UserStats">
                                <span class="StatItem">
                                    <strong>${postsCount}</strong> Posts
                                </span>
                                <span class="StatItem">
                                    <strong>${totalLikes}</strong> Likes recibidos
                                </span>
                                <span class="StatItem">
                                    <strong>${currentUser.followersCount || 0}</strong> Seguidores
                                </span>
                            </div>
                        </div>
                        <div class="UserInfo2">
                            <p class="UserEmail">📧 ${currentUser.email}</p>
                            <button class="EditProfileButton" id="edit-profile-btn">
                                ✏️ Editar Perfil
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.setupEventListeners();
    }

    private setupEventListeners(): void {
        const editBtn = this.shadow.querySelector('#edit-profile-btn');
        if (editBtn) {
            editBtn.addEventListener('click', () => {
                // Abrir modal de editar perfil
                const modal = document.querySelector('edit-profile-modal') as any;
                if (modal) {
                    modal.showModal();
                } else {
                    console.error('Modal de editar perfil no encontrado');
                }
            });
        }
    }
}

if (!customElements.get('card-user')) {
    customElements.define('card-user', CardUser);
}
