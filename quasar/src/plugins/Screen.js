import Vue from 'vue'

import Platform, { isSSR, fromSSR } from './Platform.js'
import { listenOpts } from '../utils/event.js'
import debounce from '../utils/debounce.js'

const SIZE_LIST = ['sm', 'md', 'lg', 'xl']

export default {
  width: 0,
  height: 0,

  sizes: {
    sm: 600,
    md: 1024,
    lg: 1440,
    xl: 1920
  },

  lt: {
    sm: true,
    md: true,
    lg: true,
    xl: true
  },
  gt: {
    xs: false,
    sm: false,
    md: false,
    lg: false
  },
  xs: true,
  sm: false,
  md: false,
  lg: false,
  xl: false,

  setSizes () {},
  setDebounce () {},

  install ($q, queues) {
    if (isSSR) {
      $q.screen = this
      return
    }

    const update = force => {
      if (window.innerHeight !== this.height) {
        this.height = window.innerHeight
        document.documentElement.style.setProperty('--q-window-height', `${this.height}px`)
      }

      const w = window.innerWidth

      if (w !== this.width) {
        this.width = w
      }
      else if (force !== true) {
        return
      }

      const s = this.sizes

      this.gt.xs = w >= s.sm
      this.gt.sm = w >= s.md
      this.gt.md = w >= s.lg
      this.gt.lg = w >= s.xl
      this.lt.sm = w < s.sm
      this.lt.md = w < s.md
      this.lt.lg = w < s.lg
      this.lt.xl = w < s.xl
      this.xs = this.lt.sm
      this.sm = this.gt.xs && this.lt.md
      this.md = this.gt.sm && this.lt.lg
      this.lg = this.gt.md && this.lt.xl
      this.xl = w > s.xl
    }

    const scrollUpdate = () => {
      setTimeout(() => {
        const scrollY = window.scrollY
        window.scrollTo(0, document.body.scrollHeight)
        setTimeout(() => {
          update()
          window.scrollTo(0, scrollY)
        }, 150)
      }, 150)
    }

    let updateEvt, updateSizes = {}, updateDebounce = 16

    this.setSizes = sizes => {
      SIZE_LIST.forEach(name => {
        if (sizes[name] !== void 0) {
          updateSizes[name] = sizes[name]
        }
      })
    }
    this.setDebounce = deb => {
      updateDebounce = deb
    }

    const start = () => {
      const style = getComputedStyle(document.body)

      // if css props available
      if (style.getPropertyValue('--q-size-sm')) {
        SIZE_LIST.forEach(name => {
          this.sizes[name] = parseInt(style.getPropertyValue(`--q-size-${name}`), 10)
        })
      }

      this.setSizes = sizes => {
        SIZE_LIST.forEach(name => {
          if (sizes[name]) {
            this.sizes[name] = sizes[name]
          }
        })
        update(true)
      }

      this.setDebounce = delay => {
        const fn = (ev) => {
          if (Platform.is.ios !== true) {
            update()
            return
          }
          const hasKeyboard = ['input', 'textarea'].includes(document.activeElement.tagName.toLowerCase())

          if (ev.type === 'focusin' && hasKeyboard) {
            window.removeEventListener('resize', updateEvt, listenOpts.passive)
            const focusoutEvt = () => {
              window.addEventListener('resize', updateEvt, listenOpts.passive)
              window.removeEventListener('focusout', focusoutEvt, listenOpts.passive)
            }
            window.addEventListener('focusout', focusoutEvt, listenOpts.passive)
            scrollUpdate()
          }
          else {
            update()
          }
        }
        if (updateEvt) {
          window.removeEventListener('resize', updateEvt, listenOpts.passive)
          if (Platform.is.ios === true) {
            window.removeEventListener('focusin', updateEvt, listenOpts.passive)
            window.removeEventListener('focusout', updateEvt, listenOpts.passive)
          }
        }
        updateEvt = delay > 0
          ? debounce(fn, delay)
          : fn
        window.addEventListener('resize', updateEvt, listenOpts.passive)
        if (Platform.is.ios === true) {
          window.addEventListener('focusin', updateEvt, listenOpts.passive)
          window.addEventListener('focusout', updateEvt, listenOpts.passive)
        }
      }

      this.setDebounce(updateDebounce)

      if (Object.keys(updateSizes).length > 0) {
        this.setSizes(updateSizes)
        updateSizes = void 0 // free up memory
      }
      else {
        update()
      }

      document.documentElement.style.setProperty('--q-window-height', `${this.height}px`)
    }

    if (fromSSR) {
      queues.takeover.push(start)
    }
    else {
      start()
    }

    Vue.util.defineReactive($q, 'screen', this)
  }
}
