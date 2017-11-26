export default function (Component, Vue) {
  return props => {
    const node = document.createElement('div')
    document.body.appendChild(node)

    return new Promise((resolve, reject) => {
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
