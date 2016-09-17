<template>
  <quasar-grid-table
    v-ref:table
    class="quasar-grid"
    :data="data | gridShowSelected showOnlySelected selectionMode singleSelection | filterBy searchQuery"
    :columns="columns"
    :rows-per-page="rowsPerPage"
    :sortable="sortable"
    :selection-mode="selectionMode"
    :selection-actions="selectionActions"
    :no-data-label="noDataLabel"
    :id-property="idProperty"
  ></quasar-grid-table>
</template>

<script>
export default {
  props: {
    columns: {
      type: Array,
      required: true
    },
    data: {
      type: Array,
      required: true
    },
    rowsPerPage: {
      type: Number,
      default: 5
    },
    sortable: {
      type: Boolean,
      default: true,
      coerce: Boolean
    },
    noDataLabel: {
      type: String,
      default: 'No data to display.'
    },
    idProperty: String,
    selectionMode: {
      type: String,
      default: 'none',
      coerce: value => {
        return value === 'single' || value === 'multiple' ? value : 'none'
      }
    },
    selectionActions: Array
  },
  data () {
    return {
      searchQuery: '',
      showOnlySelected: false,
      singleSelection: []
    }
  },
  watch: {
    searchQuery () {
      this.$refs.table.page = 1
    },
    showOnlySelected () {
      this.$refs.table.page = 1
    }
  },
  events: {
    'toggle-selection' () {
      this.showOnlySelected = !this.showOnlySelected
    },
    filter (value) {
      this.searchQuery = value
    },
    'set-single-selection' (value) {
      this.singleSelection = value
    }
  }
}
</script>
