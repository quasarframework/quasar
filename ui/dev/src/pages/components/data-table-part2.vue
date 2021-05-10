<template>
  <div class="q-layout-padding">
    <q-toggle v-model="dense" label="Dense" />
    <h4>Emulate server-side</h4>
    {{ serverPagination }}
    <q-table
      ref="server"
      color="primary"
      :rows="serverData"
      :columns="columns"
      title="Server side data"
      :filter="filter"
      selection="multiple"
      v-model:selected="selected"
      :row-key="getRowKey"
      v-model:pagination="serverPagination"
      @request="request"
      :loading="loading"
      flat
      bordered
      :dense="dense"
    >
      <template v-slot:top-right>
        <q-input borderless dense debounce="300" v-model="filter" placeholder="Search">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
    </q-table>

    <h4>Client-side</h4>
    <q-table
      :rows="data"
      :columns="columns"
      title="Client side data"
      row-key="name"
      dense
    />

    <h4>Dark</h4>
    <q-table
      dark
      class="bg-black"
      :rows="data"
      :columns="columns"
      title="Client side"
      row-key="name"
    />

    <h4>No separator</h4>
    <q-table
      separator="none"
      :rows="data"
      :columns="columns"
      row-key="name"
    />

    <h4>Column separator</h4>
    <q-table
      separator="vertical"
      :rows="data"
      :columns="columns"
      row-key="name"
    />

    <h4>Cell separator</h4>
    <q-table
      separator="cell"
      :rows="data"
      :columns="columns"
      row-key="name"
    />

    <h4>No top/bottom</h4>
    <q-table
      :rows="data"
      :columns="columns"
      :filter="filter"
      :loading="loading"
      row-key="name"
      color="primary"
      no-top
      no-bottom
    />

    <h4>Custom top</h4>
    <q-table
      :rows="dataDyn"
      :columns="columns"
      :filter="filterDyn"
      :loading="loadingDyn"
      row-key="name"
      color="primary"
    >
      <template v-slot:top>
        <q-btn flat dense color="primary" :disable="loadingDyn" icon="add" label="Add row" @click="addRow" />
        <q-btn class="on-right" flat dense color="primary" :disable="loadingDyn" icon="remove" label="Remove row" @click="removeRow" />
        <q-btn class="on-right" flat dense color="primary" :disable="loadingDyn" icon="refresh" label="Refresh" />
        <div class="col" />
        <q-input borderless dense debounce="300" color="primary" v-model="filterDyn">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
    </q-table>

    <h4>Filter, Column selection</h4>
    <q-table
      :rows="data"
      title="Filter, Column selection"
      :columns="columns"
      :filter="filter"
      :visible-columns="visibleColumns"
      no-data-label="I didn't find anything for you"
      row-key="name"
      color="primary"
    >
      <template v-slot:top-right>
        <q-input borderless dense debounce="300" color="primary" class="q-mr-sm" v-model="filter">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
        <q-select
          v-model="visibleColumns"
          :options="columns"
          multiple
          option-value="name"
          option-disable="required"
          emit-value
          :display-value="$q.lang.table.columns"
          dense
          borderless
        />
        <q-btn color="primary" flat round dense icon="more_vert">
          <q-menu cover>
            <q-list>
              <q-item clickable v-close-popup>
                <q-item-section avatar>
                  <q-icon name="map" />
                </q-item-section>
                <q-item-section>View map</q-item-section>
              </q-item>
              <q-item clickable v-close-popup>
                <q-item-section avatar>
                  <q-icon name="add" />
                </q-item-section>
                <q-item-section>Create new table</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </template>

      <template v-slot:no-data="props">
        <q-banner class="full-width bg-warning">
          <template v-slot:avatar>
            <q-icon :name="props.icon" color="primary" />
          </template>
          {{ props.message }}
        </q-banner>
      </template>
    </q-table>

    <h4>Custom header/body</h4>
    <q-table
      :rows="data"
      :columns="columns"
      row-key="name"
      table-style="height: 400px"
      table-class="gigi"
    >
      <template v-slot:header="props">
        <q-tr :props="props">
          <th rowspan="2" @click="props.sort(props.cols[0].name)" :class="props.cols[0].__thClass">
            {{ props.cols[0].label }} <q-icon :class="props.cols[0].__iconClass" name="arrow_upward" />
          </th>
          <th @click="props.sort(props.cols[1].name)" :class="props.cols[1].__thClass">
            {{ props.cols[1].label }} <q-icon :class="props.cols[1].__iconClass" name="arrow_upward" />
          </th>
          <th @click="props.sort(props.cols[3].name)" :class="props.cols[3].__thClass">
            {{ props.cols[3].label }} <q-icon :class="props.cols[3].__iconClass" name="arrow_upward" />
          </th>
          <th @click="props.sort(props.cols[5].name)" :class="props.cols[5].__thClass">
            {{ props.cols[5].label }} <q-icon :class="props.cols[5].__iconClass" name="arrow_upward" />
          </th>
          <th rowspan="2" @click="props.sort(props.cols[7].name)" :class="props.cols[7].__thClass">
            {{ props.cols[7].label }} <q-icon :class="props.cols[7].__iconClass" name="arrow_upward" />
          </th>
        </q-tr>
        <q-tr>
          <th @click="props.sort(props.cols[2].name)" :class="props.cols[2].__thClass">
            {{ props.cols[2].label }} <q-icon :class="props.cols[2].__iconClass" name="arrow_upward" />
          </th>
          <th @click="props.sort(props.cols[4].name)" :class="props.cols[4].__thClass">
            {{ props.cols[4].label }} <q-icon :class="props.cols[4].__iconClass" name="arrow_upward" />
          </th>
          <th @click="props.sort(props.cols[6].name)" :class="props.cols[6].__thClass">
            {{ props.cols[6].label }} <q-icon :class="props.cols[6].__iconClass" name="arrow_upward" />
          </th>
        </q-tr>
      </template>
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td rowspan="2">
            {{ props.row.name }}
          </q-td>
          <q-td key="calories" :props="props" style="border: 0">
            {{ props.row.calories }}
          </q-td>
          <q-td key="fat" :props="props" style="border: 0">
            {{ props.row.fat }}
          </q-td>
          <q-td key="carbs" :props="props" style="border: 0">
            {{ props.row.carbs }}
          </q-td>
          <q-td key="iron" :props="props" rowspan="2">
            <q-chip square color="amber">
              {{ props.row.iron }}
            </q-chip>
          </q-td>
        </q-tr>
        <q-tr :props="props">
          <q-td key="protein" :props="props">
            {{ props.row.protein }}
          </q-td>
          <q-td key="sodium" :props="props">
            {{ props.row.sodium }}
          </q-td>
          <q-td key="calcium" :props="props">
            {{ props.row.calcium }}
          </q-td>
        </q-tr>
      </template>
    </q-table>

    <h4>Extra top/bottom rows</h4>
    <q-table
      :rows="data"
      :columns="columns"
      row-key="name"
    >
      <template v-slot:top>
        Top
      </template>
      <template v-slot:top-row="props">
        <q-tr :props="props">
          <q-td colspan="100%">
            <strong>Top row</strong>
          </q-td>
        </q-tr>
      </template>

      <template v-slot:bottom-row="props">
        <q-tr :props="props">
          <q-td colspan="100%">
            <strong>Bottom row</strong>
          </q-td>
        </q-tr>
      </template>

      <template v-slot:bottom>
        Bottom
      </template>
    </q-table>

    <h4>Single selection</h4>
    <q-table
      :rows="data"
      :columns="columns"
      row-key="name"
      selection="single"
      v-model:selected="selected"
    />

    <h4>Multiple selection</h4>
    <q-table
      :rows="data"
      :columns="columns"
      row-key="name"
      selection="multiple"
      v-model:selected="selected"
    />

    <h4>Selection actions</h4>
    <q-table
      :rows="data"
      :columns="columns"
      row-key="name"
      selection="multiple"
      v-model:selected="selected"
      color="secondary"
      title="Select some rows"
    >
      <template v-slot:top-selection>
        <q-btn color="secondary" flat label="Action 1" />
        <q-btn color="secondary" flat label="Action 2" />
        <div class="col" />
        <q-btn color="negative" flat round dense icon="delete" />
      </template>
    </q-table>

    <h4>Dense selection</h4>
    <q-table
      :rows="data"
      :columns="columns"
      row-key="name"
      selection="single"
      dense
      v-model:selected="selected"
    />
    <h4>No Data - Default</h4>
    <q-table
      :rows="[]"
      :columns="columns"
      title="No Data"
      row-key="name"
    />
    <h4>No Data - Label</h4>
    <q-table
      :rows="[]"
      :columns="columns"
      no-data-label="I didn't find anything for you"
      title="No Data"
      row-key="name"
    />
    <h4>No Data - Slot</h4>
    <q-table
      :rows="[]"
      :columns="columns"
      no-data-label="I didn't find anything for you"
      title="No Data"
      row-key="name"
    >
      <template v-slot:no-data="props">
        <q-banner class="full-width bg-warning">
          <template v-slot:avatar>
            <q-icon :name="props.icon" color="primary" />
          </template>
          {{ props.message }}
        </q-banner>
      </template>
    </q-table>
  </div>
</template>

<script>
import { extend } from 'quasar'

const data = [
  {
    name: 'Frozen Yogurt',
    calories: 159,
    fat: 6.0,
    carbs: 24,
    protein: 4.0,
    sodium: 87,
    calcium: '14%',
    iron: '1%'
  },
  {
    name: 'Ice cream sandwich',
    calories: 237,
    fat: 9.0,
    carbs: 37,
    protein: 4.3,
    sodium: 129,
    calcium: '8%',
    iron: '1%'
  },
  {
    name: 'Eclair',
    calories: 262,
    fat: 16.0,
    carbs: 23,
    protein: 6.0,
    sodium: 337,
    calcium: '6%',
    iron: '7%'
  },
  {
    name: 'Cupcake',
    calories: 305,
    fat: 3.7,
    carbs: 67,
    protein: 4.3,
    sodium: 413,
    calcium: '3%',
    iron: '8%'
  },
  {
    name: 'Gingerbread',
    calories: 356,
    fat: 16.0,
    carbs: 49,
    protein: 3.9,
    sodium: 327,
    calcium: '7%',
    iron: '16%'
  },
  {
    name: 'Jelly bean',
    calories: 375,
    fat: 0.0,
    carbs: 94,
    protein: 0.0,
    sodium: 50,
    calcium: '0%',
    iron: '0%'
  },
  {
    name: 'Lollipop',
    calories: 392,
    fat: 0.2,
    carbs: 98,
    protein: 0,
    sodium: 38,
    calcium: '0%',
    iron: '2%'
  },
  {
    name: 'Honeycomb',
    calories: 408,
    fat: 3.2,
    carbs: 87,
    protein: 6.5,
    sodium: 562,
    calcium: '0%',
    iron: '45%'
  },
  {
    name: 'Donut',
    calories: 452,
    fat: 25.0,
    carbs: 51,
    protein: 4.9,
    sodium: 326,
    calcium: '2%',
    iron: '22%'
  },
  {
    name: 'KitKat',
    calories: 518,
    fat: 26.0,
    carbs: 65,
    protein: 7,
    sodium: 54,
    calcium: '12%',
    iron: '6%'
  }
]

export default {
  data () {
    return {
      dense: false,
      filter: '',
      filterDyn: '',
      serverPagination: {
        page: 1,
        rowsNumber: 10
      },
      serverData: [],
      loading: false,
      loadingDyn: false,
      visibleColumns: [ 'desc', 'fat', 'carbs', 'protein', 'sodium', 'calcium', 'iron' ],
      selected: [],

      columns: [
        {
          name: 'desc',
          required: true,
          label: 'Dessert (100g serving)',
          align: 'left',
          field: 'name',
          sortable: true
        },
        { name: 'calories', label: 'Calories', field: 'calories', sortable: true },
        { name: 'fat', label: 'Fat (g)', field: 'fat', sortable: true },
        { name: 'carbs', label: 'Carbs (g)', field: 'carbs' },
        { name: 'protein', label: 'Protein (g)', field: 'protein' },
        { name: 'sodium', label: 'Sodium (mg)', field: 'sodium' },
        { name: 'calcium', label: 'Calcium (%)', field: 'calcium', sortable: true, sort: (a, b) => parseInt(a, 10) - parseInt(b, 10) },
        { name: 'iron', label: 'Iron (%)', field: 'iron', sortable: true, sort: (a, b) => parseInt(a, 10) - parseInt(b, 10) }
      ],
      data: [ ...data ],
      dataDyn: [ ...data ]
    }
  },
  methods: {
    getRowKey (row) {
      return row.name
    },

    request (props) {
      // this.loading = true
      // console.log('REQUEST', props)
      // setTimeout(() => {
      //   this.serverPagination = props.pagination

      //   const
      //     table = this.$refs.server,
      //     { page, rowsPerPage, sortBy, descending } = props.pagination
      //   let rows = this.data.slice()

      //   if (props.filter) {
      //     console.log('filter hit')
      //     rows = table.computedFilterMethod(rows, props.filter)
      //   }

      //   if (sortBy) {
      //     rows = table.computedSortMethod(rows, sortBy, descending)
      //   }

      //   this.serverPagination.rowsNumber = rows.length

      //   if (rowsPerPage) {
      //     rows = rows.slice((page - 1) * rowsPerPage, page * rowsPerPage)
      //   }

      //   this.serverData = rows
      //   this.loading = false
      // }, 1500)
    },
    moveRowUp (name) {
      const rowIndex = this.data.findIndex(t => t.name === name)
      if (rowIndex > -1 && rowIndex > 0) {
        this.data.splice(rowIndex - 1, 0, this.data.splice(rowIndex, 1)[ 0 ])
      }
    },
    moveRowDown (name) {
      const rowIndex = this.data.findIndex(t => t.name === name)
      if (rowIndex > -1 && rowIndex < this.data.length - 1) {
        this.data.splice(rowIndex + 1, 0, this.data.splice(rowIndex, 1)[ 0 ])
      }
    },
    addRow () {
      this.loadingDyn = true
      setTimeout(() => {
        const
          addPoint = Math.floor(Math.random() * (this.dataDyn.length + 1)),
          row = data[ Math.floor(Math.random() * data.length) ]
        if (!row.__count) {
          row.__count = 0
        }
        row.__count += 1
        const addRow = extend({}, row, { name: `${ row.name } (${ row.__count })` })
        this.dataDyn = [ ...this.dataDyn.slice(0, addPoint), addRow, ...this.dataDyn.slice(addPoint) ]
        this.loadingDyn = false
      }, 500)
    },
    removeRow () {
      this.loadingDyn = true
      setTimeout(() => {
        const removePoint = Math.floor(Math.random() * this.dataDyn.length)
        this.dataDyn = [ ...this.dataDyn.slice(0, removePoint), ...this.dataDyn.slice(removePoint + 1) ]
        this.loadingDyn = false
      }, 500)
    }
  },
  mounted () {
    const table = this.$refs.server
    this.request({
      pagination: table.computedPagination,
      filter: this.filter
    })
  }
}
</script>

<style lang="sass">
</style>
