// this file will eventually be removed
// and superseeded by use-emit-listeners.js
// after all components use composition api

const listenerRE = /^on[A-Z]/

export default {
  computed: {
    emitListeners () {
      const acc = {}

      if (this.$.vnode !== void 0 && this.$.vnode !== null && this.$.vnode.props !== null) {
        Object.keys(this.$.vnode.props).forEach(key => {
          if (listenerRE.test(key) === true) {
            acc[ key ] = true
          }
        })
      }

      return acc
    }
  }
}
