import Vue from 'vue'

import { isSSR, fromSSR } from './Platform.js'

export default {
  isActive: false,
  mode: false,

  install ($q, queues, { dark }) {
    this.isActive = dark === true

    if (isSSR === true) {
      queues.server.push((q, ctx) => {
        q.dark = {
          isActive: false,
          mode: false,
          set: val => {
            ctx.ssr.Q_BODY_CLASSES = ctx.ssr.Q_BODY_CLASSES
              .replace(' body--light', '')
              .replace(' body--dark', '') + ` body--${val === true ? 'dark' : 'light'}`

            q.dark.isActive = val === true
            q.dark.mode = val
          }
        }

        q.dark.set(dark)
      })

      this.set = () => {}
      return
    }

    if (fromSSR === true) {
      const ssrSet = val => {
        this.__fromSSR = val
      }

      const originalSet = this.set

      this.set = ssrSet
      ssrSet(dark)

      queues.takeover.push(() => {
        this.set = originalSet
        this.set(this.__fromSSR)
      })
    }
    else {
      this.set(dark)
    }

    Vue.util.defineReactive(this, 'isActive', this.isActive)
    Vue.util.defineReactive($q, 'dark', this)
  },

  set (val) {
    this.mode = val

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

    document.body.classList.remove(`body--${val === true ? 'light' : 'dark'}`)
    document.body.classList.add(`body--${val === true ? 'dark' : 'light'}`)
  },

  __media: void 0,

  __updateMedia () {
    this.set(this.__media.matches)
  }
}
