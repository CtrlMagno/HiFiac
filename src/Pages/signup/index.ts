import '../../styles/global/main.css';
import '../../styles/pages/signup.css';
import { setupNavigationButtons, addButtonHoverEffects } from '../../utils/navigation';
import { authStore, AuthActions } from '../../flux';
import { CreateUserData } from '../../types/User';

// Funcionalidad específica de la página signup
document.addEventListener('DOMContentLoaded', () => {
    console.log('Signup page loaded successfully');
    
    // Configurar imágenes dinámicamente
    const logo = document.querySelector('.Logo') as HTMLImageElement;
    if (logo) {
        logo.src = '/assets/imgs/logo/LogoHiFiaca Ajustado No Fondo.png';
    }

    const circles = document.querySelectorAll('.CircleBig, .CircleMedium') as NodeListOf<HTMLImageElement>;
    circles.forEach(circle => {
        circle.src = '/assets/imgs/logo/Circulos sin fondo.png';
    });

    // Configurar el formulario de signup
    setupSignupForm();
    
    // Configurar navegación automática
    setupNavigationButtons();
    
    // Agregar efectos visuales a los botones
    addButtonHoverEffects('.ButtonContainer');

    // Listener para cambios en el store de autenticación
    authStore.addChangeListener(handleAuthChange);
    
    // No inicializar Firebase Auth listener automáticamente en signup
    // para evitar redirecciones automáticas no deseadas
});

function setupSignupForm(): void {
    const usernameInput = document.getElementById('username') as HTMLInputElement;
    const fullNameInput = document.getElementById('fullName') as HTMLInputElement;
    const emailInput = document.getElementById('email') as HTMLInputElement;
    const passwordInput = document.getElementById('password') as HTMLInputElement;
    const confirmPasswordInput = document.getElementById('confirmPassword') as HTMLInputElement;
    const signupButton = document.getElementById('signupBtn') as HTMLButtonElement;
    const signupLink = document.querySelector('.ButtonContainer') as HTMLAnchorElement;

    if (!usernameInput || !emailInput || !passwordInput || !confirmPasswordInput || !signupButton || !signupLink) {
        console.error('No se encontraron los elementos del formulario');
        return;
    }

    // Prevenir navegación automática del enlace
    signupLink.href = '#';
    signupLink.onclick = (e) => e.preventDefault();

    // Manejar el submit del formulario
    const handleSignup = async (e: Event) => {
        e.preventDefault();
        
        const username = usernameInput.value.trim();
        const fullName = fullNameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
        const confirmPassword = confirmPasswordInput.value.trim();

        // Validación completa
        const validationError = validateSignupForm({
            username,
            fullName,
            email,
            password,
            confirmPassword
        });

        if (validationError) {
            showError(validationError);
            return;
        }

        // Deshabilitar el botón mientras se procesa
        signupButton.disabled = true;
        signupButton.textContent = 'Creando cuenta...';

        const signupData: CreateUserData = {
            username,
            email,
            password,
            fullName: fullName || username
        };
        
        try {
            await AuthActions.signup(signupData);
        } catch (error) {
            console.error('Error en signup:', error);
        }
    };

    // Event listeners
    signupButton.addEventListener('click', handleSignup);
    
    // Permitir signup con Enter en cualquier input
    [usernameInput, fullNameInput, emailInput, passwordInput, confirmPasswordInput].forEach(input => {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleSignup(e);
            }
        });
    });

    // Validación en tiempo real de confirmación de password
    confirmPasswordInput.addEventListener('input', () => {
        if (confirmPasswordInput.value && passwordInput.value !== confirmPasswordInput.value) {
            confirmPasswordInput.style.borderColor = '#E22134';
        } else {
            confirmPasswordInput.style.borderColor = '';
        }
    });
}

function validateSignupForm(data: {
    username: string;
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
}): string | null {
    const { username, email, password, confirmPassword } = data;

    // Campos requeridos
    if (!username || !email || !password || !confirmPassword) {
        return 'Por favor, completa todos los campos obligatorios';
    }

    // Validar username
    if (username.length < 3) {
        return 'El nombre de usuario debe tener al menos 3 caracteres';
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        return 'El nombre de usuario solo puede contener letras, números y guiones bajos';
    }

    // Validar email
    if (!isValidEmail(email)) {
        return 'Por favor, ingresa un email válido';
    }

    // Validar password
    if (password.length < 6) {
        return 'La contraseña debe tener al menos 6 caracteres';
    }

    // Validar confirmación de password
    if (password !== confirmPassword) {
        return 'Las contraseñas no coinciden';
    }

    return null;
}

function handleAuthChange(): void {
    const signupButton = document.getElementById('signupBtn') as HTMLButtonElement;
    
    if (authStore.isLoading()) {
        signupButton.disabled = true;
        signupButton.textContent = 'Creando cuenta...';
        clearErrorUI(); // Solo limpiar UI, no hacer dispatch
    } else {
        signupButton.disabled = false;
        signupButton.textContent = 'Crear Cuenta';
        
        if (authStore.isAuthenticated()) {
            // Signup exitoso - navegar a home
            console.log('Cuenta creada exitosamente, redirigiendo...');
            showSuccess('¡Cuenta creada exitosamente! Redirigiendo...');
            setTimeout(() => {
                window.location.href = 'home.html';
            }, 2000);
        } else if (authStore.getError()) {
            // Mostrar error
            let errorMessage = authStore.getError() || 'Error desconocido';
            
            // Personalizar mensajes de error de Firebase
            if (errorMessage.includes('email-already-in-use')) {
                errorMessage = 'Este email ya está registrado. ¿Quieres iniciar sesión?';
            } else if (errorMessage.includes('weak-password')) {
                errorMessage = 'La contraseña es muy débil. Usa al menos 6 caracteres.';
            } else if (errorMessage.includes('invalid-email')) {
                errorMessage = 'El formato del email no es válido.';
            }
            
            showError(errorMessage);
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
        animation: slideDown 0.3s ease-out;
    `;

    container.appendChild(errorDiv);

    // Auto-limpiar error después de 7 segundos (solo UI)
    setTimeout(clearErrorUI, 7000);
}

function showSuccess(message: string): void {
    clearErrorUI(); // Solo limpiar UI, no hacer dispatch
    
    const container = document.querySelector('.InputContainer') as HTMLElement;
    if (!container) return;

    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    successDiv.style.cssText = `
        color: #00C851;
        font-size: 0.9rem;
        margin: 10px 0;
        text-align: center;
        background: rgba(0, 200, 81, 0.1);
        padding: 10px;
        border-radius: 6px;
        border: 1px solid rgba(0, 200, 81, 0.3);
        animation: slideDown 0.3s ease-out;
    `;

    container.appendChild(successDiv);
}

function clearError(): void {
    clearErrorUI();
    AuthActions.clearError();
}

function clearErrorUI(): void {
    const existingError = document.querySelector('.error-message, .success-message');
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

// Agregar estilos de animación
const style = document.createElement('style');
style.textContent = `
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .InputContainer input:focus {
        outline: none;
        border-color: #007BFF;
        box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
    }
    
    .InputContainer input.error {
        border-color: #E22134;
        box-shadow: 0 0 0 2px rgba(226, 33, 52, 0.25);
    }
`;
document.head.appendChild(style);
