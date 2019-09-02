import Vue from 'vue'

import QSpinner from '../components/spinner/QSpinner.js'
import { isSSR } from './Platform.js'
import uid from '../utils/uid.js'

let
  vm = null,
  timeout,
  props = {},
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

export default {
  isActive: false,

  show (opts) {
    if (isSSR === true) { return }

    props = opts === Object(opts) && opts.ignoreDefaults === true
      ? { ...originalDefaults, ...opts }
      : { ...defaults, ...opts }

    props.customClass += ` text-${props.backgroundColor}`

    this.isActive = true

    if (vm) {
      vm.$forceUpdate()
      return
    }

    timeout = setTimeout(() => {
      timeout = null

      const node = document.createElement('div')
      document.body.appendChild(node)
      document.body.classList.add('q-body--loading')

      vm = new Vue({
        name: 'QLoading',

        el: node,

        render: (h) => {
          return h('transition', {
            props: {
              name: 'q-transition--fade',
              appear: true
            },
            on: {
              'after-leave': () => {
                // might be called to finalize
                // previous leave, even if it was cancelled
                if (!this.isActive && vm) {
                  vm.$destroy()
                  document.body.classList.remove('q-body--loading')
                  vm.$el.remove()
                  vm = null
                }
              }
            }
          }, [
            this.isActive ? h('div', {
              staticClass: 'q-loading fullscreen column flex-center z-max',
              key: uid(),
              class: props.customClass.trim()
            }, [
              h(props.spinner, {
                props: {
                  color: props.spinnerColor,
                  size: props.spinnerSize
                }
              }),
              (props.message && h('div', {
                class: `text-${props.messageColor}`,
                domProps: {
                  [props.sanitize === true ? 'textContent' : 'innerHTML']: props.message
                }
              })) || void 0
            ]) : null
          ])
        }
      })
    }, props.delay)
  },

  hide () {
    if (this.isActive) {
      if (timeout) {
        clearTimeout(timeout)
        timeout = null
      }

      this.isActive = false
    }
  },

  setDefaults (opts) {
    Object.assign(defaults, opts)
  },

  install ({ $q, cfg: { loading } }) {
    loading !== void 0 && this.setDefaults(loading)

    $q.loading = this
    Vue.util.defineReactive(this, 'isActive', this.isActive)
  }
}
