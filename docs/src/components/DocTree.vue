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

        <q-btn
          v-if="prop.node.url"
          class="doc-tree__btn q-ml-xs"
          size="9px"
          color="brand-accent"
          :icon="mdiLaunch"
          unelevated
          dense
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
    font-size: .9em
  &__btn .q-icon
    font-size: 12px
  &__explanation
    font-size: .7em
</style>
