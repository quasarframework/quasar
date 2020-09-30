import { h, defineComponent } from 'vue'

const space = h('div', { class: 'q-space' })

export default defineComponent({
  name: 'QSpace',

  render () {
    return space
  }
})
