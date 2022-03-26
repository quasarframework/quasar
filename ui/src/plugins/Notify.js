import Vue from 'vue'

import QAvatar from '../components/avatar/QAvatar.js'
import QIcon from '../components/icon/QIcon.js'
import QBtn from '../components/btn/QBtn.js'
import QSpinner from '../components/spinner/QSpinner.js'

import { noop } from '../utils/event.js'
import { getBodyFullscreenElement } from '../utils/dom.js'
import debounce from '../utils/debounce.js'
import { isObject } from '../utils/is.js'

import { isSSR } from './Platform.js'

let uid = 0, vm

const defaults = {}
const groups = {}
const notificationsList = {}
const positionClass = {}
const emptyRE = /^\s*$/

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

function addNotification (config, vm, originalApi) {
  if (!config) {
    return logError('parameter required')
  }

  let Api
  const notif = { textColor: 'white' }

  if (config.ignoreDefaults !== true) {
    Object.assign(notif, defaults)
  }

  if (isObject(config) === false) {
    if (notif.type) {
      Object.assign(notif, notifTypes[notif.type])
    }

    config = { message: config }
  }

  Object.assign(notif, notifTypes[config.type || notif.type], config)

  if (typeof notif.icon === 'function') {
    notif.icon = notif.icon(vm.$q)
  }

  if (!notif.spinner) {
    notif.spinner = false
  }
  else if (notif.spinner === true) {
    notif.spinner = QSpinner
  }

  notif.meta = {
    hasMedia: Boolean(notif.spinner !== false || notif.icon || notif.avatar),
    hasText: hasContent(notif.message) || hasContent(notif.caption)
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
        ? ` ${notif.progressClass}`
        : ''
    )

    notif.meta.progressStyle = {
      animationDuration: `${notif.timeout + 1000}ms`
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
    notifTypes[config.type] !== void 0 && Array.isArray(notifTypes[config.type].actions) === true
      ? notifTypes[config.type].actions
      : []
  )

  const { closeBtn } = notif
  closeBtn && actions.push({
    label: typeof closeBtn === 'string'
      ? closeBtn
      : vm.$q.lang.label.close
  })

  notif.actions = actions.map(({ handler, noDismiss, style, class: klass, attrs, ...props }) => ({
    staticClass: klass,
    style,
    props: { flat: true, ...props },
    attrs,
    on: {
      click: typeof handler === 'function'
        ? () => {
          handler()
          noDismiss !== true && dismiss()
        }
        : () => { dismiss() }
    }
  }))

  if (notif.multiLine === void 0) {
    notif.multiLine = notif.actions.length > 1
  }

  Object.assign(notif.meta, {
    staticClass: 'q-notification row items-stretch' +
      ` q-notification--${notif.multiLine === true ? 'multi-line' : 'standard'}` +
      (notif.color !== void 0 ? ` bg-${notif.color}` : '') +
      (notif.textColor !== void 0 ? ` text-${notif.textColor}` : '') +
      (notif.classes !== void 0 ? ` ${notif.classes}` : ''),

    wrapperClass: 'q-notification__wrapper col relative-position border-radius-inherit ' +
      (notif.multiLine === true ? 'column no-wrap justify-center' : 'row items-center'),

    contentClass: 'q-notification__content row items-center' +
      (notif.multiLine === true ? '' : ' col'),

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
        notif.actions.map(({ props }) => `${props.label}*${props.icon}`)
      ).join('|')
    }

    notif.meta.group = notif.group + '|' + notif.position
  }

  if (notif.actions.length === 0) {
    notif.actions = void 0
  }
  else {
    notif.meta.actionsClass = 'q-notification__actions row items-center ' +
      (notif.multiLine === true ? 'justify-end' : 'col-auto') +
      (notif.meta.hasMedia === true ? ' q-notification__actions--with-media' : '')
  }

  if (originalApi !== void 0) {
    // reset timeout if any
    clearTimeout(originalApi.notif.meta.timer)

    // retain uid
    notif.meta.uid = originalApi.notif.meta.uid

    // replace notif
    const index = notificationsList[notif.position].indexOf(originalApi.notif)
    notificationsList[notif.position][index] = notif
  }
  else {
    const original = groups[notif.meta.group]

    // woohoo, it's a new notification
    if (original === void 0) {
      notif.meta.uid = uid++
      notif.meta.badge = 1

      if (['left', 'right', 'center'].indexOf(notif.position) !== -1) {
        notificationsList[notif.position].splice(
          Math.floor(notificationsList[notif.position].length / 2),
          0,
          notif
        )
      }
      else {
        const action = notif.position.indexOf('top') > -1 ? 'unshift' : 'push'
        notificationsList[notif.position][action](notif)
      }

      if (notif.group !== void 0) {
        groups[notif.meta.group] = notif
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
        notif.badgePosition = `top-${notif.position.indexOf('left') > -1 ? 'right' : 'left'}`
      }

      notif.meta.uid = original.meta.uid
      notif.meta.badge = original.meta.badge + 1
      notif.meta.badgeClass = `q-notification__badge q-notification__badge--${notif.badgePosition}` +
        (notif.badgeColor !== void 0 ? ` bg-${notif.badgeColor}` : '') +
        (notif.badgeTextColor !== void 0 ? ` text-${notif.badgeTextColor}` : '') +
        (notif.badgeClass ? ` ${notif.badgeClass}` : '')

      const index = notificationsList[notif.position].indexOf(original)
      notificationsList[notif.position][index] = groups[notif.meta.group] = notif
    }
  }

  const dismiss = () => {
    removeNotification(notif, vm)
    Api = void 0
  }

  vm.$forceUpdate()

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

        addNotification(newNotif, vm, Api)
      }
    }
  }
}

function removeNotification (notif, vm) {
  clearTimeout(notif.meta.timer)

  const index = notificationsList[notif.position].indexOf(notif)
  if (index !== -1) {
    if (notif.group !== void 0) {
      delete groups[notif.meta.group]
    }

    const el = vm.$refs['' + notif.meta.uid]

    if (el) {
      const { width, height } = getComputedStyle(el)

      el.style.left = `${el.offsetLeft}px`
      el.style.width = width
      el.style.height = height
    }

    notificationsList[notif.position].splice(index, 1)

    vm.$forceUpdate()

    if (typeof notif.onDismiss === 'function') {
      notif.onDismiss()
    }
  }
}

function hasContent (str) {
  return str !== void 0 &&
    str !== null &&
    emptyRE.test(str) !== true
}

function logError (error, config) {
  console.error(`Notify: ${error}`, config)
  return false
}

const Notifications = {
  name: 'QNotifications',

  // hide App from Vue devtools
  devtools: { hide: true },

  beforeCreate () {
    // prevent error in Vue devtools
    this._routerRoot === void 0 && (this._routerRoot = {})
  },

  render (h) {
    return h('div', { staticClass: 'q-notifications' }, positionList.map(pos => {
      return h('transition-group', {
        key: pos,
        staticClass: positionClass[pos],
        tag: 'div',
        props: {
          name: `q-notification--${pos}`,
          mode: 'out-in'
        }
      }, notificationsList[pos].map(notif => {
        const { meta } = notif
        const mainChild = []

        if (meta.hasMedia === true) {
          if (notif.spinner !== false) {
            mainChild.push(
              h(notif.spinner, {
                staticClass: 'q-notification__spinner q-notification__spinner--' + meta.leftClass,
                props: { color: notif.spinnerColor, size: notif.spinnerSize }
              })
            )
          }
          else if (notif.icon) {
            mainChild.push(
              h(QIcon, {
                staticClass: 'q-notification__icon q-notification__icon--' + meta.leftClass,
                attrs: { role: 'img' },
                props: { name: notif.icon, color: notif.iconColor, size: notif.iconSize }
              })
            )
          }
          else if (notif.avatar) {
            mainChild.push(
              h(QAvatar, { staticClass: 'q-notification__avatar q-notification__avatar--' + meta.leftClass }, [
                h('img', { attrs: { src: notif.avatar, 'aria-hidden': 'true' } })
              ])
            )
          }
        }

        if (meta.hasText === true) {
          let msgChild
          const msgData = { staticClass: 'q-notification__message col' }

          if (notif.html === true) {
            msgData.domProps = {
              innerHTML: notif.caption
                ? `<div>${notif.message}</div><div class="q-notification__caption">${notif.caption}</div>`
                : notif.message
            }
          }
          else {
            const msgNode = [ notif.message ]
            msgChild = notif.caption
              ? [
                h('div', msgNode),
                h('div', { staticClass: 'q-notification__caption' }, [notif.caption])
              ]
              : msgNode
          }

          mainChild.push(
            h('div', msgData, msgChild)
          )
        }

        const child = [
          h('div', { staticClass: meta.contentClass }, mainChild)
        ]

        notif.progress === true && child.push(
          h('div', {
            key: `${meta.uid}|p|${meta.badge}`,
            staticClass: meta.progressClass,
            style: meta.progressStyle
          })
        )

        notif.actions !== void 0 && child.push(
          h('div', {
            staticClass: meta.actionsClass
          }, notif.actions.map(action => h(QBtn, { ...action })))
        )

        meta.badge > 1 && child.push(
          h('div', {
            key: `${meta.uid}|${meta.badge}`,
            staticClass: meta.badgeClass,
            style: notif.badgeStyle
          }, [ meta.badge ])
        )

        return h('div', {
          ref: '' + meta.uid,
          key: meta.uid,
          staticClass: meta.staticClass,
          attrs: meta.attrs
        }, [
          h('div', { staticClass: meta.wrapperClass }, child)
        ])
      }))
    }))
  },

  mounted () {
    if (this.$q.fullscreen !== void 0 && this.$q.fullscreen.isCapable === true) {
      const append = () => {
        const newParent = getBodyFullscreenElement(this.$q.fullscreen.activeEl)

        if (this.$el.parentElement !== newParent) {
          newParent.appendChild(this.$el)
        }
      }

      this.unwatchFullscreen = this.$watch('$q.fullscreen.activeEl', debounce(append, 50))

      if (this.$q.fullscreen.isActive === true) {
        append()
      }
    }
  },

  beforeDestroy () {
    this.unwatchFullscreen !== void 0 && this.unwatchFullscreen()
  }
}

export default {
  setDefaults (opts) {
    if (isSSR !== true && isObject(opts) === true) {
      Object.assign(defaults, opts)
    }
  },

  registerType (typeName, typeOpts) {
    if (isSSR !== true && isObject(typeOpts) === true) {
      notifTypes[typeName] = typeOpts
    }
  },

  install ({ $q }) {
    $q.notify = this.create = isSSR === true
      ? noop
      : opts => addNotification(opts, vm)

    $q.notify.setDefaults = this.setDefaults
    $q.notify.registerType = this.registerType

    if ($q.config.notify !== void 0) {
      this.setDefaults($q.config.notify)
    }

    if (isSSR !== true) {
      positionList.forEach(pos => {
        notificationsList[pos] = []

        const
          vert = ['left', 'center', 'right'].includes(pos) === true ? 'center' : (pos.indexOf('top') > -1 ? 'top' : 'bottom'),
          align = pos.indexOf('left') > -1 ? 'start' : (pos.indexOf('right') > -1 ? 'end' : 'center'),
          classes = ['left', 'right'].includes(pos) ? `items-${pos === 'left' ? 'start' : 'end'} justify-center` : (pos === 'center' ? 'flex-center' : `items-${align}`)

        positionClass[pos] = `q-notifications__list q-notifications__list--${vert} fixed column no-wrap ${classes}`
      })

      const node = document.createElement('div')
      document.body.appendChild(node)

      vm = new Vue(Notifications)
      vm.$mount(node)
    }
  }
}
