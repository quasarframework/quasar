<template>
  <table class="q-table horizontal-delimiter" :style="tableStyle">
    <colgroup>
      <col v-if="selection" style="width: 45px;" />
      <col v-for="col in cols" :style="col.style" />
      <col v-if="right && head && scroll.vert" :style="{width: scroll.vert}" />
    </colgroup>
    <thead>
      <tr>
        <th v-if="selection"></th>
        <th
          v-for="(col, index) in cols"
          :class="{invisible: hidden(index)}"
        >
          <span v-html="col.label"></span>
          <sort-icon
            v-if="col.sort"
            @click.native="$emit('sort', col.field)"
            :field="col.field"
            :sorting="sorting"
          />
        </th>
        <th v-if="right && head && scroll.vert"></th>
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
  computed: {
    tableStyle () {
      return {
        width: this.head ? `calc(100% - ${this.scroll.vert})` : '100%'
      }
    }
  },
  methods: {
    hidden (index) {
      if (this.right) {
        return this.cols.length - this.stickyCols > index
      }
      return index >= this.stickyCols
    }
  },
  components: {
    SortIcon
  }
}
</script>
