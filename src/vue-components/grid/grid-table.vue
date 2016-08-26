<template>
  <div class="quasar-grid-table">
    <div class="grid-top-controls sm-column gt-sm-row items-center justify-end">
      <div class="auto sm-order-last self-center">
        <div v-show="selectionMode !== 'none' && controls === ''" transition="slide">
          Selected {{selectedRows.length}} rows.
        </div>
        <div v-show="selectionMode !== 'none' && controls === 'selection'" transition="slide">
          <button :class="{disabled: selectedRows.length === 0}" class="primary clear small" @click="chooseAction()"><i>menu</i></button>
          <button :class="{disabled: selectedRows.length === 0}" class="primary clear small" @click="clearSelection()"><i>cancel</i></button>
          <label><quasar-checkbox :model.sync="showOnlySelected"></quasar-checkbox> Selected only</label>
        </div>
        <div v-show="controls === 'filter'" transition="slide">
          Filter:
          <input v-model="searchQuery" type="text" :debounce="350">
          <button class="primary clear small" @click="clearFilter()">
            <i>clear</i>
          </button>
        </div>
      </div>

      <div class="row">
        <button
          class="primary"
          :class="{'clear': controls !== 'filter'}"
          @click="toggleControls('filter')"
        >
          <i>search</i>
        </button>

        <button
          v-if="selectionMode !== 'none'"
          class="primary"
          :class="{'clear': controls !== 'selection'}"
          @click="toggleControls('selection')"
        >
          <i>playlist_add_check</i>
        </button>

        <quasar-select
          :model.sync="rowsPerPage"
          :options="rowsPerPageOptions"
          ok-label="Change"
          cancel-label="Cancel"
          title="Rows per Page"
          fixed-label="<i>format_list_numbered</i>"
        ></quasar-select>

        <quasar-select
          multiple
          :model.sync="chosenColumnsModel"
          :options="chosenColumnsOptions"
          ok-label="Select"
          cancel-label="Cancel"
          title="Visible Columns"
          fixed-label="<i>view_column</i>"
        ></quasar-select>
      </div>
    </div>

    <table class="quasar-table striped highlight bordered compact">
      <thead>
        <tr>
          <th v-if="selectionMode !== 'none'" style="width: 30px text-align: center">
            &nbsp
          </th>
          <th
            v-for="column in columns"
            v-show="!column.hidden"
            @click="sortBy(column.field)"
            :class="{'sortable-column': sortable}"
          >
            {{{column.label}}}
            <i v-show="sortField === column.field && sortOrder === -1">keyboard_arrow_down</i>
            <i v-show="sortField === column.field && sortOrder === 1">keyboard_arrow_up</i>
          </th>
        </tr>
      </thead>

      <tbody>
        <tr
          v-for="row in data | orderBy sortField sortOrder | limitBy computedRowsPerPage rowOffset"
          :track-by="idProperty"
        >
          <td v-if="selectionMode !== 'none'">
            <quasar-radio v-if="selectionMode === 'single'" :model.sync="singleSelectedRow" :value="row"></quasar-radio>
            <quasar-checkbox v-else :model.sync="row.__selected"></quasar-checkbox>
          </td>
          <td
            v-for="column in columns"
            v-if="!column.hidden"
            :style="column.style"
            :class="column.classes"
            :data-th="column.label"
          >
            {{{column.formatter ? column.formatter(row[column.field]) : row[column.field]}}}
          </td>
        </tr>
      </tbody>

      <tfoot v-show="computedRowsPerPage > 10">
        <tr>
            <th v-if="selectionMode !== 'none'">
              &nbsp
            </th>
            <th
              v-for="column in columns"
              v-show="!column.hidden"
              @click="sortBy(column.field)"
              :class="{'sortable-column': sortable}"
            >
              {{{column.label}}}
              <i v-show="sortField === column.field && sortOrder === -1">keyboard_arrow_down</i>
              <i v-show="sortField === column.field && sortOrder === 1">keyboard_arrow_up</i>
            </th>
        </tr>
      </tfoot>
    </table>

    <div class="grid-bottom-controls sm-column gt-sm-row items-center">
      <div class="auto" v-show="data.length > 0">
        Showing {{rowOffset + 1}} to {{Math.min(rowsNumber, rowsPerPage * page)}} of {{rowsNumber}} entries
      </div>
      <div class="auto" v-else>
        {{noDataLabel}}
      </div>

      <quasar-pagination :model.sync="page" :max="pagesNumber" v-show="rowsPerPage !== 0 && rowsNumber > 0"></quasar-pagination>
    </div>
  </div>
</template>

<script>
import Utils from '../../utils'
import Dialog from '../../components/dialog/dialog'

const defaultRowsPerPage = [
  {label: '5', value: 5},
  {label: '10', value: 10},
  {label: '15', value: 15},
  {label: '25', value: 25},
  {label: '50', value: 50},
  {label: '100', value: 100},
  {label: 'No pagination', value: 0}
]

function getRowsPerPageOption (rowsPerPage) {
  if (defaultRowsPerPage.find(column => column.value === rowsPerPage)) {
    return defaultRowsPerPage
  }

  var options = defaultRowsPerPage.slice(0)

  options.unshift({
    label: '' + rowsPerPage,
    value: rowsPerPage
  })

  return options
}

export default {
  props: ['data', 'columns', 'rowsPerPage', 'sortable', 'noDataLabel', 'idProperty', 'selectionMode', 'selectionActions'],
  data () {
    let
      rowsPerPage = this.rowsPerPage,
      chosenColumns = this.getChosenColumn()

    return {
      page: 1,
      rowsPerPageOptions: getRowsPerPageOption(rowsPerPage),
      sortField: '',
      sortOrder: 1,
      chosenColumnsModel: chosenColumns,
      singleSelectedRow: null,
      searchQuery: '',
      controls: '',
      showOnlySelected: false
    }
  },
  computed: {
    rowsNumber () {
      return this.data.length
    },
    pagesNumber () {
      return Math.ceil(this.data.length / this.rowsPerPage)
    },
    chosenColumnsOptions () {
      return this.columns.map(column => {
        return {
          label: column.label,
          value: column.field
        }
      })
    },
    computedRowsPerPage () {
      return this.rowsPerPage ? this.rowsPerPage : Infinity
    },
    rowOffset () {
      return this.rowsPerPage * (this.page - 1)
    },
    selectedRows () {
      if (this.selectionMode === 'single') {
        return this.singleSelectedRow ? [this.singleSelectedRow] : []
      }
      return this.data.filter(row => row.__selected === true)
    },
    actionsModel () {
      let index = -1

      return this.selectionActions.map(item => {
        return {
          label: item.label,
          value: ++index
        }
      })
    }
  },
  watch: {
    rowsPerPage (value) {
      this.page = 1
    },
    chosenColumnsModel (options) {
      for (let i = 0; i < this.columns.length; i++) {
        this.columns.$set(i, Utils.extend({}, this.columns[i], {
          hidden: !options.includes(this.columns[i].field)
        }))
      }
    },
    searchQuery (value) {
      this.$dispatch('filter', value)
    },
    showOnlySelected (value) {
      this.$dispatch('toggle-selection')
    },
    singleSelectedRow (value) {
      this.$dispatch('set-single-selection', [value])
    }
  },
  methods: {
    goToPageByOffset (pageOffset) {
      this.page = Math.min(this.pagesNumber, Math.max(1, this.page + pageOffset))
    },
    sortBy (field) {
      if (!this.sortable) {
        return
      }

      // if sort field got changed
      if (this.sortField !== field) {
        this.sortOrder = 1
        this.sortField = field
        return
      }

      // else we sort on same field
      if (this.sortOrder === -1) {
        this.sortField = ''
      }
      else {
        this.sortOrder = -1
      }
    },
    getChosenColumn () {
      return this.columns
        .filter(column => column.hidden !== true)
        .map(column => column.field)
    },
    clearSelection () {
      if (this.selectionMode === 'single') {
        this.singleSelectedRow = null
      }
      else {
        this.data.forEach(row => {
          if (row.hasOwnProperty('__selected')) {
            row.__selected = false
          }
        })
      }

      this.showOnlySelected = false
    },
    clearFilter () {
      this.searchQuery = ''
      this.controls = ''
    },
    toggleControls (mode) {
      this.controls = this.controls === mode ? '' : mode
    },
    chooseAction () {
      let
        options = this.actionsModel,
        selectedRows = this.selectedRows,
        actions = this.selectionActions

      if (selectedRows.length === 0) {
        return
      }

      Dialog.create({
        title: 'Actions',
        message: 'Apply action for the ' + selectedRows.length + ' selected row(s).',
        radios: options,
        buttons: [
          'Cancel',
          {
            label: 'Apply',
            handler (data) {
              actions[data].handler(selectedRows)
            }
          }
        ]
      }).show()
    }
  }
}
</script>
