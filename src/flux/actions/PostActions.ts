import { AppDispatcher } from '../Dispatcher';
import { PostActionTypes } from '../stores/PostStore';
import { postService } from '../../services/postService';
import { CreatePostData, CreateCommentData, Post } from '../../types/Post';

export class PostActions {
  
  // Cargar todos los posts
  static async loadPosts(limit: number = 20): Promise<void> {
    // Dispatch inicio de carga
    AppDispatcher.dispatch({
      type: PostActionTypes.LOAD_POSTS_REQUEST,
      payload: null
    });

    try {
      const posts = await postService.getAllPosts(limit);
      
      // Marcar likes del usuario actual
      const { authStore } = await import('../index');
      const currentUser = authStore.getCurrentUser();
      const postsWithLikes = currentUser ? 
        postService.markUserLikes(posts, currentUser.id) : posts;
      
      // Dispatch carga exitosa
      AppDispatcher.dispatch({
        type: PostActionTypes.LOAD_POSTS_SUCCESS,
        payload: postsWithLikes
      });
    } catch (error: any) {
      // Dispatch error de carga
      AppDispatcher.dispatch({
        type: PostActionTypes.LOAD_POSTS_FAILURE,
        payload: error.message
      });
    }
  }

  // Cargar posts de un usuario específico
  static async loadUserPosts(userId: string): Promise<void> {
    // Dispatch inicio de carga
    AppDispatcher.dispatch({
      type: PostActionTypes.LOAD_POSTS_REQUEST,
      payload: null
    });

    try {
      const posts = await postService.getUserPosts(userId);
      
      // Dispatch carga exitosa
      AppDispatcher.dispatch({
        type: PostActionTypes.LOAD_POSTS_SUCCESS,
        payload: posts
      });
    } catch (error: any) {
      // Dispatch error de carga
      AppDispatcher.dispatch({
        type: PostActionTypes.LOAD_POSTS_FAILURE,
        payload: error.message
      });
    }
  }

  // Crear un nuevo post
  static async createPost(postData: CreatePostData, userId: string): Promise<void> {
    // Dispatch inicio de creación
    AppDispatcher.dispatch({
      type: PostActionTypes.CREATE_POST_REQUEST,
      payload: null
    });

    try {
      const newPost = await postService.createPost(postData, userId);
      
      // Dispatch creación exitosa
      AppDispatcher.dispatch({
        type: PostActionTypes.CREATE_POST_SUCCESS,
        payload: newPost
      });
    } catch (error: any) {
      // Dispatch error de creación
      AppDispatcher.dispatch({
        type: PostActionTypes.CREATE_POST_FAILURE,
        payload: error.message
      });
    }
  }

  // Dar like a un post
  static async likePost(postId: string, userId: string): Promise<void> {
    try {
      await postService.likePost(postId, userId);
      console.log('Like procesado, recargando posts...');
      
      // Recargar posts para obtener el estado actualizado desde Firebase
      await PostActions.loadPosts(10);
    } catch (error: any) {
      console.error('Error al dar like:', error);
      throw error;
    }
  }

  // Quitar like de un post
  static async unlikePost(postId: string, userId: string): Promise<void> {
    try {
      await postService.unlikePost(postId, userId);
      console.log('Unlike procesado, recargando posts...');
      
      // Recargar posts para obtener el estado actualizado desde Firebase
      await PostActions.loadPosts(10);
    } catch (error: any) {
      console.error('Error al quitar like:', error);
      throw error;
    }
  }

  // Agregar comentario a un post
  static async addComment(postId: string, commentData: CreateCommentData, userId: string): Promise<void> {
    try {
      const newComment = await postService.addComment(postId, commentData, userId);
      
      // Dispatch comentario agregado exitosamente
      AppDispatcher.dispatch({
        type: PostActionTypes.ADD_COMMENT_SUCCESS,
        payload: { postId, comment: newComment }
      });
    } catch (error: any) {
      // Dispatch error al agregar comentario
      AppDispatcher.dispatch({
        type: PostActionTypes.ADD_COMMENT_FAILURE,
        payload: error.message
      });
    }
  }

  // Seleccionar un post (para vista detalle)
  static selectPost(post: Post): void {
    AppDispatcher.dispatch({
      type: PostActionTypes.SELECT_POST,
      payload: post
    });
  }

  // Limpiar errores
  static clearError(): void {
    AppDispatcher.dispatch({
      type: PostActionTypes.CLEAR_ERROR,
      payload: null
    });
  }

  // Subir imagen para un post
  static async uploadPostImage(file: File, userId: string): Promise<string> {
    try {
      const imageUrl = await postService.uploadPostImage(file, userId);
      return imageUrl;
    } catch (error: any) {
      throw new Error(error.message || 'Error al subir la imagen');
    }
  }

  // Eliminar un post
  static async deletePost(postId: string, userId: string): Promise<void> {
    try {
      await postService.deletePost(postId, userId);
      
      // Recargar posts después de eliminar
      await PostActions.loadPosts();
    } catch (error: any) {
      console.error('Error al eliminar post:', error);
    }
  }

  // Marcar likes del usuario en los posts
  static markUserLikes(posts: Post[], userId: string): Post[] {
    return postService.markUserLikes(posts, userId);
  }
}

export default PostActions; 