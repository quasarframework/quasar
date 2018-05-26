import { isSSR } from '../plugins/platform'

export default function (Component, Vue) {
  return props => {
    return new Promise((resolve, reject) => {
      if (isSSR) { return }

      const node = document.createElement('div')
      document.body.appendChild(node)

      const vm = new Vue({
        el: node,
        data () {
          return { props }
        },
        render: h => h(Component, {
          props,
          ref: 'modal',
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
          this.$refs.modal.show()
        }
      })
    })
  }
}
