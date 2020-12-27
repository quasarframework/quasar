export default {
  name: 'CustomDialogComponentWithParent',

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

  data () {
    return {
      inc: 0,
      sel: null,
      options: [ 'Option 1', 'Option 2', 'Option 3', 'Option 4', 'Option 5' ]
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
          'Current route: ' + this.$route.path
        ]),

        h('q-card-section', [
          h('test-component')
        ]),

        h('q-card-section', [
          h('q-select', {
            props: {
              label: 'Menu select',
              color: 'accent',
              options: this.options,
              value: this.sel,
              behavior: 'menu'
            },
            on: { input: val => { this.sel = val } }
          }),

          h('q-select', {
            props: {
              label: 'Dialog select',
              color: 'accent',
              options: this.options,
              value: this.sel,
              behavior: 'dialog'
            },
            on: { input: val => { this.sel = val } }
          })
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
