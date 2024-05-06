import { h, Transition, onMounted } from 'vue'

import QSpinner from '../../components/spinner/QSpinner.js'

import { createChildApp } from '../../install-quasar.js'

import { createReactivePlugin } from '../../utils/private.create/create.js'
import { createGlobalNode, removeGlobalNode } from '../../utils/private.config/nodes.js'
import preventScroll from '../../utils/scroll/prevent-scroll.js'
import { isObject } from '../../utils/is/is.js'

let
  app,
  vm,
  uid = 0,
  timeout = null,
  props = {},
  activeGroups = {}

const originalDefaults = {
  group: '__default_quasar_group__',
  delay: 0,
  message: false,
  html: false,
  spinnerSize: 80,
  spinnerColor: '',
  messageColor: '',
  backgroundColor: '',
  boxClass: '',
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

const Plugin = createReactivePlugin({
  isActive: false
}, {
  show (opts) {
    if (__QUASAR_SSR_SERVER__) return

    props = registerProps(opts)
    const { group } = props

    Plugin.isActive = true

    if (app !== void 0) {
      props.uid = uid
      vm.$forceUpdate()
    }
    else {
      props.uid = ++uid
      timeout !== null && clearTimeout(timeout)

      timeout = setTimeout(() => {
        timeout = null

        const el = createGlobalNode('q-loading')

        app = createChildApp({
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
                  class: 'q-loading__backdrop'
                    + (props.backgroundColor ? ` bg-${ props.backgroundColor }` : '')
                }),

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
        }, Plugin.__parentApp)

        vm = app.mount(el)
      }, props.delay)
    }

    return paramProps => {
      // if we don't have params (or not an Object param) then we need to hide this group
      if (paramProps === void 0 || Object(paramProps) !== paramProps) {
        Plugin.hide(group)
        return
      }

      // else we have params so we need to update this group
      Plugin.show({ ...paramProps, group })
    }
  },

  hide (group) {
    if (__QUASAR_SSR_SERVER__ !== true && Plugin.isActive === true) {
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
          Plugin.show({ group: lastGroup })
          return
        }
      }

      if (timeout !== null) {
        clearTimeout(timeout)
        timeout = null
      }

      Plugin.isActive = false
    }
  },

  setDefaults (opts) {
    if (__QUASAR_SSR_SERVER__ !== true) {
      isObject(opts) === true && Object.assign(defaults, opts)
    }
  },

  install ({ $q, parentApp }) {
    $q.loading = this

    if (__QUASAR_SSR_SERVER__ !== true) {
      Plugin.__parentApp = parentApp

      if ($q.config.loading !== void 0) {
        this.setDefaults($q.config.loading)
      }
    }
  }
})

export default Plugin
