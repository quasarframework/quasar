import Vue from 'vue'

import QAvatar from '../components/avatar/QAvatar.js'
import QIcon from '../components/icon/QIcon.js'
import QBtn from '../components/btn/QBtn.js'

import uid from '../utils/uid.js'
import clone from '../utils/clone.js'
import { isSSR } from './Platform.js'

let defaults = {}

const positionList = [
  'top-left', 'top-right',
  'bottom-left', 'bottom-right',
  'top', 'bottom', 'left', 'right', 'center'
]

const Notifications = {
  name: 'QNotifications',

  data: {
    notifs: {
      center: [],
      left: [],
      right: [],
      top: [],
      'top-left': [],
      'top-right': [],
      bottom: [],
      'bottom-left': [],
      'bottom-right': []
    }
  },

  methods: {
    add (config) {
      if (!config) {
        console.error('Notify: parameter required')
        return false
      }

      const notif = Object.assign(
        { textColor: 'white' },
        defaults,
        typeof config === 'string'
          ? { message: config }
          : clone(config)
      )

      if (notif.position) {
        if (!positionList.includes(notif.position)) {
          console.error(`Notify: wrong position: ${notif.position}`)
          return false
        }
      }
      else {
        notif.position = 'bottom'
      }

      notif.__uid = uid()

      if (notif.timeout === void 0) {
        notif.timeout = 5000
      }

      const close = () => {
        this.remove(notif)
      }

      if (config.actions) {
        notif.actions = config.actions.map(item => {
          const
            handler = item.handler,
            action = clone(item)

          action.handler = typeof handler === 'function'
            ? () => {
              handler()
              !item.noDismiss && close()
            }
            : () => close()

          return action
        })
      }

      if (typeof config.onDismiss === 'function') {
        notif.onDismiss = config.onDismiss
      }

      if (notif.closeBtn) {
        const btn = [{
          closeBtn: true,
          label: notif.closeBtn,
          handler: close
        }]
        notif.actions = notif.actions
          ? notif.actions.concat(btn)
          : btn
      }

      if (notif.timeout) {
        notif.__timeout = setTimeout(() => {
          close()
        }, notif.timeout + /* show duration */ 1000)
      }

      if (notif.multiLine === void 0 && notif.actions) {
        notif.multiLine = notif.actions.length > 1
      }

      notif.staticClass = [
        `q-notification generic-border-radius row items-center`,
        notif.color && `bg-${notif.color}`,
        notif.textColor && `text-${notif.textColor}`,
        `q-notification--${notif.multiLine ? 'multi-line' : 'standard'}`,
        notif.classes
      ].filter(n => n).join(' ')

      const action = notif.position.indexOf('top') > -1 ? 'unshift' : 'push'
      this.notifs[notif.position][action](notif)

      return close
    },

    remove (notif) {
      if (notif.__timeout) { clearTimeout(notif.__timeout) }

      const index = this.notifs[notif.position].indexOf(notif)
      if (index !== -1) {
        const el = this.$refs[`notif_${notif.__uid}`]

        if (el) {
          const { width, height } = getComputedStyle(el)

          el.style.left = `${el.offsetLeft}px`
          el.style.width = width
          el.style.height = height
        }

        this.notifs[notif.position].splice(index, 1)
        if (typeof notif.onDismiss === 'function') {
          notif.onDismiss()
        }
      }
    }
  },

  render (h) {
    return h('div', { staticClass: 'q-notifications' }, positionList.map(pos => {
      const
        vert = ['left', 'center', 'right'].includes(pos) ? 'center' : (pos.indexOf('top') > -1 ? 'top' : 'bottom'),
        align = pos.indexOf('left') > -1 ? 'start' : (pos.indexOf('right') > -1 ? 'end' : 'center'),
        classes = ['left', 'right'].includes(pos) ? `items-${pos === 'left' ? 'start' : 'end'} justify-center` : (pos === 'center' ? 'flex-center' : `items-${align}`)

      return h('transition-group', {
        key: pos,
        staticClass: `q-notifications__list q-notifications__list--${vert} fixed column ${classes}`,
        tag: 'div',
        props: {
          name: `q-notification--${pos}`,
          mode: 'out-in'
        }
      }, this.notifs[pos].map(notif => {
        return h('div', {
          ref: `notif_${notif.__uid}`,
          key: notif.__uid,
          staticClass: notif.staticClass
        }, [

          h('div', { staticClass: 'row items-center ' + (notif.multiLine ? 'col-12' : 'col') }, [
            notif.icon ? h(QIcon, {
              staticClass: 'q-notification__icon col-auto',
              props: { name: notif.icon }
            }) : null,

            notif.avatar ? h(QAvatar, { staticClass: 'q-notification__avatar col-auto' }, [
              h('img', { attrs: { src: notif.avatar } })
            ]) : null,

            h('div', { staticClass: 'q-notification__message col' }, [ notif.message ])
          ]),

          notif.actions ? h('div', {
            staticClass: 'q-notification__actions row items-center ' + (notif.multiLine ? 'col-12 justify-end' : 'col-auto')
          }, notif.actions.map(action => h(QBtn, {
            props: { flat: true, ...action },
            on: { click: action.handler }
          }))) : null

        ])
      }))
    }))
  }
}

function init () {
  const node = document.createElement('div')
  document.body.appendChild(node)

  this.__vm = new Vue(Notifications)
  this.__vm.$mount(node)
}

export default {
  create (opts) {
    if (isSSR) { return () => {} }
    return this.__vm.add(opts)
  },
  setDefaults (opts) {
    Object.assign(defaults, opts)
  },

  install (args) {
    if (isSSR) {
      args.$q.notify = () => {}
      args.$q.notify.setDefaults = () => {}
      return
    }

    init.call(this, args)

    args.cfg.notify && this.setDefaults(args.cfg.notify)

    args.$q.notify = this.create.bind(this)
    args.$q.notify.setDefaults = this.setDefaults
  }
}
