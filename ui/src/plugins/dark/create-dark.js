import { createReactivePlugin } from '../../utils/private.create/create.js'

function createServerDark($q, ssrContext) {
  return {
    isActive: false,
    mode: false,

    set: val => {
      ssrContext._meta.bodyClasses =
        ssrContext._meta.bodyClasses
          .replace(' body--light', '')
          .replace(' body--dark', '') +
        ` body--${val === true ? 'dark' : 'light'}`

      $q.dark.isActive = val === true
      $q.dark.mode = val
    },

    toggle: () => {
      $q.dark.set(!$q.dark.isActive)
    }
  }
}

export default function createDark() {
  return createReactivePlugin(
    {
      /**
       * Is Dark mode active?
       *
       * @api prop isActive
       * @type {Boolean}
       * @reactive
       */
      isActive: false,

      /**
       * Dark mode configuration (not status)
       *
       * @api prop mode
       * @type {Boolean|String}
       * @value 'auto'
       * @value true
       * @value false
       * @reactive
       */
      mode: false
    },
    {
      __media: void 0,

      /**
       * Set dark mode status
       *
       * @api method set
       * @param {Boolean|String} status Dark mode status
       * @param-required status
       * @param-value status true
       * @param-value status false
       * @param-value status 'auto'
       * @returns {null}
       */
      set(val) {
        if (__QUASAR_SSR_SERVER__) return

        this.mode = val

        if (val === 'auto') {
          if (this.__media === void 0) {
            this.__media = window.matchMedia('(prefers-color-scheme: dark)')
            this.__updateMedia = () => {
              this.set('auto')
            }
            this.__media.addListener(this.__updateMedia)
          }

          val = this.__media.matches
        } else if (this.__media !== void 0) {
          this.__media.removeListener(this.__updateMedia)
          this.__media = void 0
        }

        this.isActive = val === true
        document.body.classList.remove(
          `body--${val === true ? 'light' : 'dark'}`
        )
        document.body.classList.add(`body--${val === true ? 'dark' : 'light'}`)
      },

      /**
       * Toggle dark mode status
       *
       * @api method toggle
       * @returns {null}
       */
      toggle() {
        if (!__QUASAR_SSR_SERVER__) this.set(!this.isActive)
      },

      install({ $q, ssrContext }) {
        const dark = __QUASAR_SSR_CLIENT__
          ? document.body.classList.contains('body--dark')
          : $q.config.dark

        if (__QUASAR_SSR_SERVER__) {
          this.isActive = dark === true

          $q.dark = createServerDark($q, ssrContext)
          $q.dark.set(dark)
          return
        }

        $q.dark = this

        if (!this.__installed) {
          this.set(dark !== void 0 ? dark : false)
        }
      }
    }
  )
}
