function parseEventNames (eventNames) {
  return eventNames.trim().replace(/\s\s+/g, ' ').split(' ')
}

function remove (events, eventName, filterFn) {
  events[eventName] = events[eventName].filter(filterFn)
  if (events[eventName].length === 0) {
    delete events[eventName]
  }
}

function on (eventNames, callback, context, once) {
  if (!eventNames) {
    throw new Error('Missing event(s) name(s)')
  }
  if (!callback) {
    throw new Error('Missing callback')
  }
  if (typeof callback !== 'function') {
    throw new Error('Callback is not a function')
  }

  parseEventNames(eventNames).forEach((eventName) => {
    if (!this.events.hasOwnProperty(eventName)) {
      this.events[eventName] = []
    }

    if (this.events[eventName].some(function (item) {
      return item.cb === callback
    })) {
      // Event name already has specified callback
      return
    }

    this.events[eventName].push({
      cb: callback,
      context: context,
      once: once
    })
  })
}

function off (eventNames, callback) {
  if (!eventNames) {
    this.events = {}
    return
  }

  if (callback && typeof callback !== 'function') {
    throw new Error('Callback is not a function')
  }

  parseEventNames(eventNames).forEach((eventName) => {
    if (!this.events.hasOwnProperty(eventName)) {
      // Unregistered event name
      return
    }

    if (!callback) {
      delete this.events[eventName]
      return
    }

    remove(this.events, eventName, function (ev) {
      return ev.cb !== callback
    })
  })
}

function once (eventNames, callback, context) {
  on.call(this, eventNames, callback, context, true)
}

function trigger (eventNames, ...args) {
  if (!eventNames) {
    eventNames = getList.call(this).join(' ')
  }

  parseEventNames(eventNames).forEach((eventName) => {
    if (!this.events.hasOwnProperty(eventName)) {
      // Nothing to trigger
      return
    }

    var onceList = []

    this.events[eventName].forEach(function (ev) {
      ev.cb.apply(ev.context, args)
      if (ev.once) {
        onceList.push(ev)
      }
    })

    remove(this.events, eventName, function (ev) {
      return !onceList.includes(ev)
    })
  })
}

function hasSubscriber (eventNames, callback) {
  if (!eventNames) {
    return Object.keys(this.events).length !== 0
  }

  if (typeof eventNames === 'function') {
    callback = eventNames
    eventNames = getList.call(this).join(' ')
  }

  if (callback && typeof callback !== 'function') {
    throw new Error('Callback is not a function')
  }

  var foundSubscriber = false

  parseEventNames(eventNames).forEach((eventName) => {
    var result = this.events.hasOwnProperty(eventName)

    if (!result) {
      return
    }

    if (callback) {
      result = this.events[eventName].some(function (item) {
        return item.cb === callback
      })

      if (result) {
        foundSubscriber = true
      }
      return
    }

    foundSubscriber = true
  })

  return foundSubscriber
}

function getList () {
  return Object.keys(this.events)
}

function createEmitter () {
  var props = {
    events: {}
  }

  return {
    on: on.bind(props),
    off: off.bind(props),
    once: once.bind(props),
    trigger: trigger.bind(props),

    hasSubscriber: hasSubscriber.bind(props),
    getList: getList.bind(props)
  }
}

export default createEmitter()
