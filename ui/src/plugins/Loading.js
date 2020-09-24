import { h, createApp, Transition } from 'vue'

import QSpinner from '../components/spinner/QSpinner.js'

import defineReactivePlugin from '../utils/define-reactive-plugin.js'
import { isSSR } from './Platform.js'
import { noop } from '../utils/event.js'
import { getAppVm } from '../utils/vm.js'
import { preventScroll } from '../mixins/prevent-scroll.js'

let
  vm,
  uid = 0,
  timeout,
  props = {}

const
  originalDefaults = {
    delay: 0,
    message: false,
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
    if (isSSR === true) { return }

    props = opts === Object(opts) && opts.ignoreDefaults === true
      ? { ...originalDefaults, ...opts }
      : { ...defaults, ...opts }

    props.customClass += ` text-${props.backgroundColor}`
    props.uid = `l_${uid++}`

    Plugin.isActive = true

    if (vm !== void 0) {
      getAppVm(vm).$forceUpdate()
      return
    }

    clearTimeout(timeout)
    timeout = setTimeout(() => {
      timeout = void 0

      const node = document.createElement('div')
      document.body.appendChild(node)

      vm = createApp({
        name: 'QLoading',

        mounted () {
          preventScroll(true)
        },

        methods: {
          __onAfterLeave () {
            // might be called to finalize
            // previous leave, even if it was cancelled
            if (Plugin.isActive !== true && vm !== void 0) {
              preventScroll(false)
              vm.unmount(node)
              node.remove()
              vm = void 0
            }
          },

          __getContent () {
            const content = [
              h(props.spinner, {
                color: props.spinnerColor,
                size: props.spinnerSize
              })
            ]

            props.message && content.push(
              h('div', {
                class: `text-${props.messageColor}`,
                [props.sanitize === true ? 'textContent' : 'innerHTML']: props.message
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
          }, {
            default: Plugin.isActive === true ? this.__getContent : noop
          })
        }
      })

      vm.mount(node)
    }, props.delay)
  },

  hide () {
    if (Plugin.isActive === true) {
      if (timeout !== void 0) {
        clearTimeout(timeout)
        timeout = void 0
      }

      Plugin.isActive = false
    }
  },

  setDefaults (opts) {
    opts === Object(opts) && Object.assign(defaults, opts)
  },

  install ({ $q, cfg: { loading } }) {
    this.setDefaults(loading)
    $q.loading = this
  }
})

export default Plugin
