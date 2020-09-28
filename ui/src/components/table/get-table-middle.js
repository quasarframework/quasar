import { h } from 'vue'

export default function (props, content) {
  return h('div', props, [
    h('table', { class: 'q-table' }, content)
  ])
}
