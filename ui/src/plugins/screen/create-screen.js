import { client, isRuntimeSsrPreHydration } from '../platform/Platform.js'

import { createReactivePlugin } from '../../utils/private.create/create.js'
import { listenOpts, noop } from '../../utils/event/event.js'
import debounce from '../../utils/debounce/debounce.js'

const SIZE_LIST = ['sm', 'md', 'lg', 'xl']
const { passive } = listenOpts

export default function createScreen() {
  return createReactivePlugin(
    {
      /**
       * Screen width (in pixels)
       *
       * @api prop width
       * @type {Number}
       * @reactive
       * @example 452
       */
      width: 0,

      /**
       * Screen height (in pixels)
       *
       * @api prop height
       * @type {Number}
       * @reactive
       * @example 721
       */
      height: 0,

      /**
       * Tells current window breakpoint
       *
       * @api prop name
       * @type {String}
       * @value 'xs'
       * @value 'sm'
       * @value 'md'
       * @value 'lg'
       * @value 'xl'
       * @reactive
       */
      name: 'xs',

      /**
       * Breakpoints (in pixels)
       *
       * @api prop sizes
       * @type {Object}
       * @reactive
       * @example { sm: 600, md: 1024, lg: 1440, xl: 1920 }
       */
      sizes: {
        sm: 600,
        md: 1024,
        lg: 1440,
        xl: 1920
      },

      /**
       * Tells if current screen width is lower than breakpoint-name
       *
       * @api prop lt
       * @type {Object}
       * @reactive
       * @example { sm: false, md: true, lg: true, xl: true }
       */
      lt: {
        sm: true,
        md: true,
        lg: true,
        xl: true
      },

      /**
       * Tells if current screen width is greater than breakpoint-name
       *
       * @api prop gt
       * @type {Object}
       * @reactive
       * @example { xs: true, sm: true, md: false, lg: false, xl: false }
       */
      gt: {
        xs: false,
        sm: false,
        md: false,
        lg: false
      },

      /**
       * Current screen width fits exactly 'xs' breakpoint
       *
       * @api prop xs
       * @type {Boolean}
       * @reactive
       */
      xs: true,

      /**
       * Current screen width fits exactly 'sm' breakpoint
       *
       * @api prop sm
       * @type {Boolean}
       * @reactive
       */
      sm: false,

      /**
       * Current screen width fits exactly 'md' breakpoint
       *
       * @api prop md
       * @type {Boolean}
       * @reactive
       */
      md: false,

      /**
       * Current screen width fits exactly 'lg' breakpoint
       *
       * @api prop lg
       * @type {Boolean}
       * @reactive
       */
      lg: false,

      /**
       * Current screen width fits exactly 'xl' breakpoint
       *
       * @api prop xl
       * @type {Boolean}
       * @reactive
       */
      xl: false
    },
    {
      /**
       * Override default breakpoint sizes
       *
       * @api method setSizes
       * @param {Object} breakpoints Pick what you want to override
       * @param-required breakpoints
       * @returns {null}
       */
      setSizes: noop,

      /**
       * Debounce update of all props when screen width/height changes
       *
       * @api method setDebounce
       * @param {Number} amount Amount in milliseconds
       * @param-required amount
       * @returns {null}
       */
      setDebounce: noop,

      install({ $q, onSSRHydrated }) {
        $q.screen = this

        if (__QUASAR_SSR_SERVER__) return

        if (this.__installed) {
          if ($q.config.screen !== void 0) {
            if (!$q.config.screen.bodyClasses) {
              document.body.classList.remove(`screen--${this.name}`)
            } else {
              this.__update(true)
            }
          }
          return
        }

        const { visualViewport } = window
        const target = visualViewport || window
        const scrollingElement =
          document.scrollingElement || document.documentElement
        const getSize =
          visualViewport === void 0 || client.is.mobile
            ? () => [
                Math.max(window.innerWidth, scrollingElement.clientWidth),
                Math.max(window.innerHeight, scrollingElement.clientHeight)
              ]
            : () => [
                visualViewport.width * visualViewport.scale +
                  window.innerWidth -
                  scrollingElement.clientWidth,
                visualViewport.height * visualViewport.scale +
                  window.innerHeight -
                  scrollingElement.clientHeight
              ]

        const useBodyClasses = $q.config.screen?.bodyClasses === true

        this.__update = force => {
          const [w, h] = getSize()

          if (h !== this.height) {
            this.height = h
          }

          if (w !== this.width) {
            this.width = w
          } else if (force !== true) {
            return
          }

          let s = this.sizes

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
          this.xl = this.gt.lg

          s =
            (this.xs && 'xs') ||
            (this.sm && 'sm') ||
            (this.md && 'md') ||
            (this.lg && 'lg') ||
            'xl'

          if (s !== this.name) {
            if (useBodyClasses) {
              document.body.classList.remove(`screen--${this.name}`)
              document.body.classList.add(`screen--${s}`)
            }
            this.name = s
          }
        }

        let updateEvt,
          updateSizes = {},
          updateDebounce = 16

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
              this.sizes[name] = Number.parseInt(
                style.getPropertyValue(`--q-size-${name}`),
                10
              )
            })
          }

          this.setSizes = sizes => {
            SIZE_LIST.forEach(name => {
              if (sizes[name]) {
                this.sizes[name] = sizes[name]
              }
            })
            this.__update(true)
          }

          this.setDebounce = delay => {
            if (updateEvt !== void 0) {
              target.removeEventListener('resize', updateEvt, passive)
            }

            updateEvt =
              delay > 0 ? debounce(this.__update, delay) : this.__update
            target.addEventListener('resize', updateEvt, passive)
          }

          this.setDebounce(updateDebounce)

          if (Object.keys(updateSizes).length !== 0) {
            this.setSizes(updateSizes)
            updateSizes = void 0 // free up memory
          } else {
            this.__update()
          }

          // due to optimizations, this would be left out otherwise
          if (useBodyClasses && this.name === 'xs') {
            document.body.classList.add('screen--xs')
          }
        }

        if (isRuntimeSsrPreHydration.value) {
          onSSRHydrated.push(start)
        } else {
          start()
        }
      }
    }
  )
}
