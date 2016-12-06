<template>
  <table class="q-table horizontal-delimiter">
    <colgroup>
      <col v-if="selection" style="width: 45px;" />
      <col v-for="col in cols" :style="col.style" />
    </colgroup>
    <thead>
      <tr>
        <th v-if="selection"></th>
        <th
          v-for="(col, index) in cols"
          :class="{invisible: hidden(index), sortable: col.sort}"
          @click="sort(col)"
        >
          <span v-html="col.label"></span>
          <sort-icon
            v-if="col.sort"
            :field="col.field"
            :sorting="sorting"
          ></sort-icon>
        </th>
      </tr>
    </thead>

    <tbody v-if="!head">
      <slot></slot>
    </tbody>
  </table>
</template>

<script>
import SortIcon from '../sort/SortIcon.vue'

export default {
  props: {
    stickyCols: Number,
    cols: Array,
    head: Boolean,
    right: Boolean,
    sorting: Object,
    scroll: Object,
    selection: [String, Boolean]
  },
  data () {
    return {
      selected: false
    }
  },
  methods: {
    hidden (index) {
      if (this.right) {
        return this.cols.length - this.stickyCols > index
      }
      return index >= this.stickyCols
    },
    sort (col) {
      if (col.sort) {
        this.$emit('sort', col.field)
      }
    }
  },
  components: {
    SortIcon
  }
}
</script>
