import Vue from 'vue'

import QSpinner from '../components/spinner/QSpinner.js'
import { isSSR } from './Platform.js'
import uid from '../utils/uid.js'

let
  vm = null,
  timeout,
  props = {},
  defaults = {
    delay: 0,
    message: false,
    spinnerSize: 80,
    spinnerColor: 'white',
    messageColor: 'white',
    backgroundColor: 'black',
    spinner: QSpinner,
    customClass: ''
  }

export default {
  isActive: false,

  show (opts) {
    if (isSSR) { return }

    props = { ...defaults, ...opts }
    props.customClass += ` text-${props.backgroundColor}`

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
                  innerHTML: props.message
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
    if (!this.isActive) {
      return
    }

    if (timeout) {
      clearTimeout(timeout)
      timeout = null
      this.isActive = false
    }
    else {
      vm.isActive = false
      vm.$on('destroy', () => {
        if (vm !== null) {
          vm.$destroy()
          document.body.classList.remove('q-body--loading')
          vm.$el.remove()
          vm = null
        }
        this.isActive = false
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
