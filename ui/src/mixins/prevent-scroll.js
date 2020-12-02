// this file will eventually be removed
// and superseeded by use-prevent-scroll.js
// after all components use composition api

import preventScroll from '../utils/prevent-scroll.js'

export default {
  methods: {
    __preventScroll (state) {
      if (
        state !== this.preventedScroll &&
        (this.preventedScroll !== void 0 || state === true)
      ) {
        this.preventedScroll = state
        preventScroll(state)
      }
    }
  }
}
