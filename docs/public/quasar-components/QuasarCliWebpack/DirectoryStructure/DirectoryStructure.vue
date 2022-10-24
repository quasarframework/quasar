<template lang="pug">
q-tree(:nodes="nodes" node-key="id" default-expand-all :dark="dark" dense)
  template("v-slot:default-body"="prop")
    div(v-if="prop.node.comment") {{prop.node.comment}}
</template>

<script>
import directoryStructure from './DirecroryStructure.js'

let id = 0
const addId = node => {
  node.id = id++
  node.children?.forEach(addId)
}

addId(directoryStructure)

export default {
  name: 'DirectoryStructure',

  props: {
    dark: Boolean
  },

  setup () {
    return {
      nodes: [directoryStructure]
    }
  }
}
</script>
