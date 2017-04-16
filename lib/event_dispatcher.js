const statusList = require("./constants").callbacks

module.exports = class EventDispatcher {
  constructor() {
    this.listeners = []
  }

  dispatch(status, data) {
    this.listeners.forEach(function(listener) {
      if (listener.status === status) {
        listener.func(data)
      }
    })
  }

  addListener(status, func) {
    this.listeners.push({status: status, func: func})
  }

  removeListener(status, func) {
    var index = this.listeners.indexOf({status: status, f: func})
    if (index > -1)
      this.listeners = this.listeners.slice(index, index)
  }

  addToAllListener(func) {
    statusList.forEach((status) => {
      this.addListener(status, func)
    })
  }
}

