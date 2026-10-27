import { messageTypes } from "./constants.js";
import { MessagePayload } from "./results.js";

interface Listener {
  type: string;
  func: EventCallback;
}

type EventCallback = (data: MessagePayload) => void;

export class EventDispatcher {
  listeners: Listener[] = [];

  dispatch(type: string, data: MessagePayload): void {
    this.listeners.forEach((listener) => {
      if (listener.type === type) {
        listener.func(data);
      }
    });
  }

  addListener(type: string, func: EventCallback): void {
    this.listeners.push({ type, func });
  }

  removeListener(type: string, func: EventCallback): void {
    this.listeners.forEach((listener, index) => {
      if (listener.type == type && listener.func == func) {
        this.listeners.splice(index, 1);
      }
    });
  }

  addToAllListeners(func: EventCallback): void {
    for (const key in messageTypes) {
      this.addListener(key, func);
    }
  }
}
