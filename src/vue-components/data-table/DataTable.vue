<template>
  <div class="q-data-table shadow-1">
    <div class="q-data-table-toolbar upper-toolbar row reverse-wrap items-center justify-end" v-if="toolbar === ''">
      <div v-if="config.title" class="q-data-table-title ellipsis auto" v-html="config.title"></div>
      <div class="row items-center">
        <button class="primary clear" v-if="config.filter" @click="toolbar = 'filter'">
          <i>filter_list</i>
        </button>
        <button class="primary clear" v-if="config.columnPicker" @click="toolbar = 'columns'">
          <i>view_column</i>
        </button>
      </div>
    </div>

    <table-filter v-if="toolbar === 'filter'" :filtering="filtering" :columns="cols" @close="toolbar = ''" />
    <column-selection v-if="toolbar === 'columns'" :columns="columns" v-model="columnSelection" @close="toolbar = ''" />
    <div class="q-data-table-toolbar upper-toolbar row reverse-wrap items-center justify-end q-data-table-selection" v-show="toolbar === 'selection'">
      <div class="auto">
        {{ rowsSelected }} item<span v-show="rowsSelected > 1">s</span> selected.
        <a @click="clearSelection()" style="text-decoration: underline">Clear</a>
      </div>
      <div>
        <slot name="selection" :rows="selectedRows"></slot>
      </div>
    </div>

    <table v-if="responsive" class="q-table horizontal-delimiter responsive" ref="body">
      <tbody>
        <tr v-for="(row, index) in rows">
          <td v-if="config.selection">
            <q-checkbox v-if="config.selection === 'multiple'" v-model="rowSelection[index]" />
            <q-radio v-else v-model="rowSelection[0]" :val="index" />
          </td>
          <template v-for="col in cols">
            <td v-if="!$scopedSlots['col-'+col.field]" v-html="format(row, col)" :data-th="col.label"></td>
            <td v-else :data-th="col.label">
              <slot :name="'col-'+col.field" :row="row" :col="col" :data="row[col.field]"></slot>
            </td>
          </template>
        </tr>
      </tbody>
    </table>

    <div v-else class="q-data-table-container" @mousewheel="mouseWheel" @DOMMouseScroll="mouseWheel">
      <div class="q-data-table-head" ref="head">
        <table-content head :cols="cols" :sorting="sorting" :scroll="scroll" :selection="config.selection" @sort="setSortField" />
      </div>
      <div
        class="q-data-table-body"
        :style="bodyStyle"
        ref="body"
        @scroll="scrollHandler"
      >
        <div v-if="message" class="q-data-table-message row items-center justify-center" v-html="message"></div>
        <table-content v-else :cols="cols" :selection="config.selection">
          <tr v-for="row in rows" :style="rowStyle">
            <td v-if="config.selection"></td>
            <td v-for="n in leftStickyColumns"></td>
            <template v-for="col in regularCols">
              <td v-if="!$scopedSlots['col-'+col.field]" v-html="format(row, col)"></td>
              <td v-else>
                <slot :name="'col-'+col.field" :row="row" :col="col" :data="row[col.field]"></slot>
              </td>
            </template>
            <td v-for="n in rightStickyColumns"></td>
          </tr>
        </table-content>
      </div>

      <template v-if="!message && leftStickyColumns || config.selection">
        <div
          class="q-data-table-sticky-left"
          ref="stickyLeft"
          :style="{bottom: scroll.horiz}"
        >
          <table-sticky :sticky-cols="leftStickyColumns" :cols="cols" :sorting="sorting" :selection="config.selection">
            <tr v-for="(row, index) in rows" :style="rowStyle">
              <td v-if="config.selection">
                <q-checkbox v-if="config.selection === 'multiple'" v-model="rowSelection[index]" />
                <q-radio v-else v-model="rowSelection[0]" :val="index" />
              </td>
              <template v-for="n in leftStickyColumns">
                <td v-if="!$scopedSlots['col-'+cols[n-1].field]" v-html="format(row, cols[n-1])"></td>
                <td v-else>
                  <slot :name="'col-'+cols[n-1].field" :row="row" :col="cols[n-1]" :data="row[cols[n-1].field]"></slot>
                </td>
              </template>
            </tr>
          </table-sticky>
        </div>
        <div class="q-data-table-sticky-left" :style="{bottom: scroll.horiz}">
          <table-sticky head :sticky-cols="leftStickyColumns" :scroll="scroll" :cols="cols" :sorting="sorting" @sort="setSortField" :selection="config.selection" />
        </div>
      </template>

      <template v-if="!message && rightStickyColumns">
        <div
          class="q-data-table-sticky-right"
          ref="stickyRight"
          :style="{right: scroll.vert, bottom: scroll.horiz}"
        >
          <table-sticky right :sticky-cols="rightStickyColumns" :cols="cols" :sorting="sorting" :selection="config.selection">
            <tr v-for="row in rows" :style="rowStyle">
              <td v-if="config.selection" class="invisible"></td>
              <td v-for="n in cols.length - rightStickyColumns" class="invisible"></td>
              <template v-for="n in rightStickyColumns">
                <td v-if="!$scopedSlots['col-'+rightCols[n-1].field]" v-html="format(row, rightCols[n-1])"></td>
                <td v-else>
                  <slot :name="'col-'+rightCols[n-1].field" :row="row" :col="rightCols[n-1]" :data="row[rightCols[n-1].field]"></slot>
                </td>
              </template>
            </tr>
          </table-sticky>
        </div>
        <div class="q-data-table-sticky-right">
          <table-sticky right head :sticky-cols="rightStickyColumns" :scroll="scroll" :cols="cols" :sorting="sorting" @sort="setSortField" :selection="config.selection" />
        </div>
      </template>
    </div>

    <table-pagination v-if="config.pagination" :pagination="pagination" :entries="pagination.entries" />
  </div>
</template>

<script>
import Utils from '../../utils'

import ColumnSelection from './plugins/column-selection/column-selection'
import Filter from './plugins/filter/filter'
import Pagination from './plugins/pagination/pagination'
import Responsive from './plugins/responsive/responsive'
import RowSelection from './plugins/row-selection/row-selection'
import Scroll from './plugins/scroll/scroll'
import Sort from './plugins/sort/sort'
import StickyColumns from './plugins/sticky-cols/sticky-cols'

import TableContent from './TableContent.vue'

export default {
  mixins: [ColumnSelection, Filter, Pagination, Responsive, RowSelection, Scroll, Sort, StickyColumns],
  props: {
    data: {
      type: Array,
      default: []
    },
    columns: {
      type: Array,
      required: true
    },
    config: {
      type: Object,
      default () { return {} }
    }
  },
  data () {
    return {
      selected: false,
      toolbar: ''
    }
  },
  computed: {
    rows () {
      let rows = Utils.clone(this.data)

      rows.forEach((row, i) => {
        row.__index = i
      })

      if (this.filtering.terms) {
        rows = this.filter(rows)
      }

      if (this.sorting.field) {
        this.sort(rows)
      }

      this.pagination.entries = rows.length

      if (this.pagination.rowsPerPage > 0) {
        rows = this.paginate(rows)
      }

      return rows
    },
    rowStyle () {
      if (this.config.rowHeight) {
        return {height: this.config.rowHeight}
      }
    },
    bodyStyle () {
      return this.config.bodyStyle || {}
    },
    message () {
      if (this.rows.length) {
        return false
      }

      if (this.filtering.terms) {
        return this.config.messages.noDataAfterFiltering || '<i>warning</i> No results. Please refine your search terms.'
      }

      return this.config.message.noData || '<i>warning</i> No data available to show.'
    }
  },
  methods: {
    resetBody () {
      this.$refs.body.scrollTop = 0
      this.pagination.page = 1
    },
    format (row, col) {
      return col.format ? col.format(row[col.field]) : row[col.field]
    }
  },
  components: {
    TableContent
  }
}
</script>
