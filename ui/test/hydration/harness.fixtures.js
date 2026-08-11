import { h } from 'vue'

// renders differently on purpose; proves the harness surfaces Vue's
// hydration mismatch warnings instead of passing vacuously
export const mismatch = {
  render: () =>
    h('div', typeof window === 'undefined' ? 'server text' : 'client text')
}
