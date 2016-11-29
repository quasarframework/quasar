<template>
  <div>
    <div class="layout-padding">
      <q-data-table
        :data="table"
        :config="config"
        :columns="columns"
      >
        <template slot="col-message" scope="cell">
          <span class="light-paragraph">{{cell.data}}</span>
        </template>
        <template slot="col-source" scope="cell">
          <span v-if="cell.data === 'Audit'" class="label text-white bg-primary">
            Audit
            <q-tooltip>Some data</q-tooltip>
          </span>
          <span v-else class="label text-white bg-negative">{{cell.data}}</span>
        </template>

        <template slot="selection" scope="props">
          <button class="primary clear" @click="changeMessage(props)">
            <i>alarm</i>
          </button>
          <button class="primary clear" @click="deleteRow(props)">
            <i>delete</i>
          </button>
          <button class="primary clear" @click="changeMessage(props)">
            <i>alarm</i>
          </button>
          <button class="primary clear" @click="deleteRow(props)">
            <i>delete</i>
          </button>
          <button class="primary clear" @click="changeMessage(props)">
            <i>alarm</i>
          </button>
          <button class="primary clear" @click="deleteRow(props)">
            <i>delete</i>
          </button>
        </template>
      </q-data-table>
    </div>
  </div>
</template>

<script>
import table from '../../table-data.json'

export default {
  methods: {
    changeMessage (props) {
      props.rows.forEach(row => {
        row.data.message = 'Gogu'
      })
    },
    deleteRow (props) {
      props.rows.forEach(row => {
        this.table.splice(row.index, 1)
      })
    }
  },
  data () {
    return {
      table,
      config: {
        title: 'Data Table',
        filter: true,
        columnPicker: true,
        leftStickyColumns: 0,
        rightStickyColumns: 2,
        rowHeight: '50px',
        // responsive: false,
        pagination: {
          rowsPerPage: 50,
          options: [5, 10, 50, 500]
        },
        selection: 'multiple',
        messages: {
          noData: '<i>warning</i> No data available to show.',
          noDataAfterFiltering: '<i>warning</i> No results. Please refine your search terms.'
        }
      },
      columns: [
        {
          label: 'Date',
          field: 'isodate',
          style: {width: '120px'},
          format (value) {
            return new Date(value).toLocaleString()
          }
        },
        {
          label: 'Service',
          field: 'serviceable',
          format (value) {
            if (value === 'Informational') {
              return '<i class="text-positive">info</i>'
            }
            return value
          },
          style: {width: '80px'},
          classes: 'text-center'
        },
        {
          label: 'Message',
          field: 'message',
          sort: true,
          style: {width: '500px'}
        },
        {
          label: 'Source',
          field: 'source',
          sort: true,
          style: {width: '100px'}
        },
        {
          label: 'Log Number',
          field: 'log_number',
          sort: true,
          style: {width: '100px'}
        }
      ]
    }
  }
}
</script>
