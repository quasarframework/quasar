<template>
  <div class="q-tree">
    <ul>
      <q-tree-item
        v-for="item in model"
        :key="item"
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
  name: 'q-tree',
  components: {
    QTreeItem
  },
  props: {
    model: {
      type: Array,
      required: true
    },
    contractHtml: {
      type: String,
      required: true,
      default: '<i class="material-icons">remove_circle</i>'
    },
    expandHtml: {
      type: String,
      required: true,
      default: '<i class="material-icons">add_circle</i>'
    }
  }
}
</script>
