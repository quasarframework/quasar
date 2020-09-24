import defineReactivePlugin from '../utils/define-reactive-plugin.js'
import { isSSR, fromSSR } from './Platform.js'
import { noop } from '../utils/event.js'

const Plugin = defineReactivePlugin({
  isActive: false,
  mode: false
}, {
  __media: void 0,

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
          },
          toggle: () => {
            q.dark.set(q.dark.isActive === false)
          }
        }

        q.dark.set(dark)
      })

      this.set = noop
      return
    }

    const initialVal = dark !== void 0
      ? dark
      : false

    if (fromSSR === true) {
      const ssrSet = val => {
        this.__fromSSR = val
      }

      const originalSet = this.set

      this.set = ssrSet
      ssrSet(initialVal)

      queues.takeover.push(() => {
        this.set = originalSet
        this.set(this.__fromSSR)
      })
    }
    else {
      this.set(initialVal)
    }

    $q.dark = this
  },

  set (val) {
    Plugin.mode = val

    if (val === 'auto') {
      if (Plugin.__media === void 0) {
        Plugin.__media = window.matchMedia('(prefers-color-scheme: dark)')
        Plugin.__updateMedia = () => { Plugin.set('auto') }
        Plugin.__media.addListener(Plugin.__updateMedia)
      }

      val = Plugin.__media.matches
    }
    else if (Plugin.__media !== void 0) {
      Plugin.__media.removeListener(Plugin.__updateMedia)
      Plugin.__media = void 0
    }

    Plugin.isActive = val === true

    document.body.classList.remove(`body--${val === true ? 'light' : 'dark'}`)
    document.body.classList.add(`body--${val === true ? 'dark' : 'light'}`)
  },

  toggle () {
    Plugin.set(Plugin.isActive === false)
  }
})

export default Plugin
