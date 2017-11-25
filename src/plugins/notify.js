// import { QAlert } from '../components/alert'
import { QTransition } from '../components/transition'
import { QBtn } from '../components/btn'
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
        return h('div', { staticClass: 'q-notifications' }, ['top', 'top-left', 'top-right', 'bottom', 'bottom-left', 'bottom-right'].map(pos => {
          const
            vert = pos.indexOf('top') > -1 ? 'top' : 'bottom',
            align = pos.indexOf('left') > -1 ? 'start' : (pos.indexOf('right') > -1 ? 'end' : 'center')

          return h(QTransition, {
            key: pos,
            staticClass: `q-notification-list-${vert} fixed column items-${align}`,
            props: {
              group: true,
              name: `q-notification-${pos}`,
              mode: 'out-in'
            }
          }, this.notifs[pos].map(notif => {
            return h('div', { staticClass: 'q-notification', key: notif.__uid }, [
              h('div', [
                notif.__uid,
                h(QBtn, {
                  props: {
                    color: 'primary',
                    label: 'close'
                  },
                  on: {
                    click: () => {
                      this.remove(notif)
                    }
                  }
                })
              ])
            ])
          }))
        }))
      }
    })

    this.__vm.$mount(node)
    $q.notify = this.create.bind(this)
  }
}
