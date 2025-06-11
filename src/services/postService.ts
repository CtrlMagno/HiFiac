import { 
  collection, 
  doc, 
  addDoc, 
  getDocs, 
  getDoc,
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  limit, 
  where,
  arrayUnion,
  arrayRemove,
  increment,
  Timestamp
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from './firebase';
import { Post, Comment, CreatePostData, CreateCommentData } from '../types/Post';

export class PostService {

  // Función auxiliar para cargar información del usuario en comentarios
  private async processCommentsWithUserInfo(comments: Comment[]): Promise<Comment[]> {
    if (!comments || comments.length === 0) return [];

    const processedComments: Comment[] = [];
    
    for (const comment of comments) {
      // Si el comentario ya tiene información del usuario, usarla
      if (comment.user) {
        processedComments.push(comment);
        continue;
      }

      // Si no, cargar la información del usuario
      let userInfo = undefined;
      try {
        const userDoc = await getDoc(doc(db, 'users', comment.userId));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          userInfo = {
            id: comment.userId,
            username: userData.username || userData.fullName || 'Usuario',
            fullName: userData.fullName || userData.username || 'Usuario',
            avatar: userData.avatar || '',
            email: userData.email || '',
            followersCount: userData.followersCount || 0,
            followingCount: userData.followingCount || 0,
            postsCount: userData.postsCount || 0
          };
        }
      } catch (userError) {
        console.warn('Error al cargar usuario para comentario:', userError);
        userInfo = {
          id: comment.userId,
          username: 'Usuario',
          fullName: 'Usuario',
          avatar: '',
          email: '',
          followersCount: 0,
          followingCount: 0,
          postsCount: 0
        };
      }

      processedComments.push({
        ...comment,
        user: userInfo
      });
    }

    return processedComments;
  }

  // Crear un nuevo post
  async createPost(postData: CreatePostData, userId: string): Promise<Post> {
    try {
      const now = new Date();
      
      const postDoc = {
        userId,
        content: postData.content,
        imageUrl: postData.imageUrl || '',
        musicTrack: postData.musicTrack || undefined,
        musicUrl: postData.musicUrl || '',
        musicTitle: postData.musicTitle || '',
        musicArtist: postData.musicArtist || '',
        likesCount: 0,
        commentsCount: 0,
        likedBy: [],
        comments: [],
        createdAt: Timestamp.fromDate(now),
        updatedAt: Timestamp.fromDate(now)
      };

      const docRef = await addDoc(collection(db, 'posts'), postDoc);
      
      // Incrementar el contador de posts del usuario
      await updateDoc(doc(db, 'users', userId), {
        postsCount: increment(1)
      });

      return {
        id: docRef.id,
        ...postDoc,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
        isLiked: false // Por defecto el usuario no ha dado like a su propio post
      };
    } catch (error: any) {
      throw new Error(error.message || 'Error al crear el post');
    }
  }

  // Obtener todos los posts (timeline)
  async getAllPosts(limitCount: number = 20): Promise<Post[]> {
    try {
      const q = query(
        collection(db, 'posts'),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );
      
      const querySnapshot = await getDocs(q);
      const posts: Post[] = [];
      
      for (const docSnap of querySnapshot.docs) {
        const data = docSnap.data();
        
        // Obtener información del usuario
        let userInfo = undefined;
        try {
          const userDoc = await getDoc(doc(db, 'users', data.userId));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            userInfo = {
              id: data.userId,
              username: userData.username || userData.fullName || 'Usuario',
              fullName: userData.fullName || userData.username || 'Usuario',
              avatar: userData.avatar || '',
              email: userData.email || '',
              followersCount: userData.followersCount || 0,
              followingCount: userData.followingCount || 0,
              postsCount: userData.postsCount || 0
            };
          }
        } catch (userError) {
          console.warn('Error al cargar usuario:', userError);
          userInfo = {
            id: data.userId,
            username: 'Usuario',
            fullName: 'Usuario',
            avatar: '',
            email: '',
            followersCount: 0,
            followingCount: 0,
            postsCount: 0
          };
        }
        
        // Procesar comentarios con información del usuario
        const processedComments = await this.processCommentsWithUserInfo(data.comments || []);
        
        posts.push({
          id: docSnap.id,
          userId: data.userId,
          user: userInfo,
          content: data.content,
          imageUrl: data.imageUrl || '',
          musicTrack: data.musicTrack || undefined,
          musicUrl: data.musicUrl || '',
          musicTitle: data.musicTitle || '',
          musicArtist: data.musicArtist || '',
          likesCount: data.likesCount || 0,
          commentsCount: data.commentsCount || 0,
          likedBy: data.likedBy || [],
          comments: processedComments, // ✅ Usar comentarios con información del usuario
          createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
          updatedAt: data.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
          isLiked: false // Se actualizará según el usuario actual
        });
      }
      
      return posts;
    } catch (error: any) {
      throw new Error(error.message || 'Error al cargar los posts');
    }
  }

  // Obtener posts de un usuario específico
  async getUserPosts(userId: string): Promise<Post[]> {
    try {
      const q = query(
        collection(db, 'posts'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const posts: Post[] = [];
      
      for (const docSnap of querySnapshot.docs) {
        const data = docSnap.data();
        
        // Procesar comentarios con información del usuario
        const processedComments = await this.processCommentsWithUserInfo(data.comments || []);
        
        posts.push({
          id: docSnap.id,
          userId: data.userId,
          content: data.content,
          imageUrl: data.imageUrl || '',
          musicTrack: data.musicTrack || undefined,
          musicUrl: data.musicUrl || '',
          musicTitle: data.musicTitle || '',
          musicArtist: data.musicArtist || '',
          likesCount: data.likesCount || 0,
          commentsCount: data.commentsCount || 0,
          likedBy: data.likedBy || [],
          comments: processedComments, // ✅ Usar comentarios con información del usuario
          createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
          updatedAt: data.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
          isLiked: false
        });
      }
      
      return posts;
    } catch (error: any) {
      throw new Error(error.message || 'Error al cargar los posts del usuario');
    }
  }

  // Dar like a un post
  async likePost(postId: string, userId: string): Promise<void> {
    try {
      const postRef = doc(db, 'posts', postId);
      const postSnap = await getDoc(postRef);
      
      if (!postSnap.exists()) {
        throw new Error('El post no existe');
      }
      
      const postData = postSnap.data();
      const likedBy = postData.likedBy || [];
      
      // Verificar si el usuario ya ha dado like
      if (likedBy.includes(userId)) {
        console.log('El usuario ya ha dado like a este post');
        return; // No hacer nada si ya tiene like
      }
      
      // Solo agregar like si no lo ha dado antes
      await updateDoc(postRef, {
        likedBy: arrayUnion(userId),
        likesCount: increment(1)
      });
      
      console.log('Like agregado correctamente');
    } catch (error: any) {
      throw new Error(error.message || 'Error al dar like');
    }
  }

  // Quitar like de un post
  async unlikePost(postId: string, userId: string): Promise<void> {
    try {
      const postRef = doc(db, 'posts', postId);
      const postSnap = await getDoc(postRef);
      
      if (!postSnap.exists()) {
        throw new Error('El post no existe');
      }
      
      const postData = postSnap.data();
      const likedBy = postData.likedBy || [];
      const currentLikesCount = postData.likesCount || 0;
      
      // Verificar si el usuario realmente ha dado like
      if (!likedBy.includes(userId)) {
        console.log('El usuario no ha dado like a este post');
        return; // No hacer nada si no ha dado like
      }
      
      // Verificar que no vamos a tener likes negativos
      if (currentLikesCount <= 0) {
        console.log('No se pueden tener likes negativos');
        return;
      }
      
      // Solo quitar like si realmente lo había dado
      await updateDoc(postRef, {
        likedBy: arrayRemove(userId),
        likesCount: increment(-1)
      });
      
      console.log('Like removido correctamente');
    } catch (error: any) {
      throw new Error(error.message || 'Error al quitar like');
    }
  }

  // Agregar comentario a un post
  async addComment(postId: string, commentData: CreateCommentData, userId: string): Promise<Comment> {
    try {
      // Obtener información del usuario que está comentando
      let userInfo = undefined;
      try {
        const userDoc = await getDoc(doc(db, 'users', userId));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          userInfo = {
            id: userId,
            username: userData.username || userData.fullName || 'Usuario',
            fullName: userData.fullName || userData.username || 'Usuario', 
            avatar: userData.avatar || '',
            email: userData.email || '',
            followersCount: userData.followersCount || 0,
            followingCount: userData.followingCount || 0,
            postsCount: userData.postsCount || 0
          };
        }
      } catch (userError) {
        console.warn('Error al cargar usuario para comentario:', userError);
        userInfo = {
          id: userId,
          username: 'Usuario',
          fullName: 'Usuario',
          avatar: '',
          email: '',
          followersCount: 0,
          followingCount: 0,
          postsCount: 0
        };
      }

      const newComment: Comment = {
        id: `comment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId,
        user: userInfo, // ✅ Incluir información completa del usuario
        content: commentData.content,
        createdAt: new Date().toISOString()
      };

      const postRef = doc(db, 'posts', postId);
      
      await updateDoc(postRef, {
        comments: arrayUnion(newComment),
        commentsCount: increment(1)
      });

      console.log('💬 Comentario creado con información del usuario:', newComment);
      return newComment;
    } catch (error: any) {
      throw new Error(error.message || 'Error al agregar comentario');
    }
  }

  // Obtener un post específico
  async getPostById(postId: string): Promise<Post | null> {
    try {
      const postDoc = await getDoc(doc(db, 'posts', postId));
      
      if (postDoc.exists()) {
        const data = postDoc.data();
        
        // Procesar comentarios con información del usuario
        const processedComments = await this.processCommentsWithUserInfo(data.comments || []);
        
        return {
          id: postDoc.id,
          userId: data.userId,
          content: data.content,
          imageUrl: data.imageUrl || '',
          musicTrack: data.musicTrack || undefined,
          musicUrl: data.musicUrl || '',
          musicTitle: data.musicTitle || '',
          musicArtist: data.musicArtist || '',
          likesCount: data.likesCount || 0,
          commentsCount: data.commentsCount || 0,
          likedBy: data.likedBy || [],
          comments: processedComments, // ✅ Usar comentarios con información del usuario
          createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
          updatedAt: data.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
          isLiked: false
        };
      }
      
      return null;
    } catch (error: any) {
      throw new Error(error.message || 'Error al obtener el post');
    }
  }

  // Subir imagen para un post
  async uploadPostImage(file: File, userId: string): Promise<string> {
    try {
      const fileName = `posts/${userId}/${Date.now()}_${file.name}`;
      const imageRef = ref(storage, fileName);
      
      const snapshot = await uploadBytes(imageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      return downloadURL;
    } catch (error: any) {
      throw new Error(error.message || 'Error al subir la imagen');
    }
  }

  // Eliminar un post
  async deletePost(postId: string, userId: string): Promise<void> {
    try {
      // Verificar que el post pertenezca al usuario
      const postDoc = await getDoc(doc(db, 'posts', postId));
      
      if (!postDoc.exists()) {
        throw new Error('El post no existe');
      }
      
      const postData = postDoc.data();
      if (postData.userId !== userId) {
        throw new Error('No tienes permisos para eliminar este post');
      }
      
      // Eliminar el post
      await deleteDoc(doc(db, 'posts', postId));
      
      // Decrementar el contador de posts del usuario
      await updateDoc(doc(db, 'users', userId), {
        postsCount: increment(-1)
      });
    } catch (error: any) {
      throw new Error(error.message || 'Error al eliminar el post');
    }
  }

  // Marcar si el usuario actual ha dado like a los posts
  markUserLikes(posts: Post[], userId: string): Post[] {
    return posts.map(post => ({
      ...post,
      isLiked: post.likedBy.includes(userId)
    }));
  }
}

// Instancia singleton
export const postService = new PostService();
export default postService; 