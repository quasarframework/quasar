<template>
  <table class="q-table horizontal-delimiter" :style="tableStyle">
    <colgroup>
      <col v-if="selection" style="width: 45px;" />
      <col v-for="col in cols" :style="col.style" />
      <col v-if="head && scroll.horiz" :style="{width: scroll.horiz}" />
    </colgroup>
    <thead v-if="head">
      <tr>
        <th v-if="selection"></th>
        <th v-for="col in cols">
          <span v-html="col.label"></span>
          <sort-icon
            v-if="col.sort"
            @click.native="$emit('sort', col.field)"
            :field="col.field"
            :sorting="sorting"
          />
        </th>
        <th v-if="head && scroll.horiz"></th>
      </tr>
    </thead>
    <tbody v-else>
      <slot></slot>
    </tbody>
  </table>
</template>

<script>
import SortIcon from './plugins/sort/SortIcon.vue'

export default {
  props: {
    cols: Array,
    head: Boolean,
    sorting: Object,
    scroll: Object,
    selection: [String, Boolean]
  },
  computed: {
    padding () {
      return this.scroll.horiz || this.scroll.vert
    },
    tableStyle () {
      return {
        width: this.head && this.padding ? `calc(100% - ${this.scroll.vert})` : '100%'
      }
    }
  },
  components: {
    SortIcon
  }
}
</script>
