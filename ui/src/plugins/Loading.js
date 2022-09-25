import Vue from 'vue'

import QSpinner from '../components/spinner/QSpinner.js'
import { isSSR } from './Platform.js'
import cache from '../utils/private/cache.js'
import { isObject } from '../utils/is.js'
import { preventScroll } from '../mixins/prevent-scroll.js'

let
  vm,
  uid = 0,
  timeout,
  props = {},
  activeGroups = {}

const originalDefaults = {
  group: '__default_quasar_group__',
  delay: 0,
  message: false,
  spinnerSize: 80,
  spinnerColor: 'white',
  messageColor: 'white',
  backgroundColor: 'black',
  spinner: QSpinner,
  customClass: ''
}

const defaults = { ...originalDefaults }

function registerProps (opts) {
  if (opts && opts.group !== void 0 && activeGroups[ opts.group ] !== void 0) {
    return Object.assign(activeGroups[ opts.group ], opts)
  }

  const newProps = isObject(opts) === true && opts.ignoreDefaults === true
    ? { ...originalDefaults, ...opts }
    : { ...defaults, ...opts }

  activeGroups[ newProps.group ] = newProps
  return newProps
}

const Loading = {
  isActive: false,

  show (opts) {
    if (isSSR === true) { return }

    props = registerProps(opts)
    const { group } = props

    props.customClass += ` text-${props.backgroundColor}`

    this.isActive = true

    if (vm !== void 0) {
      props.uid = uid
      vm.$forceUpdate()
    }
    else {
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
    }

    return paramProps => {
      // if we don't have params (or not an Object param) then we need to hide this group
      if (paramProps === void 0 || Object(paramProps) !== paramProps) {
        this.hide(group)
        return
      }

      // else we have params so we need to update this group
      this.show({ ...paramProps, group })
    }
  },

  hide (group) {
    if (this.isActive === true) {
      if (group === void 0) {
        // clear out any active groups
        activeGroups = {}
      }
      else if (activeGroups[ group ] === void 0) {
        // we've already hidden it so nothing to do
        return
      }
      else {
        // remove active group
        delete activeGroups[ group ]

        const keys = Object.keys(activeGroups)

        // if there are other groups registered then
        // show last registered one since that one is still active
        if (keys.length !== 0) {
          // get last registered group
          const lastGroup = keys[ keys.length - 1 ]
          this.show({ group: lastGroup })
          return
        }
      }

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
