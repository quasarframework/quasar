import Vue from 'vue'

import QAvatar from '../components/avatar/QAvatar.js'
import QIcon from '../components/icon/QIcon.js'
import QBtn from '../components/btn/QBtn.js'

import { noop } from '../utils/event.js'
import { getBodyFullscreenElement } from '../utils/dom.js'
import { isSSR } from './Platform.js'

let uid = 0
const defaults = {}

const attrs = { role: 'alert' }

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
    icon () { return this.$q.iconSet.type.positive },
    color: 'positive'
  },

  negative: {
    icon () { return this.$q.iconSet.type.negative },
    color: 'negative'
  },

  warning: {
    icon () { return this.$q.iconSet.type.warning },
    color: 'warning',
    textColor: 'dark'
  },

  info: {
    icon () { return this.$q.iconSet.type.info },
    color: 'info'
  }
}

const groups = {}
const positionClass = {}

const Notifications = {
  name: 'QNotifications',

  created () {
    this.notifs = {}

    positionList.forEach(pos => {
      this.notifs[pos] = []

      const
        vert = ['left', 'center', 'right'].includes(pos) ? 'center' : (pos.indexOf('top') > -1 ? 'top' : 'bottom'),
        align = pos.indexOf('left') > -1 ? 'start' : (pos.indexOf('right') > -1 ? 'end' : 'center'),
        classes = ['left', 'right'].includes(pos) ? `items-${pos === 'left' ? 'start' : 'end'} justify-center` : (pos === 'center' ? 'flex-center' : `items-${align}`)

      positionClass[pos] = `q-notifications__list q-notifications__list--${vert} fixed column no-wrap ${classes}`
    })
  },

  methods: {
    add (config) {
      if (!config) {
        console.error('Notify: parameter required')
        return false
      }

      const notif = { textColor: 'white' }

      if (typeof config === 'string' || config.ignoreDefaults !== true) {
        Object.assign(notif, defaults)
      }

      if (Object(config) === config) {
        Object.assign(notif, notifTypes[config.type], config)

        if (typeof notif.icon === 'function') {
          notif.icon = notif.icon.call(this)
        }
      }
      else {
        notif.message = config
      }

      notif.meta = {
        hasMedia: Boolean(notif.icon || notif.avatar)
      }

      if (notif.position) {
        if (positionList.includes(notif.position) === false) {
          console.error(`Notify: wrong position: ${notif.position}`)
          return false
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
          console.error(`Notify: wrong timeout: ${notif.timeout}`)
          return false
        }
        notif.timeout = t
      }

      if (notif.timeout === 0) {
        notif.progress = false
      }
      else if (notif.progress === true) {
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

      notif.closeBtn && actions.push({
        label: typeof notif.closeBtn === 'string'
          ? notif.closeBtn
          : this.$q.lang.label.close
      })

      notif.actions = actions.map(({ handler, noDismiss, ...item }) => ({
        props: { flat: true, ...item },
        on: {
          click: typeof handler === 'function'
            ? () => {
              handler()
              noDismiss !== true && notif.meta.close()
            }
            : () => {
              notif.meta.close()
            }
        }
      }))

      if (notif.multiLine === void 0) {
        notif.multiLine = notif.actions.length > 1
      }

      Object.assign(notif.meta, {
        staticClass: `q-notification row items-stretch` +
          ` q-notification--${notif.multiLine === true ? 'multi-line' : 'standard'}` +
          (notif.color !== void 0 ? ` bg-${notif.color}` : '') +
          (notif.textColor !== void 0 ? ` text-${notif.textColor}` : '') +
          (notif.classes !== void 0 ? ` ${notif.classes}` : ''),

        wrapperClass: 'q-notification__wrapper col relative-position border-radius-inherit ' +
          (notif.multiLine === true ? 'column no-wrap justify-center' : 'row items-center'),

        contentClass: 'q-notification__content row items-center' +
          (notif.multiLine === true ? '' : ' col')
      })

      if (notif.group === false) {
        notif.group = void 0
      }
      else {
        if (notif.group === void 0 || notif.group === true) {
          // do not replace notifications with different buttons
          notif.group = [
            notif.message,
            notif.caption,
            notif.multiline
          ].concat(
            notif.actions.map(a => `${a.props.label}*${a.props.icon}`)
          ).join('|')
        }

        notif.group += '|' + notif.position
      }

      if (notif.actions.length === 0) {
        notif.actions = void 0
      }
      else {
        notif.meta.actionsClass = 'q-notification__actions row items-center ' +
          (notif.multiLine === true ? 'justify-end' : 'col-auto') +
          (notif.meta.hasMedia === true ? ' q-notification__actions--with-media' : '')
      }

      const groupNotif = groups[notif.group]

      // wohoo, new notification
      if (groupNotif === void 0) {
        notif.meta.uid = uid++
        notif.meta.badge = 1

        if (['left', 'right', 'center'].indexOf(notif.position) !== -1) {
          this.notifs[notif.position].splice(
            Math.floor(this.notifs[notif.position].length / 2),
            0,
            notif
          )
        }
        else {
          const action = notif.position.indexOf('top') > -1 ? 'unshift' : 'push'
          this.notifs[notif.position][action](notif)
        }

        if (notif.group !== void 0) {
          groups[notif.group] = notif
        }
      }
      // ok, so it's NOT a new one
      else {
        // reset timeout if any
        if (groupNotif.meta.timer !== void 0) {
          clearTimeout(groupNotif.meta.timer)
        }

        const original = groups[notif.group]

        if (notif.badgePosition !== void 0) {
          if (badgePositions.includes(notif.badgePosition) === false) {
            console.error(`Notify - wrong badgePosition specified: ${notif.badgePosition}`)
            return false
          }
        }
        else {
          notif.badgePosition = `top-${notif.position.indexOf('left') > -1 ? 'right' : 'left'}`
        }

        notif.meta.uid = original.meta.uid
        notif.meta.badge = original.meta.badge + 1
        notif.meta.badgeStaticClass = `q-notification__badge q-notification__badge--${notif.badgePosition}` +
          (notif.badgeColor !== void 0 ? ` bg-${notif.badgeColor}` : '') +
          (notif.badgeTextColor !== void 0 ? ` text-${notif.badgeTextColor}` : '')

        const index = this.notifs[notif.position].indexOf(original)
        this.notifs[notif.position][index] = groups[notif.group] = notif
      }

      notif.meta.close = () => {
        this.remove(notif)
      }

      this.$forceUpdate()

      if (notif.timeout > 0) {
        notif.meta.timer = setTimeout(() => {
          notif.meta.close()
        }, notif.timeout + /* show duration */ 1000)
      }

      return notif.meta.close
    },

    remove (notif) {
      clearTimeout(notif.meta.timer)

      const index = this.notifs[notif.position].indexOf(notif)
      if (index !== -1) {
        if (notif.group !== void 0) {
          delete groups[notif.group]
        }

        const el = this.$refs[`notif_${notif.meta.uid}`]

        if (el) {
          const { width, height } = getComputedStyle(el)

          el.style.left = `${el.offsetLeft}px`
          el.style.width = width
          el.style.height = height
        }

        this.notifs[notif.position].splice(index, 1)

        this.$forceUpdate()

        if (typeof notif.onDismiss === 'function') {
          notif.onDismiss()
        }
      }
    }
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
      }, this.notifs[pos].map(notif => {
        let msgChild

        const meta = notif.meta
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
              h('div', { staticClass: 'q-notification__caption' }, [ notif.caption ])
            ]
            : msgNode
        }

        const mainChild = []

        if (meta.hasMedia === true) {
          if (notif.icon) {
            mainChild.push(
              h(QIcon, {
                staticClass: 'q-notification__icon',
                attrs: { role: 'img' },
                props: { name: notif.icon }
              })
            )
          }
          else if (notif.avatar) {
            mainChild.push(
              h(QAvatar, { staticClass: 'q-notification__avatar col-auto' }, [
                h('img', { attrs: { src: notif.avatar, 'aria-hidden': 'true' } })
              ])
            )
          }
        }

        mainChild.push(
          h('div', msgData, msgChild)
        )

        const child = [
          h('div', { staticClass: meta.contentClass }, mainChild)
        ]

        notif.progress === true && child.push(
          h('div', {
            key: `${meta.uid}|p|${meta.badge}`,
            staticClass: 'q-notification__progress',
            style: meta.progressStyle,
            class: notif.progressClass
          })
        )

        notif.actions !== void 0 && child.push(
          h('div', {
            staticClass: meta.actionsClass
          }, notif.actions.map(a => h(QBtn, { props: a.props, on: a.on })))
        )

        meta.badge > 1 && child.push(
          h('div', {
            key: `${meta.uid}|${meta.badge}`,
            staticClass: meta.badgeStaticClass,
            style: notif.badgeStyle,
            class: notif.badgeClass
          }, [ meta.badge ])
        )

        return h('div', {
          ref: `notif_${meta.uid}`,
          key: meta.uid,
          staticClass: meta.staticClass,
          attrs
        }, [
          h('div', { staticClass: meta.wrapperClass }, child)
        ])
      }))
    }))
  },

  mounted () {
    if (this.$q.fullscreen !== void 0 && this.$q.fullscreen.isCapable === true) {
      const append = isFullscreen => {
        const newParent = getBodyFullscreenElement(
          isFullscreen,
          this.$q.fullscreen.activeEl
        )

        if (this.$el.parentElement !== newParent) {
          newParent.appendChild(this.$el)
        }
      }

      this.unwatchFullscreen = this.$watch('$q.fullscreen.isActive', append)

      if (this.$q.fullscreen.isActive === true) {
        append(true)
      }
    }
  },

  beforeDestroy () {
    this.unwatchFullscreen !== void 0 && this.unwatchFullscreen()
  }
}

export default {
  create (opts) {
    if (isSSR === true) { return noop }
    return this.__vm.add(opts)
  },
  setDefaults (opts) {
    opts === Object(opts) && Object.assign(defaults, opts)
  },
  registerType (typeName, typeOpts) {
    if (isSSR !== true && typeOpts === Object(typeOpts)) {
      notifTypes[typeName] = typeOpts
    }
  },

  install ({ cfg, $q }) {
    if (isSSR === true) {
      $q.notify = noop
      $q.notify.setDefaults = noop
      return
    }

    this.setDefaults(cfg.notify)

    $q.notify = this.create.bind(this)
    $q.notify.setDefaults = this.setDefaults
    $q.notify.registerType = this.registerType

    const node = document.createElement('div')
    document.body.appendChild(node)

    this.__vm = new Vue(Notifications)
    this.__vm.$mount(node)
  }
}
