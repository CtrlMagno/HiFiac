import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  updateProfile,
  User as FirebaseUser,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, db, storage } from './firebase';
import { User, LoginData, CreateUserData } from '../types/User';
import { getAvatarUrl } from '../utils/cssLoader';

export class AuthService {
  
  // Convertir Firebase User a nuestro tipo User
  private mapFirebaseUserToUser(firebaseUser: FirebaseUser, additionalData?: any): User {
    const rawAvatar = additionalData?.avatar || firebaseUser.photoURL || '';
    
    return {
      id: firebaseUser.uid,
      email: firebaseUser.email || '',
      username: additionalData?.username || firebaseUser.displayName || '',
      fullName: additionalData?.fullName || firebaseUser.displayName || '',
      avatar: getAvatarUrl(rawAvatar), // ✅ Usar getAvatarUrl para garantizar avatar válido
      bio: additionalData?.bio || '',
      location: additionalData?.location || '',
      website: additionalData?.website || '',
      joinDate: additionalData?.joinDate || firebaseUser.metadata.creationTime || '',
      followersCount: additionalData?.followersCount || 0,
      followingCount: additionalData?.followingCount || 0,
      postsCount: additionalData?.postsCount || 0
    };
  }

  // Login con email y password
  async login(loginData: LoginData): Promise<{ user: User; token: string }> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, loginData.email, loginData.password);
      const firebaseUser = userCredential.user;
      
      // Obtener datos adicionales del usuario desde Firestore
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      const userData = userDoc.exists() ? userDoc.data() : {};
      
      const user = this.mapFirebaseUserToUser(firebaseUser, userData);
      const token = await firebaseUser.getIdToken();
      
      return { user, token };
    } catch (error: any) {
      throw new Error(error.message || 'Error al iniciar sesión');
    }
  }

  // Registro de nuevo usuario
  async signup(signupData: CreateUserData): Promise<{ user: User; token: string }> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, signupData.email, signupData.password);
      const firebaseUser = userCredential.user;
      
      // Actualizar el perfil de Firebase
      await updateProfile(firebaseUser, {
        displayName: signupData.username
      });

      // Crear documento del usuario en Firestore
      const userData = {
        username: signupData.username,
        fullName: signupData.fullName || signupData.username,
        email: signupData.email,
        bio: '',
        location: '',
        website: '',
        avatar: '/imgs/logo/default-user-avatar.png', // ✅ Establecer avatar por defecto
        joinDate: new Date().toISOString(),
        followersCount: 0,
        followingCount: 0,
        postsCount: 0
      };

      await setDoc(doc(db, 'users', firebaseUser.uid), userData);
      
      const user = this.mapFirebaseUserToUser(firebaseUser, userData);
      const token = await firebaseUser.getIdToken();
      
      return { user, token };
    } catch (error: any) {
      throw new Error(error.message || 'Error al crear la cuenta');
    }
  }

  // Logout
  async logout(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error: any) {
      throw new Error(error.message || 'Error al cerrar sesión');
    }
  }

  // Observar cambios en el estado de autenticación
  onAuthStateChanged(callback: (user: User | null) => void): () => void {
    return onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Usuario logueado
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        const userData = userDoc.exists() ? userDoc.data() : {};
        const user = this.mapFirebaseUserToUser(firebaseUser, userData);
        callback(user);
      } else {
        // Usuario no logueado
        callback(null);
      }
    });
  }

  // Obtener el usuario actual
  getCurrentUser(): FirebaseUser | null {
    return auth.currentUser;
  }

  // Obtener el token del usuario actual
  async getCurrentToken(): Promise<string | null> {
    const user = auth.currentUser;
    if (user) {
      return await user.getIdToken();
    }
    return null;
  }

  // Actualizar perfil del usuario
  async updateUserProfile(userId: string, updates: Partial<User>): Promise<User> {
    try {
      // Actualizar en Firestore
      await setDoc(doc(db, 'users', userId), updates, { merge: true });
      
      // Obtener los datos actualizados
      const userDoc = await getDoc(doc(db, 'users', userId));
      const userData = userDoc.data();
      
      if (auth.currentUser && userData) {
        return this.mapFirebaseUserToUser(auth.currentUser, userData);
      }
      
      throw new Error('No se pudo actualizar el perfil');
    } catch (error: any) {
      throw new Error(error.message || 'Error al actualizar el perfil');
    }
  }

  // Función alias para el modal
  async updateProfile(userId: string, updates: Partial<User>): Promise<User> {
    return this.updateUserProfile(userId, updates);
  }

  // Subir imagen de perfil
  async uploadProfileImage(file: File, userId: string): Promise<string> {
    try {
      // Validar archivo
      if (!file.type.startsWith('image/')) {
        throw new Error('El archivo debe ser una imagen');
      }

      if (file.size > 5 * 1024 * 1024) { // 5MB
        throw new Error('La imagen no puede ser mayor a 5MB');
      }

      // Crear referencia única para la imagen
      const fileName = `profiles/${userId}/${Date.now()}_${file.name}`;
      const imageRef = ref(storage, fileName);
      
      // Subir archivo
      console.log('Subiendo imagen a Firebase Storage...');
      const snapshot = await uploadBytes(imageRef, file);
      
      // Obtener URL de descarga
      const downloadURL = await getDownloadURL(snapshot.ref);
      console.log('Imagen subida exitosamente:', downloadURL);
      
      return downloadURL;
    } catch (error: any) {
      throw new Error(error.message || 'Error al subir la imagen');
    }
  }
}

// Instancia singleton
export const authService = new AuthService();
export default authService; 