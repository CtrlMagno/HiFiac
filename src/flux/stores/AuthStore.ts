import { Store } from '../Store';
import { Action } from '../Dispatcher';
import { User, LoginData, CreateUserData } from '../../types/User';

export interface AuthState {
  currentUser: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  token: string | null;
}

export const AuthActionTypes = {
  LOGIN_REQUEST: 'LOGIN_REQUEST',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  SIGNUP_REQUEST: 'SIGNUP_REQUEST',
  SIGNUP_SUCCESS: 'SIGNUP_SUCCESS',
  SIGNUP_FAILURE: 'SIGNUP_FAILURE',
  LOGOUT: 'LOGOUT',
  CLEAR_ERROR: 'CLEAR_ERROR',
  UPDATE_PROFILE: 'UPDATE_PROFILE'
} as const;

class AuthStore extends Store {
  private state: AuthState = {
    currentUser: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
    token: localStorage.getItem('authToken')
  };

  constructor() {
    super();
    // Verificar si hay un token guardado al inicializar
    if (this.state.token) {
      this.validateToken();
    }
    
    // El listener de Firebase Auth se inicializará manualmente desde las páginas
    // para evitar problemas de dispatch anidado
  }

  // Getters públicos
  getCurrentUser(): User | null {
    return this.state.currentUser;
  }

  isAuthenticated(): boolean {
    return this.state.isAuthenticated;
  }

  isLoading(): boolean {
    return this.state.isLoading;
  }

  getError(): string | null {
    return this.state.error;
  }

  getToken(): string | null {
    return this.state.token;
  }

  // Manejo de acciones
  protected handleAction(action: Action): void {
    switch (action.type) {
      case AuthActionTypes.LOGIN_REQUEST:
        this.handleLoginRequest();
        break;
      
      case AuthActionTypes.LOGIN_SUCCESS:
        this.handleLoginSuccess(action.payload);
        break;
      
      case AuthActionTypes.LOGIN_FAILURE:
        this.handleLoginFailure(action.payload);
        break;
      
      case AuthActionTypes.SIGNUP_REQUEST:
        this.handleSignupRequest();
        break;
      
      case AuthActionTypes.SIGNUP_SUCCESS:
        this.handleSignupSuccess(action.payload);
        break;
      
      case AuthActionTypes.SIGNUP_FAILURE:
        this.handleSignupFailure(action.payload);
        break;
      
      case AuthActionTypes.LOGOUT:
        this.handleLogout();
        break;
      
      case AuthActionTypes.CLEAR_ERROR:
        this.handleClearError();
        break;
      
      case AuthActionTypes.UPDATE_PROFILE:
        this.handleUpdateProfile(action.payload);
        break;
      
      default:
        // No hacer nada para acciones no reconocidas
        break;
    }
  }

  private handleLoginRequest(): void {
    this.state = {
      ...this.state,
      isLoading: true,
      error: null
    };
    this.emitChange();
  }

  private handleLoginSuccess(payload: { user: User; token: string }): void {
    const { user, token } = payload;
    
    // Guardar token en localStorage
    localStorage.setItem('authToken', token);
    
    this.state = {
      ...this.state,
      currentUser: user,
      isAuthenticated: true,
      isLoading: false,
      error: null,
      token
    };
    
    this.emitChange();
  }

  private handleLoginFailure(error: string): void {
    this.state = {
      ...this.state,
      isLoading: false,
      error,
      isAuthenticated: false,
      currentUser: null
    };
    this.emitChange();
  }

  private handleSignupRequest(): void {
    this.state = {
      ...this.state,
      isLoading: true,
      error: null
    };
    this.emitChange();
  }

  private handleSignupSuccess(payload: { user: User; token: string }): void {
    const { user, token } = payload;
    
    // Guardar token en localStorage
    localStorage.setItem('authToken', token);
    
    this.state = {
      ...this.state,
      currentUser: user,
      isAuthenticated: true,
      isLoading: false,
      error: null,
      token
    };
    
    this.emitChange();
  }

  private handleSignupFailure(error: string): void {
    this.state = {
      ...this.state,
      isLoading: false,
      error,
      isAuthenticated: false,
      currentUser: null
    };
    this.emitChange();
  }

  private handleLogout(): void {
    // Remover token del localStorage
    localStorage.removeItem('authToken');
    
    this.state = {
      currentUser: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      token: null
    };
    
    this.emitChange();
  }

  private handleClearError(): void {
    this.state = {
      ...this.state,
      error: null
    };
    this.emitChange();
  }

  private handleUpdateProfile(user: User): void {
    this.state = {
      ...this.state,
      currentUser: user
    };
    this.emitChange();
  }

  private async validateToken(): Promise<void> {
    try {
      console.log('Validating token...');
      
      // Importar Firebase Auth dinámicamente para evitar problemas de dependencias
      const { auth } = await import('../../services/firebase');
      const { onAuthStateChanged } = await import('firebase/auth');
      
      // Verificar estado de autenticación con Firebase
      onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          // Usuario está autenticado en Firebase
          try {
            const { getDoc, doc } = await import('firebase/firestore');
            const { db } = await import('../../services/firebase');
            
            const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
            const userData = userDoc.exists() ? userDoc.data() : {};
            
            const user = {
              id: firebaseUser.uid,
              email: firebaseUser.email || '',
              username: userData?.username || firebaseUser.displayName || '',
              fullName: userData?.fullName || firebaseUser.displayName || '',
              avatar: userData?.avatar || firebaseUser.photoURL || '',
              bio: userData?.bio || '',
              location: userData?.location || '',
              website: userData?.website || '',
              joinDate: userData?.joinDate || firebaseUser.metadata.creationTime || '',
              followersCount: userData?.followersCount || 0,
              followingCount: userData?.followingCount || 0,
              postsCount: userData?.postsCount || 0
            };
            
            const token = await firebaseUser.getIdToken();
            
            this.state = {
              ...this.state,
              currentUser: user,
              isAuthenticated: true,
              token,
              error: null
            };
            
            this.emitChange();
          } catch (error) {
            console.error('Error getting user data:', error);
            this.handleLogout();
          }
        } else {
          // Usuario no está autenticado en Firebase
          this.handleLogout();
        }
      });
      
    } catch (error) {
      console.error('Error validating token:', error);
      this.handleLogout();
    }
  }
}

// Instancia singleton del store
export const authStore = new AuthStore();
export default authStore; 