const messageTypes = require("./constants").messageTypes

module.exports = class EventDispatcher {
  constructor() {
    this.listeners = []
  }

  dispatch(type, data) {
    this.listeners.forEach(function(listener) {
      if (listener.type === type) {
        listener.func(data)
      }
    })
  }

  addListener(type, func) {
    this.listeners.push({type: type, func: func})
  }

  removeListener(type, func) {
    var index = this.listeners.indexOf({type: type, func: func})
    this.listeners.forEach((listener, index) => {
      if (listener.type == type && listener.func == func) {
        this.listeners = this.listeners.filter(function(listener) {
          return (listener.type !== type && listener.func !== func)
        })
      }
    })
  }

  addToAllListeners(func) {
    for (var key in messageTypes) {
      if (messageTypes.hasOwnProperty(key)) {
        this.addListener(key, func)
      }
    }
  }
}

