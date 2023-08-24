<template>
  <div class="q-pa-md q-gutter-sm">
    <q-tree
      :nodes="lazy"
      default-expand-all
      node-key="label"
      @lazy-load="onLazyLoad"
    />
  </div>
</template>

<script>
import { ref } from 'vue'

const nodes = [
  {
    label: 'Node 1',
    children: [
      { label: 'Node 1.1', lazy: true },
      { label: 'Node 1.2', lazy: true }
    ]
  },
  {
    label: 'Node 2',
    lazy: true
  },
  {
    label: 'Lazy load empty',
    lazy: true
  },
  {
    label: 'Node is not expandable',
    expandable: false,
    children: [
      { label: 'Some node' }
    ]
  }
]

export default {
  setup () {
    return {
      lazy: ref(nodes),

      onLazyLoad ({ node, key, done, fail }) {
        // call fail() if any error occurs

        setTimeout(() => {
          // simulate loading and setting an empty node
          if (key.indexOf('Lazy load empty') > -1) {
            done([])
            return
          }

          const label = node.label
          done([
            { label: `${label}.1` },
            { label: `${label}.2`, lazy: true },
            {
              label: `${label}.3`,
              children: [
                { label: `${label}.3.1`, lazy: true },
                { label: `${label}.3.2`, lazy: true }
              ]
            }
          ])
        }, 1000)
      }
    }
  }
}
</script>
