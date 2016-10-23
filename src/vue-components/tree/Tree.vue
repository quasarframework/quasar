<template>
  <div class="quasar-tree">
    <ul>
      <quasar-tree-item
        v-for="item in model"
        :model="item"
        :contract-html="contractHtml"
        :expand-html="expandHtml"
      ></quasar-tree-item>
    </ul>
  </div>
</template>

<script>
import QuasarTreeItem from './TreeItem.vue'

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
    QuasarTreeItem
  }
}
</script>
