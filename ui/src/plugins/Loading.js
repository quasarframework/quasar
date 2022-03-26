import Vue from 'vue'

import QSpinner from '../components/spinner/QSpinner.js'
import { isSSR } from './Platform.js'
import cache from '../utils/cache.js'
import { isObject } from '../utils/is.js'
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

const Loading = {
  isActive: false,

  show (opts) {
    if (isSSR === true) { return }

    props = isObject(opts) === true && opts.ignoreDefaults === true
      ? { ...originalDefaults, ...opts }
      : { ...defaults, ...opts }

    props.customClass += ` text-${props.backgroundColor}`

    this.isActive = true

    if (vm !== void 0) {
      props.uid = uid
      vm.$forceUpdate()
      return
    }

    props.uid = ++uid
    clearTimeout(timeout)

    timeout = setTimeout(() => {
      timeout = void 0

      const node = document.createElement('div')
      document.body.appendChild(node)

      vm = new Vue({
        name: 'QLoading',

        // hide App from Vue devtools
        devtools: { hide: true },

        beforeCreate () {
          // prevent error in Vue devtools
          this._routerRoot === void 0 && (this._routerRoot = {})
        },

        el: node,

        mounted () {
          preventScroll(true)
        },

        render: (h) => {
          return h('transition', {
            props: {
              name: 'q-transition--fade',
              appear: true
            },
            on: cache(this, 'tr', {
              'after-leave': () => {
                // might be called to finalize
                // previous leave, even if it was cancelled
                if (this.isActive !== true && vm !== void 0) {
                  preventScroll(false)
                  vm.$destroy()
                  vm.$el.remove()
                  vm = void 0
                }
              }
            })
          }, [
            this.isActive === true ? h('div', {
              staticClass: 'q-loading fullscreen column flex-center z-max',
              key: props.uid,
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
    if (this.isActive === true) {
      if (timeout !== void 0) {
        clearTimeout(timeout)
        timeout = void 0
      }

      this.isActive = false
    }
  },

  setDefaults (opts) {
    isObject(opts) === true && Object.assign(defaults, opts)
  },

  install ({ $q, cfg: { loading } }) {
    this.setDefaults(loading)
    $q.loading = this
  }
}

if (isSSR === false) {
  Vue.util.defineReactive(Loading, 'isActive', Loading.isActive)
}

export default Loading
