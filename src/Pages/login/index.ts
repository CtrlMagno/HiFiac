import '../../styles/global/main.css';
import '../../styles/pages/login.css';
import { setupNavigationButtons, addButtonHoverEffects } from '../../utils/navigation';
import { authStore, AuthActions } from '../../flux';
import { LoginData } from '../../types/User';

// Funcionalidad específica de la página login
document.addEventListener('DOMContentLoaded', () => {
    console.log('Login page loaded successfully');
    
    // Configurar imágenes dinámicamente
    const logo = document.querySelector('.Logo') as HTMLImageElement;
    if (logo) {
        logo.src = '/assets/imgs/logo/LogoHiFiaca Ajustado No Fondo.png';
    }

    const circles = document.querySelectorAll('.CircleBig, .CircleMedium') as NodeListOf<HTMLImageElement>;
    circles.forEach(circle => {
        circle.src = '/assets/imgs/logo/Circulos sin fondo.png';
    });

    // Configurar el formulario de login
    setupLoginForm();
    
    // Configurar navegación automática
    setupNavigationButtons();
    
    // Agregar efectos visuales a los botones
    addButtonHoverEffects('.ButtonContainer');

    // Listener para cambios en el store de autenticación
    authStore.addChangeListener(handleAuthChange);
    
    // No inicializar Firebase Auth listener automáticamente en login
    // para evitar redirecciones automáticas no deseadas
});

function setupLoginForm(): void {
    const usernameInput = document.querySelector('input[type="text"]') as HTMLInputElement;
    const passwordInput = document.querySelector('input[type="password"]') as HTMLInputElement;
    const loginButton = document.querySelector('button') as HTMLButtonElement;
    const loginLink = document.querySelector('.ButtonContainer') as HTMLAnchorElement;

    if (!usernameInput || !passwordInput || !loginButton || !loginLink) {
        console.error('No se encontraron los elementos del formulario');
        return;
    }

    // Actualizar placeholders para mejor UX
    usernameInput.placeholder = 'Email';
    usernameInput.type = 'email';
    passwordInput.placeholder = 'Contraseña';

    // Prevenir navegación automática del enlace
    loginLink.href = '#';
    loginLink.onclick = (e) => e.preventDefault();

    // Manejar el submit del formulario
    const handleLogin = async (e: Event) => {
        e.preventDefault();
        
        const email = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        // Validación básica
        if (!email || !password) {
            showError('Por favor, completa todos los campos');
            return;
        }

        if (!isValidEmail(email)) {
            showError('Por favor, ingresa un email válido');
            return;
        }

        // Deshabilitar el botón mientras se procesa
        loginButton.disabled = true;
        loginButton.textContent = 'Ingresando...';

        const loginData: LoginData = { email, password };
        
        try {
            await AuthActions.login(loginData);
        } catch (error) {
            console.error('Error en login:', error);
        }
    };

    // Event listeners
    loginButton.addEventListener('click', handleLogin);
    
    // Permitir login con Enter
    [usernameInput, passwordInput].forEach(input => {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleLogin(e);
            }
        });
    });
}

function handleAuthChange(): void {
    const loginButton = document.querySelector('button') as HTMLButtonElement;
    
    if (authStore.isLoading()) {
        loginButton.disabled = true;
        loginButton.textContent = 'Ingresando...';
        clearErrorUI(); // Solo limpiar UI, no hacer dispatch
    } else {
        loginButton.disabled = false;
        loginButton.textContent = 'Log In';
        
        if (authStore.isAuthenticated()) {
            // Login exitoso - navegar a home
            console.log('Login exitoso, redirigiendo...');
            window.location.href = 'home.html';
        } else if (authStore.getError()) {
            // Mostrar error
            showError(authStore.getError() || 'Error desconocido');
        }
    }
}

function showError(message: string): void {
    clearErrorUI(); // Solo limpiar UI, no hacer dispatch
    
    const container = document.querySelector('.InputContainer') as HTMLElement;
    if (!container) return;

    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        color: #E22134;
        font-size: 0.9rem;
        margin: 10px 0;
        text-align: center;
        background: rgba(226, 33, 52, 0.1);
        padding: 10px;
        border-radius: 6px;
        border: 1px solid rgba(226, 33, 52, 0.3);
    `;

    container.appendChild(errorDiv);

    // Auto-limpiar error después de 5 segundos (solo UI)
    setTimeout(clearErrorUI, 5000);
}

function clearError(): void {
    clearErrorUI();
    AuthActions.clearError();
}

function clearErrorUI(): void {
    const existingError = document.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
}

function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Limpiar listeners cuando la página se descarga
window.addEventListener('beforeunload', () => {
    authStore.removeChangeListener(handleAuthChange);
});
