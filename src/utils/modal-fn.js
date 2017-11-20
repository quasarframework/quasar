export default function (Component, Vue) {
  return props => {
    const node = document.createElement('div')
    document.body.appendChild(node)

    return new Promise((resolve, reject) => {
      console.log(Vue)
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
              console.log('modalfn received ok, destroying')
              resolve(data)
              vm.$destroy()
            },
            cancel: () => {
              console.log('modalfn received cancel, destroying')
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
