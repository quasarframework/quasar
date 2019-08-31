import Vue from 'vue'

import QSpinner from '../components/spinner/QSpinner.js'
import { isSSR } from './Platform.js'
import uid from '../utils/uid.js'

let
  hiding = false,
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

    // Force hide(don't wait for transition to finish) to show the next loading
    if (hiding && vm !== null) {
      vm.$emit('destroy')
    }

    if (this.isActive) {
      if (vm) {
        if (!vm.isActive) {
          vm.isActive = true
        }
        vm.$forceUpdate()
      }
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
        data () {
          return {
            isActive: true
          }
        },
        destroyed () {
          document.body.classList.remove('q-body--loading')
          this.$el.remove()
          vm = null
        },
        render (h) {
          return h('transition', {
            props: {
              name: 'q-transition--fade',
              appear: true
            },
            on: {
              'after-leave': () => {
                this.$emit('destroy')
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

    this.isActive = true
  },

  hide () {
    if (!this.isActive || hiding) {
      return
    }

    if (timeout) {
      clearTimeout(timeout)
      timeout = null
      this.isActive = false
    }
    else {
      hiding = true
      vm.isActive = false
      vm.$on('destroy', () => {
        if (vm !== null) {
          vm.$destroy()
        }
        this.isActive = false
        hiding = false
      })
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
