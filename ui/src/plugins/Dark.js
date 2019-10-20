import Vue from 'vue'

import { isSSR, fromSSR, onSSR } from './Platform.js'

export default {
  isActive: false,

  set (val) {
    if (val === 'auto') {
      if (onSSR === true) {
        console.log('SET (onSSR)', isSSR, fromSSR, onSSR, '--->', this.isActive)
        this.__ssrVal = val
        return
      }
      else {
        if (this.__media === void 0) {
          this.__media = window.matchMedia('(prefers-color-scheme: dark)')
          this.__media.addListener(this.__updateMedia)
        }

        val = this.__media.matches
      }
    }
    else if (this.__media !== void 0) {
      this.__media.removeListener(this.__updateMedia)
      this.__media = void 0
    }

    this.isActive = val === true
    console.log('SET', isSSR, fromSSR, onSSR, '--->', this.isActive)

    if (isSSR === false) {
      document.body.classList.remove(`body--${this.isActive === true ? 'light' : 'dark'}`)
      document.body.classList.add(`body--${this.isActive === true ? 'dark' : 'light'}`)
    }
  },

  install ($q, queues, { dark }) {
    console.log('Conf', dark)
    if (isSSR === true) {
      queues.server.push((q, ctx) => {
        this.isActive = dark === true
        q.dark = this
        ctx.ssr.Q_BODY_CLASSES += ` body--${this.isActive === true ? 'dark' : 'light'}`
      })
    }
    else {
      if (fromSSR === true) {
        console.log('from SSR')
        dark !== void 0 && this.set(dark)
        queues.takeover.push(q => {
          console.log('from SSR takeover')
          this.__ssrVal === 'auto' && this.set(this.__ssrVal)
          Object.assign(q.dark, this)
        })
      }
      else {
        this.set(dark)
      }

      Vue.util.defineReactive(this, 'isActive', this.isActive)
      Vue.util.defineReactive($q, 'dark', this)
    }
  },

  __ssrVal: false,
  __media: void 0,

  __updateMedia () {
    this.set(this.__media.matches)
  }
}
