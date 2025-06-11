import '../../styles/global/main.css';
import '../../styles/pages/home.css';
import '../../styles/components/appContainer.css';
import PostCreator from '../../components/postCreator';
import PostFeed from '../../components/postFeed';
import CommentModal from '../../components/commentModal';
import MusicSearchModal from '../../components/musicSearchModal';
import MusicPlayerCard from '../../components/musicPlayerCard';
import { authStore, AuthActions } from '../../flux';

class AppContainer extends HTMLElement {
    private shadow: ShadowRoot;

    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'open' });
        new PostCreator();
        new PostFeed();
        new CommentModal();
        new MusicSearchModal();
        new MusicPlayerCard();
    }

    disconnectedCallback(): void {
        // Limpiar el modal del document.body cuando el componente se desconecta
        const modal = document.querySelector('comment-modal');
        if (modal) {
            modal.remove();
            console.log('Modal de comentarios removido del DOM');
        }
    }

    connectedCallback(): void {
        this.initializeAuth();
        this.render();
        this.setupLogoutButton();
        this.setupCommentModal();
    }

    private setupCommentModal(): void {
        // Agregar el modal directamente al document.body
        if (!document.querySelector('comment-modal')) {
            const modal = document.createElement('comment-modal');
            document.body.appendChild(modal);
            console.log('Modal de comentarios agregado al document.body');
        }
        
        // Debug: verificar que el modal se agregó al DOM
        setTimeout(() => {
            const modal = document.querySelector('comment-modal');
            console.log('Modal en DOM después del render:', modal);
        }, 100);
    }

    private async initializeAuth(): Promise<void> {
        // Inicializar Firebase Auth listener
        AuthActions.initializeAuthListener();
        
        // Escuchar cambios en el AuthStore
        authStore.addChangeListener(() => {
            this.checkAuthentication();
        });
        
        // Dar tiempo a Firebase para verificar el estado
        setTimeout(() => {
            this.checkAuthentication();
        }, 1000);
    }

    private checkAuthentication(): void {
        const currentUser = authStore.getCurrentUser();
        const isAuthenticated = authStore.isAuthenticated();
        
        console.log('Estado de autenticación:', { currentUser, isAuthenticated });
        
        if (!isAuthenticated || !currentUser) {
            console.log('Usuario no autenticado, esperando sincronización con Firebase...');
            // Esperamos un poco más para la sincronización con Firebase
            setTimeout(() => {
                if (!authStore.isAuthenticated()) {
                    console.log('Sin autenticación confirmada, redirigiendo al login...');
                    window.location.href = 'login.html';
                }
            }, 2000);
        } else {
            console.log('Usuario autenticado:', currentUser.username || currentUser.email);
            // Usuario autenticado, todo bien
        }
    }

    private setupLogoutButton(): void {
        const logoutBtn = document.getElementById('logout-btn');
        if (!logoutBtn) {
            console.warn('Botón de logout no encontrado');
            return;
        }

        logoutBtn.addEventListener('click', async (e) => {
            e.preventDefault(); // Prevenir navegación del enlace
            
            // Confirmar logout
            const confirmLogout = confirm('¿Estás seguro de que quieres cerrar sesión?');
            if (!confirmLogout) {
                return;
            }

            try {
                console.log('Iniciando logout...');
                
                // Mostrar indicador de carga
                const icon = logoutBtn.querySelector('img');
                const originalSrc = icon?.getAttribute('src');
                if (icon) {
                    icon.style.opacity = '0.5';
                    logoutBtn.style.pointerEvents = 'none';
                }

                // Ejecutar logout
                await AuthActions.logout();

                // Mostrar mensaje de éxito
                console.log('Logout exitoso, redirigiendo...');
                
                // Pequeña pausa para mostrar el feedback
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

        // Efecto hover para mejor UX
        logoutBtn.addEventListener('mouseenter', () => {
            const icon = logoutBtn.querySelector('img') as HTMLImageElement;
            if (icon) {
                icon.style.transform = 'scale(1.1)';
                icon.style.transition = 'transform 0.2s ease';
            }
        });

        logoutBtn.addEventListener('mouseleave', () => {
            const icon = logoutBtn.querySelector('img') as HTMLImageElement;
            if (icon) {
                icon.style.transform = 'scale(1)';
            }
        });
    }

    render(): void {
        if (!this.shadow) return;

        this.shadow.innerHTML = `
        <style>
        /* Los estilos ya están cargados globalmente a través de las importaciones */
        </style>
        <div class="Container">
            <!-- Formulario para crear posts -->
            <post-creator></post-creator>

            <!-- Feed de posts reales desde Firebase -->
            <post-feed></post-feed>
        </div>
        `;
    }
}

if (!customElements.get('app-container')) {
    customElements.define('app-container', AppContainer);
}
