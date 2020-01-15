export default {
  name: 'CustomDialogComponentNoParent',

  props: {
    text: String
  },

  data () {
    return {
      inc: 0
    }
  },

  methods: {
    show () {
      this.$refs.dialog.show()
    },

    hide () {
      this.$refs.dialog.hide()
    },

    increment () {
      this.inc++
    }
  },

  render (h) {
    return h('q-dialog', {
      ref: 'dialog',

      on: {
        hide: () => {
          this.$emit('hide')
        }
      }
    }, [
      h('q-card', {
        staticClass: 'q-dialog-plugin' +
          (this.dark === true ? ' q-dialog-plugin--dark' : '')
      }, [
        h('q-card-section', [
          'Custooom: ' + this.text
        ]),

        h('q-card-section', [
          'Reactivity:',

          h('q-btn', {
            staticClass: 'q-ml-xs',
            props: {
              label: 'Hit me: ' + this.inc,
              color: 'accent',
              noCaps: true
            },
            on: { click: this.increment }
          })
        ]),

        h('q-card-actions', {
          props: {
            align: 'right'
          }
        }, [
          h('q-btn', {
            props: {
              color: 'primary',
              label: 'OK'
            },
            on: {
              click: () => {
                this.$emit('ok')
                this.hide()
              }
            }
          }),

          h('q-btn', {
            props: {
              color: 'primary',
              label: 'Cancel'
            },
            on: {
              click: this.hide
            }
          })
        ])
      ])
    ])
  }
}
