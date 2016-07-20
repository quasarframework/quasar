<template>
  <div class="quasar-tree">
    <ul>
      <tree-item
        v-for="item in model"
        :model="item"
        :contract-html="contractHtml"
        :expand-html="expandHtml"
      ></tree-item>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    model: {
      type: Array,
      required: true
    },
    contractHtml: {
      type: String,
      required: true
    },
    expandHtml: {
      type: String,
      required: true
    }
  }
}
</script>
