<template>
  <table class="q-table horizontal-delimiter" :style="tableStyle">
    <colgroup>
      <col v-if="selection" style="width: 45px;" />
      <col v-for="col in cols" :style="{width: col.width}" />
      <col v-if="head && scroll.horiz" :style="{width: scroll.horiz}" />
    </colgroup>
    <thead v-if="head">
      <tr>
        <th v-if="selection">&nbsp;</th>
        <th
          v-for="col in cols"
          :class="{sortable: col.sort}"
          @click="sort(col)"
        >
          <sort-icon
            v-if="col.sort"
            :field="col.field"
            :sorting="sorting"
          ></sort-icon>
          <span v-html="col.label"></span>
          <q-tooltip v-html="col.label"></q-tooltip>
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
import { QTooltip } from '../tooltip'

export default {
  name: 'q-table-content',
  components: {
    SortIcon,
    QTooltip
  },
  props: {
    cols: Array,
    head: Boolean,
    sorting: Object,
    scroll: Object,
    selection: [String, Boolean]
  },
  computed: {
    tableStyle () {
      return {
        width: this.head && this.vert ? `calc(100% - ${this.scroll.vert})` : '100%'
      }
    }
  },
  methods: {
    sort (col) {
      if (col.sort) {
        this.$emit('sort', col)
      }
    }
  }
}
</script>
