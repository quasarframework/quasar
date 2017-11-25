import { QAlert } from '../components/alert'
import { QTransition } from '../components/transition'
// import { QBtn } from '../components/btn'
import uid from '../utils/uid'

export default {
  create (opts) {
    this.__vm.add(opts)
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
          notif.__uid = uid()
          console.log(notif.position)
          const action = notif.position.indexOf('top') > -1 ? 'unshift' : 'push'
          this.notifs[notif.position][action](notif)
        },
        remove (notif) {
          const index = this.notifs[notif.position].indexOf(notif)
          if (index !== -1) {
            this.notifs[notif.position].splice(index, 1)
          }
        }
      },
      render (h) {
        return h('div', { staticClass: 'q-notifications' }, ['top-left', 'top-right', 'bottom-left', 'bottom-right', 'top', 'bottom', 'left', 'right', 'center'].map(pos => {
          const
            vert = ['left', 'center', 'right'].includes(pos) ? 'center' : (pos.indexOf('top') > -1 ? 'top' : 'bottom'),
            align = pos.indexOf('left') > -1 ? 'start' : (pos.indexOf('right') > -1 ? 'end' : 'center'),
            classes = ['left', 'right'].includes(pos) ? `items-${pos === 'left' ? 'start' : 'end'} justify-center` : (pos === 'center' ? 'flex-center' : `items-${align}`)

          return h(QTransition, {
            key: pos,
            staticClass: `q-notification-list-${vert} fixed column ${classes}`,
            props: {
              group: true,
              name: `q-notification-${pos}`,
              mode: 'out-in'
            }
          }, this.notifs[pos].map(notif => {
            return h(QAlert, {
              key: notif.__uid,
              staticClass: 'q-notification',
              props: {
                color: notif.color || 'primary',
                icon: notif.icon,
                actions: [ { label: 'Close', handler: () => { this.remove(notif) } } ]
              }
            }, [ notif.message ])
          }))
        }))
      }
    })

    this.__vm.$mount(node)
    $q.notify = this.create.bind(this)
  }
}
