import { h, ref, markRaw, TransitionGroup } from 'vue'

import QAvatar from '../components/avatar/QAvatar.js'
import QIcon from '../components/icon/QIcon.js'
import QBtn from '../components/btn/QBtn.js'
import QSpinner from '../components/spinner/QSpinner.js'

import { createComponent } from '../utils/private/create.js'
import { noop } from '../utils/event.js'
import { createGlobalNode } from '../utils/private/global-nodes.js'
import { createChildApp } from '../install-quasar.js'

let uid = 0, addNotification
const defaults = {}

const positionList = [
  'top-left', 'top-right',
  'bottom-left', 'bottom-right',
  'top', 'bottom', 'left', 'right', 'center'
]

const badgePositions = [
  'top-left', 'top-right',
  'bottom-left', 'bottom-right'
]

const notifTypes = {
  positive: {
    icon: $q => $q.iconSet.type.positive,
    color: 'positive'
  },

  negative: {
    icon: $q => $q.iconSet.type.negative,
    color: 'negative'
  },

  warning: {
    icon: $q => $q.iconSet.type.warning,
    color: 'warning',
    textColor: 'dark'
  },

  info: {
    icon: $q => $q.iconSet.type.info,
    color: 'info'
  },

  ongoing: {
    group: false,
    timeout: 0,
    spinner: true,
    color: 'grey-8'
  }
}

const groups = {}
const positionClass = {}

function logError (error, config) {
  console.error(`Notify: ${ error }`, config)
  return false
}

function getComponent ($q) {
  return createComponent({
    name: 'QNotifications',

    // hide App from Vue devtools
    devtools: { hide: true },

    setup () {
      const notificationsList = {}
      const notifRefs = []

      positionList.forEach(pos => {
        notificationsList[ pos ] = ref([])

        const
          vert = [ 'left', 'center', 'right' ].includes(pos) === true ? 'center' : (pos.indexOf('top') > -1 ? 'top' : 'bottom'),
          align = pos.indexOf('left') > -1 ? 'start' : (pos.indexOf('right') > -1 ? 'end' : 'center'),
          classes = [ 'left', 'right' ].includes(pos) ? `items-${ pos === 'left' ? 'start' : 'end' } justify-center` : (pos === 'center' ? 'flex-center' : `items-${ align }`)

        positionClass[ pos ] = `q-notifications__list q-notifications__list--${ vert } fixed column no-wrap ${ classes }`
      })

      addNotification = (config, originalApi) => {
        if (!config) {
          return logError('parameter required')
        }

        let Api
        const notif = { textColor: 'white' }

        if (config.ignoreDefaults !== true) {
          Object.assign(notif, defaults)
        }

        if (Object(config) !== config) {
          if (notif.type) {
            Object.assign(notif, notifTypes[ notif.type ])
          }

          config = { message: config }
        }

        Object.assign(notif, notifTypes[ config.type || notif.type ], config)

        if (typeof notif.icon === 'function') {
          notif.icon = notif.icon($q)
        }

        if (!notif.spinner) {
          notif.spinner = false
        }
        else {
          if (notif.spinner === true) {
            notif.spinner = QSpinner
          }

          notif.spinner = markRaw(notif.spinner)
        }

        notif.meta = {
          hasMedia: Boolean(notif.spinner !== false || notif.icon || notif.avatar),
          hasText: Boolean(
            (notif.message !== void 0 && notif.message !== null)
            || (notif.caption !== void 0 && notif.caption !== null)
          )
        }

        if (notif.position) {
          if (positionList.includes(notif.position) === false) {
            return logError('wrong position', config)
          }
        }
        else {
          notif.position = 'bottom'
        }

        if (notif.timeout === void 0) {
          notif.timeout = 5000
        }
        else {
          const t = parseInt(notif.timeout, 10)
          if (isNaN(t) || t < 0) {
            return logError('wrong timeout', config)
          }
          notif.timeout = t
        }

        if (notif.timeout === 0) {
          notif.progress = false
        }
        else if (notif.progress === true) {
          notif.meta.progressClass = 'q-notification__progress' + (
            notif.progressClass
              ? ` ${ notif.progressClass }`
              : ''
          )

          notif.meta.progressStyle = {
            animationDuration: `${ notif.timeout + 1000 }ms`
          }
        }

        const actions = (
          Array.isArray(config.actions) === true
            ? config.actions
            : []
        ).concat(
          config.ignoreDefaults !== true && Array.isArray(defaults.actions) === true
            ? defaults.actions
            : []
        ).concat(
          notifTypes[ config.type ] !== void 0 && Array.isArray(notifTypes[ config.type ].actions) === true
            ? notifTypes[ config.type ].actions
            : []
        )

        notif.closeBtn && actions.push({
          label: typeof notif.closeBtn === 'string'
            ? notif.closeBtn
            : $q.lang.label.close
        })

        notif.actions = actions.map(({ handler, noDismiss, ...item }) => ({
          flat: true,
          ...item,
          onClick: typeof handler === 'function'
            ? () => {
                handler()
                noDismiss !== true && dismiss()
              }
            : () => { dismiss() }
        }))

        if (notif.multiLine === void 0) {
          notif.multiLine = notif.actions.length > 1
        }

        Object.assign(notif.meta, {
          class: 'q-notification row items-stretch'
            + ` q-notification--${ notif.multiLine === true ? 'multi-line' : 'standard' }`
            + (notif.color !== void 0 ? ` bg-${ notif.color }` : '')
            + (notif.textColor !== void 0 ? ` text-${ notif.textColor }` : '')
            + (notif.classes !== void 0 ? ` ${ notif.classes }` : ''),

          wrapperClass: 'q-notification__wrapper col relative-position border-radius-inherit '
            + (notif.multiLine === true ? 'column no-wrap justify-center' : 'row items-center'),

          contentClass: 'q-notification__content row items-center'
            + (notif.multiLine === true ? '' : ' col'),

          leftClass: notif.meta.hasText === true ? 'additional' : 'single',

          attrs: {
            role: 'alert',
            ...notif.attrs
          }
        })

        if (notif.group === false) {
          notif.group = void 0
          notif.meta.group = void 0
        }
        else {
          if (notif.group === void 0 || notif.group === true) {
            // do not replace notifications with different buttons
            notif.group = [
              notif.message,
              notif.caption,
              notif.multiline
            ].concat(
              notif.actions.map(props => `${ props.label }*${ props.icon }`)
            ).join('|')
          }

          notif.meta.group = notif.group + '|' + notif.position
        }

        if (notif.actions.length === 0) {
          notif.actions = void 0
        }
        else {
          notif.meta.actionsClass = 'q-notification__actions row items-center '
            + (notif.multiLine === true ? 'justify-end' : 'col-auto')
            + (notif.meta.hasMedia === true ? ' q-notification__actions--with-media' : '')
        }

        if (originalApi !== void 0) {
          // reset timeout if any
          clearTimeout(originalApi.notif.meta.timer)

          // retain uid
          notif.meta.uid = originalApi.notif.meta.uid

          // replace notif
          const index = notificationsList[ notif.position ].value.indexOf(originalApi.notif)
          notificationsList[ notif.position ].value[ index ] = notif
        }
        else {
          const original = groups[ notif.meta.group ]

          // woohoo, it's a new notification
          if (original === void 0) {
            notif.meta.uid = uid++
            notif.meta.badge = 1

            if ([ 'left', 'right', 'center' ].indexOf(notif.position) !== -1) {
              notificationsList[ notif.position ].value.splice(
                Math.floor(notificationsList[ notif.position ].value.length / 2),
                0,
                notif
              )
            }
            else {
              const action = notif.position.indexOf('top') > -1 ? 'unshift' : 'push'
              notificationsList[ notif.position ].value[ action ](notif)
            }

            if (notif.group !== void 0) {
              groups[ notif.meta.group ] = notif
            }
          }
          // ok, so it's NOT a new one
          else {
            // reset timeout if any
            clearTimeout(original.meta.timer)

            if (notif.badgePosition !== void 0) {
              if (badgePositions.includes(notif.badgePosition) === false) {
                return logError('wrong badgePosition', config)
              }
            }
            else {
              notif.badgePosition = `top-${ notif.position.indexOf('left') > -1 ? 'right' : 'left' }`
            }

            notif.meta.uid = original.meta.uid
            notif.meta.badge = original.meta.badge + 1
            notif.meta.badgeClass = `q-notification__badge q-notification__badge--${ notif.badgePosition }`
              + (notif.badgeColor !== void 0 ? ` bg-${ notif.badgeColor }` : '')
              + (notif.badgeTextColor !== void 0 ? ` text-${ notif.badgeTextColor }` : '')
              + (notif.badgeClass ? ` ${ notif.badgeClass }` : '')

            const index = notificationsList[ notif.position ].value.indexOf(original)
            notificationsList[ notif.position ].value[ index ] = groups[ notif.meta.group ] = notif
          }
        }

        const dismiss = () => {
          remove(notif)
          Api = void 0
        }

        if (notif.timeout > 0) {
          notif.meta.timer = setTimeout(() => {
            dismiss()
          }, notif.timeout + /* show duration */ 1000)
        }

        // only non-groupable can be updated
        if (notif.group !== void 0) {
          return props => {
            if (props !== void 0) {
              logError('trying to update a grouped one which is forbidden', config)
            }
            else {
              dismiss()
            }
          }
        }

        Api = {
          dismiss,
          config,
          notif
        }

        if (originalApi !== void 0) {
          Object.assign(originalApi, Api)
          return
        }

        return props => {
          // if notification wasn't previously dismissed
          if (Api !== void 0) {
            // if no params, then we must dismiss the notification
            if (props === void 0) {
              Api.dismiss()
            }
            // otherwise we're updating it
            else {
              const newNotif = Object.assign({}, Api.config, props, {
                group: false,
                position: notif.position
              })

              addNotification(newNotif, Api)
            }
          }
        }
      }

      function remove (notif) {
        clearTimeout(notif.meta.timer)

        const index = notificationsList[ notif.position ].value.indexOf(notif)
        if (index !== -1) {
          if (notif.group !== void 0) {
            delete groups[ notif.meta.group ]
          }

          const el = notifRefs[ '' + notif.meta.uid ]

          if (el) {
            const { width, height } = getComputedStyle(el)

            el.style.left = `${ el.offsetLeft }px`
            el.style.width = width
            el.style.height = height
          }

          notificationsList[ notif.position ].value.splice(index, 1)

          if (typeof notif.onDismiss === 'function') {
            notif.onDismiss()
          }
        }
      }

      return () => h('div', { class: 'q-notifications' }, positionList.map(pos => {
        return h(TransitionGroup, {
          key: pos,
          class: positionClass[ pos ],
          tag: 'div',
          name: `q-notification--${ pos }`
        }, () => notificationsList[ pos ].value.map(notif => {
          const meta = notif.meta
          const mainChild = []

          if (meta.hasMedia === true) {
            if (notif.spinner !== false) {
              mainChild.push(
                h(notif.spinner, { class: 'q-notification__spinner q-notification__spinner--' + meta.leftClass })
              )
            }
            else if (notif.icon) {
              mainChild.push(
                h(QIcon, {
                  class: 'q-notification__icon q-notification__icon--' + meta.leftClass,
                  name: notif.icon,
                  role: 'img'
                })
              )
            }
            else if (notif.avatar) {
              mainChild.push(
                h(QAvatar, {
                  class: 'q-notification__avatar q-notification__avatar--' + meta.leftClass
                }, () => h('img', { src: notif.avatar, 'aria-hidden': 'true' }))
              )
            }
          }

          if (meta.hasText === true) {
            let msgChild
            const msgData = { class: 'q-notification__message col' }

            if (notif.html === true) {
              msgData.innerHTML = notif.caption
                ? `<div>${ notif.message }</div><div class="q-notification__caption">${ notif.caption }</div>`
                : notif.message
            }
            else {
              const msgNode = [ notif.message ]
              msgChild = notif.caption
                ? [
                    h('div', msgNode),
                    h('div', { class: 'q-notification__caption' }, [ notif.caption ])
                  ]
                : msgNode
            }

            mainChild.push(
              h('div', msgData, msgChild)
            )
          }

          const child = [
            h('div', { class: meta.contentClass }, mainChild)
          ]

          notif.progress === true && child.push(
            h('div', {
              key: `${ meta.uid }|p|${ meta.badge }`,
              class: meta.progressClass,
              style: meta.progressStyle
            })
          )

          notif.actions !== void 0 && child.push(
            h('div', {
              class: meta.actionsClass
            }, notif.actions.map(props => h(QBtn, props)))
          )

          meta.badge > 1 && child.push(
            h('div', {
              key: `${ meta.uid }|${ meta.badge }`,
              class: notif.meta.badgeClass,
              style: notif.badgeStyle
            }, [ meta.badge ])
          )

          return h('div', {
            ref: el => { notifRefs[ '' + meta.uid ] = el },
            key: meta.uid,
            class: meta.class,
            ...meta.attrs
          }, [
            h('div', { class: meta.wrapperClass }, child)
          ])
        }))
      }))
    }
  })
}

export default {
  create (opts) {
    return __QUASAR_SSR_SERVER__
      ? noop
      : addNotification(opts)
  },

  setDefaults (opts) {
    if (__QUASAR_SSR_SERVER__ !== true) {
      opts === Object(opts) && Object.assign(defaults, opts)
    }
  },

  registerType (typeName, typeOpts) {
    if (__QUASAR_SSR_SERVER__ !== true && typeOpts === Object(typeOpts)) {
      notifTypes[ typeName ] = typeOpts
    }
  },

  install ({ $q, parentApp }) {
    $q.notify = this.create
    $q.notify.setDefaults = this.setDefaults
    $q.notify.registerType = this.registerType

    if ($q.config.notify !== void 0) {
      this.setDefaults($q.config.notify)
    }

    if (__QUASAR_SSR_SERVER__ !== true && this.__installed !== true) {
      const el = createGlobalNode('q-notify')
      createChildApp(getComponent($q), parentApp).mount(el)
    }
  }
}
