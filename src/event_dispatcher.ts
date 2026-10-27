import { messageTypes } from "./constants.js";

export class EventDispatcher {
  listeners: any[] = [];

  dispatch(type: string, data: any): void {
    this.listeners.forEach((listener) => {
      if (listener.type === type) {
        listener.func(data);
      }
    });
  }

  addListener(type: string, func: any): void {
    this.listeners.push({ type, func });
  }

  removeListener(type: string, func: any): void {
    this.listeners.forEach((listener, index) => {
      if (listener.type == type && listener.func == func) {
        this.listeners.splice(index, 1);
      }
    });
  }

  addToAllListeners(func: any): void {
    for (const key in messageTypes) {
      this.addListener(key, func);
    }
  }
}
