/**
 * Forked from tiny-emitter
 * Copyright (c) 2017 Scott Corgan
 */

export default class EventBus {
  constructor() {
    // Event names can match properties inherited from Object.prototype.
    this.__stack = Object.create(null)
  }

  on(name, callback, ctx) {
    ;(this.__stack[name] ||= []).push({
      fn: callback,
      ctx
    })

    return this // chainable
  }

  once(name, callback, ctx) {
    let fired = false
    const listener = (...args) => {
      if (fired === true) return
      fired = true
      this.off(name, listener)
      callback.apply(ctx, args)
    }

    listener.__callback = callback
    return this.on(name, listener, ctx) // chainable
  }

  emit(name, ...args) {
    const list = this.__stack[name]

    if (list !== void 0) {
      list.forEach(entry => {
        entry.fn.apply(entry.ctx, args)
      })
    }

    return this // chainable
  }

  off(name, callback) {
    const list = this.__stack[name]

    if (list === void 0) {
      return this // chainable
    }

    if (callback === void 0) {
      delete this.__stack[name]
      return this // chainable
    }

    const liveEvents = list.filter(
      entry => entry.fn !== callback && entry.fn.__callback !== callback
    )

    if (liveEvents.length !== 0) {
      this.__stack[name] = liveEvents
    } else {
      delete this.__stack[name]
    }

    return this // chainable
  }
}
