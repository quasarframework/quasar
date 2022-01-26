import { h, ref, defineComponent } from 'vue'
import { useRoute } from 'vue-router'
import { useQuasar, useDialogPluginComponent, QDialog, QCard, QCardSection, QCardActions, QBtn, QSelect } from 'quasar'

const options = [ 'Option 1', 'Option 2', 'Option 3', 'Option 4', 'Option 5' ]

console.log(useDialogPluginComponent.emits)

export default defineComponent({
  name: 'CustomDialogComponent',

  props: {
    text: {
      type: String,
      default: 'FAILED'
    }
  },

  emits: [ ...useDialogPluginComponent.emits ],

  setup (props) {
    const inc = ref(0)
    const sel = ref(null)

    const $q = useQuasar()
    const $route = useRoute()

    const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent()

    function increment () {
      inc.value++
    }

    function onOK () {
      onDialogOK(inc.value)
    }

    return () => h(QDialog, {
      ref: dialogRef,
      onHide: onDialogHide
    }, () => [
      h(QCard, {
        class: 'q-dialog-plugin'
      }, () => [
        h(QCardSection, {}, () => [
          h('div', 'Prop "text": ' + props.text),
          h('div', 'Quasar v' + $q.version),
          h('div', 'Current route: ' + $route.path)
        ]),

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
            onClick: onOK
          }),

          h(QBtn, {
            color: 'primary',
            label: 'Cancel',
            onClick: onDialogCancel
          })
        ])
      ])
    ])
  }
})
