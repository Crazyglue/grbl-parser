const messageTypes = require("./constants").messageTypes

var EventDispatcher = function() {
  this.listeners = []
}

EventDispatcher.prototype.dispatch = function(type, data) {
  this.listeners.forEach(function(listener) {
    if (listener.type === type) {
      listener.func(data)
    }
  })
}

EventDispatcher.prototype.addListener = function(type, func) {
  this.listeners.push({type: type, func: func})
}

EventDispatcher.prototype.removeListener = function(type, func) {
  var index = this.listeners.indexOf({type: type, func: func})
  this.listeners.forEach(function(listener, index) {
    if (listener.type == type && listener.func == func) {
      this.listeners.splice(index, 1)
    }
  }, this)
}

EventDispatcher.prototype.addToAllListeners = function(func) {
  for (var key in messageTypes) {
      this.addListener(key, func)
    }
}

module.exports = EventDispatcher
