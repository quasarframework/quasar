export default {
  name: 'CustomDialogComponent',

  props: {
    text: String
  },

  components: {
    TestComponent: {
      inject: {
        providedTest: {
          default: 'Provide/Inject DOES NOT WORKS'
        }
      },
      render (h) {
        return h('div', [ this.providedTest ])
      }
    }
  },

  methods: {
    show () {
      this.$refs.dialog.show()
    },

    hide () {
      this.$refs.dialog.hide()
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
          'Current route: ' + this.$route.path
        ]),

        h('q-card-section', [
          h('test-component')
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
