import '../../styles/global/main.css';
import '../../styles/pages/user.css';
import CardUser from '../../components/cardUser';
import UserPostsFeed from '../../components/userPostsFeed';
import CommentModal from '../../components/commentModal';
import EditProfileModal from '../../components/editProfileModal';
import MusicSearchModal from '../../components/musicSearchModal';
import MusicPlayerCard from '../../components/musicPlayerCard';
import { authStore, AuthActions, PostActions } from '../../flux';

class UserAppContainer extends HTMLElement {
    private shadow: ShadowRoot;

    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'open' });
        new CardUser();
        new UserPostsFeed();
        new CommentModal();
        new EditProfileModal();
        new MusicSearchModal();
        new MusicPlayerCard();
    }

    connectedCallback(): void {
        this.initializeAuth();
        this.render();
        this.setupCommentModal();
        this.setupLogoutButton();
    }

    private async initializeAuth(): Promise<void> {
        // Inicializar Firebase Auth listener
        AuthActions.initializeAuthListener();
        
        // Escuchar cambios en el AuthStore
        authStore.addChangeListener(() => {
            this.checkAuthentication();
        });
        
        // Verificar autenticación inmediatamente
        setTimeout(() => {
            this.checkAuthentication();
        }, 1000);
    }

    private checkAuthentication(): void {
        const currentUser = authStore.getCurrentUser();
        const isAuthenticated = authStore.isAuthenticated();
        
        if (!isAuthenticated || !currentUser) {
            // Redirigir al login si no está autenticado
            setTimeout(() => {
                if (!authStore.isAuthenticated()) {
                    console.log('Usuario no autenticado, redirigiendo al login...');
                    window.location.href = 'login.html';
                }
            }, 2000);
        }
    }

    private setupCommentModal(): void {
        // Agregar el modal de comentarios directamente al document.body
        if (!document.querySelector('comment-modal')) {
            const modal = document.createElement('comment-modal');
            document.body.appendChild(modal);
        }

        // Agregar el modal de editar perfil directamente al document.body
        if (!document.querySelector('edit-profile-modal')) {
            const editModal = document.createElement('edit-profile-modal');
            document.body.appendChild(editModal);
        }
    }

    private setupLogoutButton(): void {
        const logoutBtn = document.getElementById('logout-btn');
        if (!logoutBtn) {
            console.warn('Botón de logout no encontrado');
            return;
        }

        logoutBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            
            const confirmLogout = confirm('¿Estás seguro de que quieres cerrar sesión?');
            if (!confirmLogout) {
                return;
            }

            try {
                console.log('Iniciando logout...');
                
                // Mostrar indicador de carga
                const icon = logoutBtn.querySelector('img');
                if (icon) {
                    icon.style.opacity = '0.5';
                    logoutBtn.style.pointerEvents = 'none';
                }

                // Ejecutar logout
                await AuthActions.logout();

                console.log('Logout exitoso, redirigiendo...');
                
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 500);

            } catch (error) {
                console.error('Error durante logout:', error);
                
                // Restaurar botón en caso de error
                const icon = logoutBtn.querySelector('img') as HTMLImageElement;
                if (icon) {
                    icon.style.opacity = '1';
                    logoutBtn.style.pointerEvents = 'auto';
                }
                
                alert('Error al cerrar sesión. Inténtalo de nuevo.');
            }
        });
    }

    render(): void {
        if (!this.shadow) return;

        this.shadow.innerHTML = `
            <style>
            /* Estilos base del contenedor */
            .Container {
                min-height: 100vh;
                background: #020202;
                padding: 20px 0;
            }
            
            .UserPageContent {
                max-width: 800px;
                margin: 0 auto;
            }
            
            @media (max-width: 768px) {
                .Container {
                    padding: 16px 0;
                }
            }
            
            @media (max-width: 480px) {
                .Container {
                    padding: 12px 0;
                }
            }
            </style>
            
            <div class="Container">
                <div class="UserPageContent">
                    <!-- Información del perfil del usuario -->
                    <card-user></card-user>
                    
                    <!-- Posts del usuario -->
                    <user-posts-feed></user-posts-feed>
                </div>
            </div>
        `;
    }
}

if (!customElements.get('user-app-container')) {
    customElements.define('user-app-container', UserAppContainer);
}
