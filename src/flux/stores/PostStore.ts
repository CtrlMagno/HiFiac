import { Store } from '../Store';
import { Action } from '../Dispatcher';
import { Post, Comment, CreatePostData, CreateCommentData } from '../../types/Post';

export interface PostState {
  posts: Post[];
  isLoading: boolean;
  error: string | null;
  currentPost: Post | null;
}

export const PostActionTypes = {
  LOAD_POSTS_REQUEST: 'LOAD_POSTS_REQUEST',
  LOAD_POSTS_SUCCESS: 'LOAD_POSTS_SUCCESS',
  LOAD_POSTS_FAILURE: 'LOAD_POSTS_FAILURE',
  CREATE_POST_REQUEST: 'CREATE_POST_REQUEST',
  CREATE_POST_SUCCESS: 'CREATE_POST_SUCCESS',
  CREATE_POST_FAILURE: 'CREATE_POST_FAILURE',

  ADD_COMMENT_REQUEST: 'ADD_COMMENT_REQUEST',
  ADD_COMMENT_SUCCESS: 'ADD_COMMENT_SUCCESS',
  ADD_COMMENT_FAILURE: 'ADD_COMMENT_FAILURE',
  SELECT_POST: 'SELECT_POST',
  CLEAR_ERROR: 'CLEAR_ERROR'
} as const;

class PostStore extends Store {
  private state: PostState = {
    posts: [],
    isLoading: false,
    error: null,
    currentPost: null
  };

  // Getters públicos
  getAllPosts(): Post[] {
    return this.state.posts;
  }

  getCurrentPost(): Post | null {
    return this.state.currentPost;
  }

  isLoading(): boolean {
    return this.state.isLoading;
  }

  getError(): string | null {
    return this.state.error;
  }

  getPostById(id: string): Post | undefined {
    return this.state.posts.find(post => post.id === id);
  }

  getUserPosts(userId: string): Post[] {
    return this.state.posts.filter(post => post.userId === userId);
  }

  // Manejo de acciones
  protected handleAction(action: Action): void {
    switch (action.type) {
      case PostActionTypes.LOAD_POSTS_REQUEST:
        this.handleLoadPostsRequest();
        break;
      
      case PostActionTypes.LOAD_POSTS_SUCCESS:
        this.handleLoadPostsSuccess(action.payload);
        break;
      
      case PostActionTypes.LOAD_POSTS_FAILURE:
        this.handleLoadPostsFailure(action.payload);
        break;
      
      case PostActionTypes.CREATE_POST_REQUEST:
        this.handleCreatePostRequest();
        break;
      
      case PostActionTypes.CREATE_POST_SUCCESS:
        this.handleCreatePostSuccess(action.payload);
        break;
      
      case PostActionTypes.CREATE_POST_FAILURE:
        this.handleCreatePostFailure(action.payload);
        break;
      

      
      case PostActionTypes.ADD_COMMENT_SUCCESS:
        this.handleAddCommentSuccess(action.payload);
        break;
      
      case PostActionTypes.SELECT_POST:
        this.handleSelectPost(action.payload);
        break;
      
      case PostActionTypes.CLEAR_ERROR:
        this.handleClearError();
        break;
      
      default:
        break;
    }
  }

  private handleLoadPostsRequest(): void {
    this.state = {
      ...this.state,
      isLoading: true,
      error: null
    };
    this.emitChange();
  }

  private handleLoadPostsSuccess(posts: Post[]): void {
    this.state = {
      ...this.state,
      posts,
      isLoading: false,
      error: null
    };
    this.emitChange();
  }

  private handleLoadPostsFailure(error: string): void {
    this.state = {
      ...this.state,
      isLoading: false,
      error
    };
    this.emitChange();
  }

  private handleCreatePostRequest(): void {
    this.state = {
      ...this.state,
      isLoading: true,
      error: null
    };
    this.emitChange();
  }

  private handleCreatePostSuccess(newPost: Post): void {
    this.state = {
      ...this.state,
      posts: [newPost, ...this.state.posts],
      isLoading: false,
      error: null
    };
    this.emitChange();
  }

  private handleCreatePostFailure(error: string): void {
    this.state = {
      ...this.state,
      isLoading: false,
      error
    };
    this.emitChange();
  }

  private handleLikePost(postId: string): void {
    const updatedPosts = this.state.posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          isLiked: true,
          likesCount: post.likesCount + 1
        };
      }
      return post;
    });

    this.state = {
      ...this.state,
      posts: updatedPosts
    };
    this.emitChange();
  }

  private handleUnlikePost(postId: string): void {
    const updatedPosts = this.state.posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          isLiked: false,
          likesCount: Math.max(0, post.likesCount - 1)
        };
      }
      return post;
    });

    this.state = {
      ...this.state,
      posts: updatedPosts
    };
    this.emitChange();
  }

  private handleAddCommentSuccess(payload: { postId: string; comment: Comment }): void {
    const { postId, comment } = payload;
    
    const updatedPosts = this.state.posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [...post.comments, comment],
          commentsCount: post.commentsCount + 1
        };
      }
      return post;
    });

    this.state = {
      ...this.state,
      posts: updatedPosts
    };
    this.emitChange();
  }

  private handleSelectPost(post: Post): void {
    this.state = {
      ...this.state,
      currentPost: post
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
}

// Instancia singleton del store
export const postStore = new PostStore();
export default postStore; 