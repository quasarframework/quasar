import Vue from 'vue'

import { isSSR } from './Platform.js'

const Dark = {
  isActive: false,

  set (val) {
    if (val === 'auto') {
      if (this.__media === void 0) {
        this.__media = window.matchMedia('(prefers-color-scheme: dark)')
        this.__media.addListener(this.__updateMedia)
      }

      val = this.__media.matches
    }
    else if (this.__media !== void 0) {
      this.__media.removeListener(this.__updateMedia)
      this.__media = void 0
    }

    this.isActive = val === true

    if (isSSR === false) {
      document.body.classList.remove(`body--${val === true ? 'light' : 'dark'}`)
      document.body.classList.add(`body--${val === true ? 'dark' : 'light'}`)
    }
  },

  install ($q, { dark }) {
    this.set(dark || 'auto')

    if (isSSR === false) {
      Vue.util.defineReactive(this, 'isActive', this.isActive)
      Vue.util.defineReactive($q, 'dark', this)
    }

    setTimeout(() => {
      this.isActive = true
    }, 100)
  },

  __media: void 0,
  __updateMedia () {
    this.set(this.__media.matches)
  }
}

export default Dark
