<template>
  <div id="q-app">

    <QTree
      :nodes="simple"
      node-key="label"
      :extensions="extensions"
      drag-enabled
    />
  </div>
</template>

<script>
import dnd from '../../../src/components/tree/extensions/dnd.js'

export default {
  name: 'App',
  data () {
    return {
      extensions: [
        dnd({
          dropAreaClass: 'valid-drop-area',
          draggingClass: 'dragging-node',

          dropHandler: (sourceKey, sourceParentKey, destinationKey) => {
            if (sourceParentKey === destinationKey) return false

            console.log(this.simpleMap)
            const sourceParent = this.simpleMap[sourceParentKey]
            const source = this.simpleMap[sourceKey]

            const destination = this.simpleMap[destinationKey]

            sourceParent.children.splice(sourceParent.children.indexOf(source), 1)
            destination.children.push(source)

            return true
          }
        })
      ],
      simple: [
        {
          label: 'Satisfied customers',
          children: [
            {
              label: 'Good food',
              children: [
                {label: 'Quality ingredients'},
                {label: 'Good recipe'}
              ]
            },
            {
              label: 'Good drinks',
              children: [
                {label: 'Good beer'},
                {label: 'Good cider'},
                {label: 'Good tea (sic)'}
              ]
            },
            {
              label: 'Good service (disabled node)',
              disabled: true,
              children: [
                {label: 'Prompt attention'},
                {label: 'Professional waiter'}
              ]
            },
            {
              label: 'Pleasant surroundings',
              children: [
                {label: 'Happy atmosphere'},
                {label: 'Good table presentation'},
                {label: 'Pleasing decor'}
              ]
            }
          ]
        }
      ],
      simpleMap: {}
    }
  },
  methods: {
  },
  mounted () {
    const processNode = (node) => {
      this.simpleMap[node.label] = node

      if (node.children != null) {
        node.children.forEach(n => processNode(n))
      }
    }

    this.simple.forEach(n => processNode(n))
  }
}
</script>

<style>
  .dragging-node {
    opacity: 0.2;
  }

  .valid-drop-area {
    font-weight: bolder;
  }
</style>
