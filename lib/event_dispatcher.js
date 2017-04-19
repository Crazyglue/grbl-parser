const messageTypes = require("./constants").messageTypes

module.exports = class EventDispatcher {
  constructor() {
    this.listeners = []
  }

  dispatch(type, data) {
    this.listeners.forEach(function(listener) {
      if (listener.type === type) {
        console.log("type", type)
        listener.func(data)
      }
    })
  }

  addListener(type, func) {
    this.listeners.push({type: type, func: func})
  }

  removeListener(type, func) {
    var index = this.listeners.indexOf({type: type, f: func})
    if (index > -1)
      this.listeners = this.listeners.slice(index, index)
  }

  addToAllListeners(func) {
    for (var key in messageTypes) {
      if (messageTypes.hasOwnProperty(key)) {
        this.addListener(key, func)
      }
    }
  }
}

