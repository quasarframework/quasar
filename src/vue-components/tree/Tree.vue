<template>
  <div class="q-tree">
    <ul>
      <q-tree-item
        v-for="item in model"
        :model="item"
        :contract-html="contractHtml"
        :expand-html="expandHtml"
      ></q-tree-item>
    </ul>
  </div>
</template>

<script>
import QTreeItem from './TreeItem.vue'

export default {
  props: {
    model: {
      type: Array,
      required: true
    },
    contractHtml: {
      type: String,
      required: true,
      default: '<i>remove_circle</i>'
    },
    expandHtml: {
      type: String,
      required: true,
      default: '<i>add_circle</i>'
    }
  },
  components: {
    QTreeItem
  }
}
</script>
