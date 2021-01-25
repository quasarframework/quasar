import { h, ref, defineComponent } from 'vue'
// import { useRoute } from 'vue-router'
import { useDialogPluginComponent, QDialog, QCard, QCardSection, QCardActions, QBtn, QSelect } from 'quasar'

const options = [ 'Option 1', 'Option 2', 'Option 3', 'Option 4', 'Option 5' ]

export default defineComponent({
  name: 'CustomDialogComponent',

  props: {
    text: {
      type: String,
      default: 'FAILED'
    }
  },

  emits: [ 'hide', 'ok' ],

  setup (props, { emit }) {
    const inc = ref(0)
    const sel = ref(null)

    // TODO vue3 - is there a way to pass through the provide/inject mechanism without using props (eg. route/router)
    // const $route = useRoute()

    const { dialogRef, onDialogHide, hide } = useDialogPluginComponent({ emit })

    function increment () {
      inc.value++
    }

    function onOKClick () {
      emit('ok')
      hide()
    }

    return () => h(QDialog, {
      ref: dialogRef,
      onHide: onDialogHide
    }, () => [
      h(QCard, {
        class: 'q-dialog-plugin'
      }, () => [
        h(QCardSection, {}, () => 'Prop "text": ' + props.text),

        // h(QCardSection, {}, () => 'Current route: ' + $route.path),

        h(QCardSection, {}, () => [
          h(QSelect, {
            label: 'Menu select',
            color: 'accent',
            options,
            modelValue: sel.value,
            behavior: 'menu',
            'onUpdate:modelValue': val => { sel.value = val }
          }),

          h(QSelect, {
            label: 'Dialog select',
            color: 'accent',
            options,
            modelValue: sel.value,
            behavior: 'dialog',
            'onUpdate:modelValue': val => { sel.value = val }
          })
        ]),

        h(QCardSection, {}, () => [
          'Reactivity:',

          h(QBtn, {
            class: 'q-ml-xs',
            label: 'Hit me: ' + inc.value,
            color: 'accent',
            noCaps: true,
            onClick: increment
          })
        ]),

        h(QCardActions, { align: 'right' }, () => [
          h(QBtn, {
            color: 'primary',
            label: 'OK',
            onClick: onOKClick
          }),

          h(QBtn, {
            color: 'primary',
            label: 'Cancel',
            onClick: hide
          })
        ])
      ])
    ])
  }
})
