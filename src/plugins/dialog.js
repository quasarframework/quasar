import { QDialog } from '../components/dialog'

export default {
  __installed: false,
  install ({ Quasar, Vue }) {
    if (this.__installed) { return }
    this.__installed = true

    Quasar.dialog = props => {
      const node = document.createElement('div')
      document.body.appendChild(node)

      return new Promise((resolve, reject) => {
        const vm = new Vue({
          el: node,
          data () {
            return { props }
          },
          render: h => h(QDialog, {
            props,
            ref: 'dialog',
            on: {
              ok: data => {
                resolve(data)
                vm.$destroy()
              },
              cancel: () => {
                reject(new Error())
                vm.$destroy()
              }
            }
          }),
          mounted () {
            this.$refs.dialog.show()
          }
        })
      })
    }
  }
}
