<template lang="pug">
q-tree(:nodes="nodes" node-key="id" default-expand-all dense)
  template("v-slot:default-body"="prop")
    div(v-if="prop.node.comment") {{prop.node.comment}}
</template>

<script>
export default {
  name: 'DirectoryStructure',

  props: {
    structure: Object
  },

  setup (props) {
    let id = 0
    const addId = node => {
      node.id = id++
      node.children?.forEach(addId)
      return node
    }

    return {
      nodes: [addId(props.structure)]
    }
  }
}
</script>
