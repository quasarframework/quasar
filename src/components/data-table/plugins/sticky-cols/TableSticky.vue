<template>
  <table class="q-table horizontal-separator">
    <colgroup>
      <col v-if="selection" style="width: 45px;" />
      <col v-for="col in cols" :style="{width: col.width}" />
    </colgroup>
    <thead v-if="!noHeader">
      <tr>
        <th v-if="selection">&nbsp;</th>
        <th
          v-for="(col, index) in cols"
          :class="{invisible: hidden(index), sortable: col.sort}"
          @click="sort(col)"
        >
          <template v-if="!hidden(index)">
            <sort-icon
              v-if="col.sort"
              :field="col.field"
              :sorting="sorting"
            ></sort-icon>
            <span v-html="col.label"></span>
            <q-tooltip v-if="col.label" v-html="col.label"></q-tooltip>
          </template>
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
import { QTooltip } from '../../../tooltip'

export default {
  name: 'q-table-sticky',
  components: {
    SortIcon,
    QTooltip
  },
  props: {
    stickyCols: Number,
    cols: Array,
    head: Boolean,
    noHeader: Boolean,
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
        this.$emit('sort', col)
      }
    }
  }
}
</script>
