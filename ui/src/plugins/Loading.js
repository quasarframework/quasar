import { h, createApp, Transition, onMounted } from 'vue'

import QSpinner from '../components/spinner/QSpinner.js'

import defineReactivePlugin from '../utils/private/define-reactive-plugin.js'
import { createGlobalNode, removeGlobalNode } from '../utils/private/global-nodes.js'
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
    spinnerColor: '',
    messageColor: '',
    backgroundColor: 'black',
    boxClass: '',
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

    props.customClass += ` text-${ props.backgroundColor }`
    props.uid = `l_${ uid++ }`

    Plugin.isActive = true

    if (app !== void 0) {
      vm.$forceUpdate()
      return
    }

    clearTimeout(timeout)
    timeout = setTimeout(() => {
      timeout = void 0

      const el = createGlobalNode({ id: 'q-loading', cfg: this.$q.config.globalNode })

      app = createApp({
        name: 'QLoading',

        setup () {
          onMounted(() => {
            preventScroll(true)
          })

          function onAfterLeave () {
            // might be called to finalize
            // previous leave, even if it was cancelled
            if (Plugin.isActive !== true && app !== void 0) {
              preventScroll(false)
              app.unmount(el)
              removeGlobalNode(el)
              app = void 0
              vm = void 0
            }
          }

          function getContent () {
            if (Plugin.isActive !== true) {
              return null
            }

            const content = [
              h(props.spinner, {
                class: 'q-loading__spinner',
                color: props.spinnerColor,
                size: props.spinnerSize
              })
            ]

            props.message && content.push(
              h('div', {
                class: 'q-loading__message'
                  + (props.messageColor ? ` text-${ props.messageColor }` : ''),
                [ props.html === true ? 'innerHTML' : 'textContent' ]: props.message
              })
            )

            return h('div', {
              class: 'q-loading fullscreen flex flex-center z-max ' + props.customClass.trim(),
              key: props.uid
            }, [
              h('div', {
                class: 'q-loading__box column items-center ' + props.boxClass
              }, content)
            ])
          }

          return () => h(Transition, {
            name: 'q-transition--fade',
            appear: true,
            onAfterLeave
          }, getContent)
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
    this.$q = opts.$q
  }
})

export default Plugin
