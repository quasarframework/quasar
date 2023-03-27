<template>
  <q-tree
    class="doc-tree"
    :nodes="nodes"
    node-key="id"
    children-key="c"
    default-expand-all
  >
    <template v-slot:default-header="prop">
      <div class="row items-center no-wrap">
        <div class="doc-tree__label text-no-wrap">{{ prop.node.l }}</div>

        <q-btn
          v-if="prop.node.url"
          class="doc-tree__btn q-ml-xs"
          padding="0"
          color="brand-accent"
          flat
          :icon="mdiLaunch"
          :href="prop.node.url"
          target="_blank"
          @click.stop
        />

        <div class="doc-tree__explanation text-grey q-ml-sm" v-if="prop.node.e"># {{ prop.node.e }}</div>
      </div>
    </template>
  </q-tree>
</template>

<script setup>
import { mdiLaunch } from '@quasar/extras/mdi-v6'

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
    font-size: ($font-size - 1px)
  &__btn .q-icon
    font-size: 17px
  &__explanation
    font-size: ($font-size - 3px)
    letter-spacing: .2px

  .q-tree__node
    padding: 0 0 3px 11px
    &:after
      left: -9px
  .q-tree__children
    padding-left: 19px
  .q-tree__node--parent
    padding-left: 4px
  .q-tree__node-header
    padding: 0 3px
    &:before
      left: -13px
  .q-tree__node--child
    padding-left: 10px
    > .q-tree__node-header:before
      left: -19px
      width: 15px
</style>
