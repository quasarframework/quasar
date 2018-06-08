import { isSSR } from '../plugins/platform'

export default function (Component, Vue) {
  return (props, resolver) => {
    return new Promise((resolve, reject) => {
      if (isSSR) { return reject(new Error()) }

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
            cancel: reason => {
              reject(reason || new Error())
              vm.$destroy()
            }
          }
        }),
        mounted () {
          this.$refs.modal.show()
        }
      })
      if (resolver) {
        resolver
          .then(data => {
            resolve(data)
            vm.$destroy()
          }).catch(reason => {
            reject(reason || new Error())
            vm.$destroy()
          })
      }
    })
  }
}
