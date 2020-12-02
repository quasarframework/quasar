import { h, createApp, Transition } from 'vue'

import QSpinner from '../components/spinner/QSpinner.js'

import defineReactivePlugin from '../utils/define-reactive-plugin.js'
import { createGlobalNode, removeGlobalNode } from '../utils/global-nodes.js'
import preventScroll from '../utils/prevent-scroll.js'

let
  app,
  vm,
  uid = 0,
  timeout,
  props = {}

const
  originalDefaults = {
    delay: 0,
    message: false,
    html: false,
    spinnerSize: 80,
    spinnerColor: 'white',
    messageColor: 'white',
    backgroundColor: 'black',
    spinner: QSpinner,
    customClass: ''
  },
  defaults = { ...originalDefaults }

const Plugin = defineReactivePlugin({
  isActive: false
}, {
  show (opts) {
    if (__QUASAR_SSR_SERVER__) { return }

    props = opts === Object(opts) && opts.ignoreDefaults === true
      ? { ...originalDefaults, ...opts }
      : { ...defaults, ...opts }

    props.customClass += ` text-${props.backgroundColor}`
    props.uid = `l_${uid++}`

    Plugin.isActive = true

    if (app !== void 0) {
      vm.$forceUpdate()
      return
    }

    clearTimeout(timeout)
    timeout = setTimeout(() => {
      timeout = void 0

      const el = createGlobalNode('q-loading')

      app = createApp({
        name: 'QLoading',

        mounted () {
          preventScroll(true)
        },

        methods: {
          __onAfterLeave () {
            // might be called to finalize
            // previous leave, even if it was cancelled
            if (Plugin.isActive !== true && app !== void 0) {
              preventScroll(false)
              app.unmount(el)
              removeGlobalNode(el)
              app = void 0
              vm = void 0
            }
          },

          __getContent () {
            if (Plugin.isActive !== true) {
              return null
            }

            const content = [
              h(props.spinner, {
                color: props.spinnerColor,
                size: props.spinnerSize
              })
            ]

            props.message && content.push(
              h('div', {
                class: `text-${props.messageColor}`,
                [ props.html === true ? 'innerHTML' : 'textContent' ]: props.message
              })
            )

            return h('div', {
              class: 'q-loading fullscreen column flex-center z-max ' + props.customClass.trim(),
              key: props.uid
            }, content)
          }
        },

        render () {
          return h(Transition, {
            name: 'q-transition--fade',
            appear: true,
            onAfterLeave: this.__onAfterLeave
          }, this.__getContent)
        }
      })

      vm = app.mount(el)
    }, props.delay)
  },

  hide () {
    if (__QUASAR_SSR_SERVER__ !== true && Plugin.isActive === true) {
      if (timeout !== void 0) {
        clearTimeout(timeout)
        timeout = void 0
      }

      Plugin.isActive = false
    }
  },

  setDefaults (opts) {
    if (__QUASAR_SSR_SERVER__ !== true) {
      opts === Object(opts) && Object.assign(defaults, opts)
    }
  },

  install (opts) {
    if (__QUASAR_SSR_SERVER__ !== true) {
      this.setDefaults(opts.cfg.loading)
    }

    opts.$q.loading = this
  }
})

export default Plugin
