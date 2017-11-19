import { QDialog } from '../components/dialog'
import { QBtn } from '../components/btn'

export default {
  __installed: false,
  install ({ Quasar, Vue }) {
    if (this.__installed) { return }
    this.__installed = true

    Quasar.dialog = props => {
      const node = document.createElement('div')
      document.body.appendChild(node)

      let form
      const vm = new Vue({
        el: node,
        data () {
          return { props }
        },
        render: h => h(QDialog, {
          props,
          ref: 'dialog',
          on: {
            hide: data => {
              form = data
              vm.$destroy()
            }
          },
          scopedSlots: {
            buttons: scope => props.buttons.map(
              btn => typeof btn === 'string'
                ? { label: btn }
                : btn
            ).map(btn => h(QBtn, {
              props: {
                color: btn.color || 'primary',
                flat: btn.flat || (!btn.raised && !btn.push && !btn.outline && !btn.rounded),
                push: btn.push,
                rounded: btn.rounded,
                outline: btn.outline,
                label: btn.label,
                icon: btn.icon
              },
              style: btn.style,
              'class': btn.classes,
              on: {
                click: () => {
                  scope.ok(btn.handler, btn.preventClose)
                }
              }
            }))
          }
        }),
        mounted () {
          this.$refs.dialog.show()
        }
      })

      return {
        vm,
        hide () {
          return vm.$refs.dialog
            ? vm.$refs.dialog.hide()
            : Promise.resolve(form)
        }
      }
    }
  }
}
