// Dispatcher
export { default as AppDispatcher } from './Dispatcher';
export type { Action, DispatchToken, Callback } from './Dispatcher';

// Store base
export { Store } from './Store';

// Auth
export { default as AuthStore, authStore } from './stores/AuthStore';
export { AuthActionTypes } from './stores/AuthStore';
export type { AuthState } from './stores/AuthStore';
export { default as AuthActions } from './actions/AuthActions';

// Posts
export { default as PostStore, postStore } from './stores/PostStore';
export { PostActionTypes } from './stores/PostStore';
export type { PostState } from './stores/PostStore';
export { default as PostActions } from './actions/PostActions';

// Import store instances for use in utility functions
import { authStore } from './stores/AuthStore';
import { postStore } from './stores/PostStore';

// Convenience function to get all stores
export const getStores = () => ({
  auth: authStore,
  posts: postStore
});

// Utility function to clean up all stores (useful for testing or app shutdown)
export const destroyAllStores = () => {
  authStore.destroy();
  postStore.destroy();
}; 