<template lang="pug">
q-tree.doc-tree(:nodes="nodes" node-key="id" children-key="c" default-expand-all dense)
  template("v-slot:default-header"="prop")
    .row.items-center.no-wrap
      .doc-tree__label.text-weight-bold.text-no-wrap
        doc-link(v-if="prop.node.r" :to="prop.node.r") {{ prop.node.l }}
        template(v-else) {{ prop.node.l }}
      .doc-tree__explanation.text-grey.q-ml-sm(v-if="prop.node.e") # {{ prop.node.e }}
</template>

<script>
export default {
  name: 'DocTree',

  props: {
    def: Object
  },

  setup (props) {
    let id = 0
    const addId = node => {
      node.id = id++
      if (node.c !== void 0) {
        node.l += '/'
        node.c.forEach(addId)
      }
      return node
    }

    return {
      nodes: [addId(props.def)]
    }
  }
}
</script>

<style lang="sass">
.doc-tree
  &__label
    font-size: .9em
  &__explanation
    font-size: .7em
  & .q-icon
    font-size: 0.9em
    margin-top: -2px
</style>
