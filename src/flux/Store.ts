import { EventEmitter } from 'events';
import AppDispatcher, { Action, DispatchToken } from './Dispatcher';

export abstract class Store extends EventEmitter {
  private dispatchToken: DispatchToken;
  protected readonly CHANGE_EVENT = 'change';

  constructor() {
    super();
    this.dispatchToken = AppDispatcher.register(this.handleAction.bind(this));
  }

  /**
   * Emite el evento de cambio para notificar a los componentes
   */
  protected emitChange(): void {
    this.emit(this.CHANGE_EVENT);
  }

  /**
   * Añade un listener para cambios en el store
   */
  addChangeListener(callback: () => void): void {
    this.on(this.CHANGE_EVENT, callback);
  }

  /**
   * Remueve un listener de cambios
   */
  removeChangeListener(callback: () => void): void {
    this.removeListener(this.CHANGE_EVENT, callback);
  }

  /**
   * Obtiene el token de dispatch para uso con waitFor
   */
  getDispatchToken(): DispatchToken {
    return this.dispatchToken;
  }

  /**
   * Método abstracto que cada store debe implementar para manejar acciones
   */
  protected abstract handleAction(action: Action): void;

  /**
   * Método para limpiar recursos cuando el store se destruye
   */
  destroy(): void {
    AppDispatcher.unregister(this.dispatchToken);
    this.removeAllListeners();
  }
}
