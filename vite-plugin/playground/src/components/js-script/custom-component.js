import { defineComponent, h } from 'vue'
import { QBtn as Mimi } from 'quasar'

export default defineComponent({
  setup () {
    return () => h(Mimi, { label: 'Custom - Click me' })
  }
})
