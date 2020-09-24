import { h } from 'vue'

export default function (conf, content) {
  return h('div', conf, [
    h('table', { class: 'q-table' }, content)
  ])
}
