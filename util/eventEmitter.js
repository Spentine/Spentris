// github copilot
class EventEmitter {
  constructor() {
    this.events = new Map();
  }

  // Method to register an event listener
  on(event, listener) {
    if (!this.events.has(event)) {
      this.events.set(event, new Set());
    }
    this.events.get(event).add(listener);
  }

  // Method to unregister an event listener
  off(event, listener) {
    if (!this.events.has(event)) return;
    this.events.get(event).delete(listener);
  }

  // Method to emit an event
  emit(event, data) {
    if (!this.events.has(event)) return;
    this.events.get(event).forEach(listener => listener(data));
  }
}

export { EventEmitter };