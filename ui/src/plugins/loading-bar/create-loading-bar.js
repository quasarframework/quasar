import { h, ref } from 'vue'

import QAjaxBar from '../../components/ajax-bar/QAjaxBar.js'
import { createChildApp } from '../../install-quasar.js'

import { createReactivePlugin } from '../../utils/private.create/create.js'
import { noop } from '../../utils/event/event.js'
import { createGlobalNode } from '../../utils/private.config/nodes.js'
import { isObject } from '../../utils/is/is.js'

const barRef = ref(null)

export default function createLoadingBar() {
  return createReactivePlugin(
    {
      /**
       * Is LoadingBar active?
       *
       * @api prop isActive
       * @type {Boolean}
       * @reactive
       */
      isActive: false
    },
    {
      /**
       * Notify bar you've started a background activity
       *
       * @api method start
       * @param {Number} speed Delay (in milliseconds) between bar progress increments
       * @returns {void}
       */
      start: noop,

      /**
       * Notify bar one background activity has finalized
       *
       * @api method stop
       * @returns {void}
       */
      stop: noop,

      /**
       * Manually trigger a bar progress increment
       *
       * @api method increment
       * @param {Number} amount Amount (0.0 < x < 1.0) to increment with
       * @returns {void}
       */
      increment: noop,

      /**
       * Set the inner QAjaxBar's props
       *
       * @api method setDefaults
       * @param {Object} props QAjaxBar component props
       * @ts-type QLoadingBarOptions
       * @returns {void}
       */
      setDefaults: noop,

      install({ $q, parentApp }) {
        $q.loadingBar = this

        if (__QUASAR_SSR_SERVER__) return

        if (this.__installed) {
          if ($q.config.loadingBar !== void 0) {
            this.setDefaults($q.config.loadingBar)
          }
          return
        }

        const props = ref(
          $q.config.loadingBar !== void 0 ? { ...$q.config.loadingBar } : {}
        )

        const onStart = () => {
          this.isActive = true
        }

        const onStop = () => {
          this.isActive = false
        }

        const el = createGlobalNode('q-loading-bar')

        createChildApp(
          {
            name: 'LoadingBar',

            // hide App from Vue devtools
            devtools: { hide: true },

            setup: () => () =>
              h(QAjaxBar, {
                ...props.value,
                onStart,
                onStop,
                ref: barRef
              })
          },
          parentApp
        ).mount(el)

        Object.assign(this, {
          start(speed) {
            barRef.value.start(speed)
          },
          stop() {
            barRef.value.stop()
          },
          increment(...args) {
            barRef.value.increment(...args)
          },
          setDefaults(opts) {
            if (isObject(opts)) {
              Object.assign(props.value, opts)
            }
          }
        })
      }
    }
  )
}
