export interface Action {
  type: string;
  payload?: any;
}

export type DispatchToken = string;

export interface Callback {
  (action: Action): void;
}

class Dispatcher {
  private callbacks: Map<DispatchToken, Callback> = new Map();
  private isPending: Map<DispatchToken, boolean> = new Map();
  private isHandled: Map<DispatchToken, boolean> = new Map();
  private isDispatching: boolean = false;
  private pendingAction: Action | null = null;

  /**
   * Registra un callback para ser invocado con cada acción enviada
   */
  register(callback: Callback): DispatchToken {
    const id = `ID_${Math.random().toString(36).substr(2, 9)}`;
    this.callbacks.set(id, callback);
    return id;
  }

  /**
   * Remueve un callback basado en su token
   */
  unregister(id: DispatchToken): void {
    this.callbacks.delete(id);
  }

  /**
   * Espera que otro callback complete antes de continuar
   */
  waitFor(ids: DispatchToken[]): void {
    if (!this.isDispatching) {
      throw new Error('Dispatcher.waitFor(...): Must be invoked while dispatching.');
    }

    for (const id of ids) {
      if (this.isPending.get(id)) {
        if (!this.isHandled.get(id)) {
          throw new Error(`Dispatcher.waitFor(...): Circular dependency detected while waiting for \`${id}\`.`);
        }
        continue;
      }

      if (!this.callbacks.has(id)) {
        throw new Error(`Dispatcher.waitFor(...): \`${id}\` does not map to a registered callback.`);
      }

      this.invokeCallback(id);
    }
  }

  /**
   * Despacha una acción a todos los callbacks registrados
   */
  dispatch(action: Action): void {
    if (this.isDispatching) {
      throw new Error('Dispatch.dispatch(...): Cannot dispatch in the middle of a dispatch.');
    }

    this.startDispatching(action);
    try {
      for (const id of this.callbacks.keys()) {
        if (this.isPending.get(id)) {
          continue;
        }
        this.invokeCallback(id);
      }
    } finally {
      this.stopDispatching();
    }
  }

  /**
   * Verifica si el dispatcher está despachando actualmente
   */
  isDispatchingAction(): boolean {
    return this.isDispatching;
  }

  private invokeCallback(id: DispatchToken): void {
    this.isPending.set(id, true);
    const callback = this.callbacks.get(id);
    if (callback && this.pendingAction) {
      callback(this.pendingAction);
    }
    this.isHandled.set(id, true);
  }

  private startDispatching(action: Action): void {
    for (const id of this.callbacks.keys()) {
      this.isPending.set(id, false);
      this.isHandled.set(id, false);
    }
    this.pendingAction = action;
    this.isDispatching = true;
  }

  private stopDispatching(): void {
    this.pendingAction = null;
    this.isDispatching = false;
  }
}

// Instancia singleton del dispatcher
export const AppDispatcher = new Dispatcher();
export default AppDispatcher;
