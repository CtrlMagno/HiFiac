import { AppDispatcher } from '../Dispatcher';
import { AuthActionTypes } from '../stores/AuthStore';
import { authService } from '../../services/authService';
import { LoginData, CreateUserData, User } from '../../types/User';

export class AuthActions {
  
  // Login de usuario
  static async login(loginData: LoginData): Promise<void> {
    // Dispatch inicio de login
    AppDispatcher.dispatch({
      type: AuthActionTypes.LOGIN_REQUEST,
      payload: null
    });

    try {
      const result = await authService.login(loginData);
      
      // Dispatch login exitoso
      AppDispatcher.dispatch({
        type: AuthActionTypes.LOGIN_SUCCESS,
        payload: result
      });
    } catch (error: any) {
      // Dispatch login fallido
      AppDispatcher.dispatch({
        type: AuthActionTypes.LOGIN_FAILURE,
        payload: error.message
      });
    }
  }

  // Registro de usuario
  static async signup(signupData: CreateUserData): Promise<void> {
    // Dispatch inicio de registro
    AppDispatcher.dispatch({
      type: AuthActionTypes.SIGNUP_REQUEST,
      payload: null
    });

    try {
      const result = await authService.signup(signupData);
      
      // Dispatch registro exitoso
      AppDispatcher.dispatch({
        type: AuthActionTypes.SIGNUP_SUCCESS,
        payload: result
      });
    } catch (error: any) {
      // Dispatch registro fallido
      AppDispatcher.dispatch({
        type: AuthActionTypes.SIGNUP_FAILURE,
        payload: error.message
      });
    }
  }

  // Logout de usuario
  static async logout(): Promise<void> {
    try {
      await authService.logout();
      
      // Dispatch logout
      AppDispatcher.dispatch({
        type: AuthActionTypes.LOGOUT,
        payload: null
      });
    } catch (error: any) {
      console.error('Error al cerrar sesión:', error);
      // Aún así hacemos logout local si falla el remoto
      AppDispatcher.dispatch({
        type: AuthActionTypes.LOGOUT,
        payload: null
      });
    }
  }

  // Limpiar errores
  static clearError(): void {
    AppDispatcher.dispatch({
      type: AuthActionTypes.CLEAR_ERROR,
      payload: null
    });
  }

  // Actualizar perfil
  static async updateProfile(userId: string, updates: Partial<User>): Promise<void> {
    try {
      const updatedUser = await authService.updateUserProfile(userId, updates);
      
      AppDispatcher.dispatch({
        type: AuthActionTypes.UPDATE_PROFILE,
        payload: updatedUser
      });
    } catch (error: any) {
      // Podrías agregar un action type para errores de actualización
      console.error('Error al actualizar perfil:', error);
    }
  }

  // Inicializar escucha de estado de autenticación
  static initializeAuthListener(): () => void {
    return authService.onAuthStateChanged(async (user) => {
      if (user) {
        // Usuario logueado en Firebase
        console.log('Firebase Auth: Usuario encontrado:', user.email);
        
        try {
          const token = await authService.getCurrentToken();
          AppDispatcher.dispatch({
            type: AuthActionTypes.LOGIN_SUCCESS,
            payload: { user, token }
          });
        } catch (error) {
          console.error('Error getting token:', error);
        }
      } else {
        // Usuario no logueado en Firebase
        console.log('Firebase Auth: No hay usuario autenticado');
        AppDispatcher.dispatch({
          type: AuthActionTypes.LOGOUT,
          payload: null
        });
      }
    });
  }
}

export default AuthActions; 