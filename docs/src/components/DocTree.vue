<template>
  <q-tree
    class="doc-tree"
    :nodes="nodes"
    node-key="id"
    children-key="c"
    default-expand-all
    dense
  >
    <template v-slot:default-header="prop">
      <div class="row items-center no-wrap">
        <div class="doc-tree__label text-weight-bold text-no-wrap">{{ prop.node.l }}</div>
        <div class="doc-tree__explanation text-grey q-ml-sm" v-if="prop.node.e"># {{ prop.node.e }}</div>
      </div>
    </template>
  </q-tree>
</template>

<script setup>
const props = defineProps({
  def: Object
})

let id = 0
const addId = node => {
  node.id = id++
  if (node.c !== void 0) {
    node.l += '/'
    node.c.forEach(addId)
  }
  return node
}

const nodes = [addId(props.def)]
</script>

<style lang="sass">
.doc-tree
  &__label
    font-size: .9em
  &__explanation
    font-size: .7em
</style>
