import { QAlert } from '../components/alert'
import { QTransition } from '../components/transition'
import uid from '../utils/uid'
import clone from '../utils/clone'

const positionList = [
  'top-left', 'top-right',
  'bottom-left', 'bottom-right',
  'top', 'bottom', 'left', 'right', 'center'
]

export default {
  create (opts) {
    return this.__vm.add(opts)
  },

  __installed: false,
  install ({ $q, Vue }) {
    if (this.__installed) { return }
    this.__installed = true

    const node = document.createElement('div')
    document.body.appendChild(node)

    this.__vm = new Vue({
      name: 'q-notifications',
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
        add (notif) {
          if (!notif) {
            console.error('Notify: parameter required')
            return false
          }
          if (typeof notif === 'string') {
            notif = {
              message: notif,
              position: 'bottom'
            }
          }
          else if (notif.position) {
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

          if (notif.actions) {
            notif.actions = clone(notif.actions).map(action => {
              const handler = action.handler
              action.handler = () => {
                close()
                if (typeof handler === 'function') {
                  handler()
                }
              }
              return action
            })
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

          const action = notif.position.indexOf('top') > -1 ? 'unshift' : 'push'
          this.notifs[notif.position][action](notif)

          return close
        },
        remove (notif) {
          if (notif.__timeout) { clearTimeout(notif.__timeout) }

          const index = this.notifs[notif.position].indexOf(notif)
          if (index !== -1) {
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

          return h(QTransition, {
            key: pos,
            staticClass: `q-notification-list q-notification-list-${vert} fixed column ${classes}`,
            tag: 'div',
            props: {
              group: true,
              name: `q-notification-${pos}`,
              mode: 'out-in'
            }
          }, this.notifs[pos].map(notif => {
            return h(QAlert, {
              key: notif.__uid,
              staticClass: 'q-notification',
              props: notif
            }, [ notif.message ])
          }))
        }))
      }
    })

    this.__vm.$mount(node)
    $q.notify = this.create.bind(this)
  }
}
