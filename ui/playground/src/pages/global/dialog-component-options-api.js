import { h, defineComponent } from 'vue'
import { QDialog, QCard, QCardSection, QCardActions, QBtn, QSelect } from 'quasar'

export default defineComponent({
  name: 'CustomDialogComponent',

  props: {
    text: {
      type: String,
      default: 'FAILED'
    }
  },

  emits: [ 'hide', 'ok' ],

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

  render () {
    return h(QDialog, {
      ref: 'dialog',
      onHide: () => {
        this.$emit('hide')
      }
    }, () => [
      h(QCard, {
        class: 'q-dialog-plugin'
      }, () => [
        h(QCardSection, {}, () => [
          h('div', 'Prop "text": ' + this.text),
          h('div', 'Quasar v' + this.$q.version),
          h('div', 'Current route: ' + this.$route.path)
        ]),

        h(QCardSection, {}, () => [
          h(QSelect, {
            label: 'Menu select',
            color: 'accent',
            options: this.options,
            modelValue: this.sel,
            behavior: 'menu',
            'onUpdate:modelValue': val => { this.sel = val }
          }),

          h(QSelect, {
            label: 'Dialog select',
            color: 'accent',
            options: this.options,
            modelValue: this.sel,
            behavior: 'dialog',
            'onUpdate:modelValue': val => { this.sel = val }
          })
        ]),

        h(QCardSection, {}, () => [
          'Reactivity:',

          h(QBtn, {
            class: 'q-ml-xs',
            label: 'Hit me: ' + this.inc,
            color: 'accent',
            noCaps: true,
            onClick: this.increment
          })
        ]),

        h(QCardActions, { align: 'right' }, () => [
          h(QBtn, {
            color: 'primary',
            label: 'OK',
            onClick: () => {
              this.$emit('ok', this.inc)
              this.hide()
            }
          }),

          h(QBtn, {
            color: 'primary',
            label: 'Cancel',
            onClick: this.hide
          })
        ])
      ])
    ])
  }
})
