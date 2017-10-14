<template>
  <div class="layout-padding">
    <h4>Emulate server-side</h4>
    <q-data-table
      ref="server"
      color="primary"
      :data="serverData"
      :columns="columns"
      title="Server side data"
      :filter.sync="filter"
      selection="multiple"
      row-key="name"
      :pagination.sync="serverPagination"
      @request="request"
      :loader="loader"
    >
      <template slot="top-right" slot-scope="props">
        <q-search v-model="filter" />
      </template>
    </q-data-table>

    <h4>Client-side</h4>
    <q-data-table
      :data="data"
      :columns="columns"
      title="Client side data"
      row-key="name"
    />

    <h4>Compact</h4>
    <q-data-table
      compact
      :data="data"
      :columns="columns"
      row-key="name"
    />

    <h4>Dark</h4>
    <q-data-table
      dark
      class="bg-dark"
      color="grey-3"
      :data="data"
      :columns="columns"
      title="Client side"
      row-key="name"
    />

    <h4>No separator</h4>
    <q-data-table
      separator="none"
      :data="data"
      :columns="columns"
      row-key="name"
    />

    <h4>Column separator</h4>
    <q-data-table
      separator="vertical"
      :data="data"
      :columns="columns"
      row-key="name"
    />

    <h4>Cell separator</h4>
    <q-data-table
      separator="cell"
      :data="data"
      :columns="columns"
      row-key="name"
    />

    <h4>No top/bottom</h4>
    <q-data-table
      :data="data"
      :columns="columns"
      :filter.sync="filter"
      :loader="loader"
      row-key="name"
      color="primary"
      no-top
      no-bottom
    />

    <h4>Custom top</h4>
    <q-data-table
      :data="data"
      :columns="columns"
      :filter.sync="filter"
      :loader="loader"
      row-key="name"
      color="primary"
    >
      <template slot="top" slot-scope="props">
        <q-btn flat color="primary" icon="add" label="Add row" />
        <q-btn class="on-right" flat color="primary" icon="refresh" label="Refresh" />
      </template>
    </q-data-table>

    <h4>Filter, Column selection</h4>
    <q-data-table
      :data="data"
      :columns="columns"
      :filter.sync="filter"
      :visible-columns="visibleColumns"
      row-key="name"
      color="primary"
    >
      <template slot="top-right" slot-scope="props">
        <q-search color="primary" v-model="filter" />
        <q-data-table-columns color="primary" class="on-right" v-model="visibleColumns" :columns="columns" />
        <q-btn color="primary" flat round small icon="more_vert" class="on-right">
          <q-popover ref="popover">
            <q-list link>
              <q-item @click="$refs.popover.close()">
                <q-item-side icon="map" />
                <q-item-main label="View map" />
              </q-item>
              <q-item @click="$refs.popover.close()">
                <q-item-side icon="add" />
                <q-item-main label="Create new table" />
              </q-item>
            </q-list>
          </q-popover>
        </q-btn>
      </template>
    </q-data-table>

    <h4>Custom header/body</h4>
    <q-data-table
      :data="data"
      :columns="columns"
      row-key="name"
      table-style="height: 400px"
      table-class="gigi"
    >
    <template slot="header" slot-scope="props">
      <tr>
        <th rowspan="2" @click="props.sort(props.cols[0].name)" :class="props.cols[0].__thClass">
          {{props.cols[0].label}} <q-icon :class="props.cols[0].__iconClass" name="arrow_upward" />
        </th>
        <th @click="props.sort(props.cols[1].name)" :class="props.cols[1].__thClass">
          {{props.cols[1].label}} <q-icon :class="props.cols[1].__iconClass" name="arrow_upward" />
        </th>
        <th @click="props.sort(props.cols[3].name)" :class="props.cols[3].__thClass">
          {{props.cols[3].label}} <q-icon :class="props.cols[3].__iconClass" name="arrow_upward" />
        </th>
        <th @click="props.sort(props.cols[5].name)" :class="props.cols[5].__thClass">
          {{props.cols[5].label}} <q-icon :class="props.cols[5].__iconClass" name="arrow_upward" />
        </th>
        <th rowspan="2" @click="props.sort(props.cols[7].name)" :class="props.cols[7].__thClass">
          {{props.cols[7].label}} <q-icon :class="props.cols[7].__iconClass" name="arrow_upward" />
        </th>
      </tr>
      <tr>
        <th @click="props.sort(props.cols[2].name)" :class="props.cols[2].__thClass">
          {{props.cols[2].label}} <q-icon :class="props.cols[2].__iconClass" name="arrow_upward" />
        </th>
        <th @click="props.sort(props.cols[4].name)" :class="props.cols[4].__thClass">
          {{props.cols[4].label}} <q-icon :class="props.cols[4].__iconClass" name="arrow_upward" />
        </th>
        <th @click="props.sort(props.cols[6].name)" :class="props.cols[6].__thClass">
          {{props.cols[6].label}} <q-icon :class="props.cols[6].__iconClass" name="arrow_upward" />
        </th>
      </tr>
    </template>
      <template slot="body" slot-scope="props">
        <tr :key="props.key" :class="props.__trClass">
          <td rowspan="2">
            {{ props.row.name }}
          </td>
          <td class="text-right" style="border: 0">{{ props.row.calories }}</td>
          <td class="text-right" style="border: 0">{{ props.row.fat }}</td>
          <td class="text-right" style="border: 0">{{ props.row.carbs }}</td>
          <td class="text-right" rowspan="2">
            <q-chip square color="amber">{{ props.row.iron }}</q-chip>
          </td>
        </tr>
        <tr :key="`second-${props.key}`" :class="props.__trClass">
          <td class="text-right">{{ props.row.protein }}</td>
          <td class="text-right">{{ props.row.sodium }}</td>
          <td class="text-right">{{ props.row.calcium }}</td>
        </tr>
      </template>
    </q-data-table>

    <h4>Extra top/bottom rows</h4>
    <q-data-table
      :data="data"
      :columns="columns"
      row-key="name"
    >
      <div slot="top">
        Top
      </div>
      <template slot="top-row" slot-scope="props">
        <tr>
          <td colspan="100%">
            <strong>Top row</strong>
          </td>
        </tr>
      </template>

      <template slot="bottom-row" slot-scope="props">
        <tr>
          <td colspan="100%">
            <strong>Bottom row</strong>
          </td>
        </tr>
      </template>
      <div slot="bottom">
        Bottom
      </div>
    </q-data-table>

    <h4>Single selection</h4>
    <q-data-table
      :data="data"
      :columns="columns"
      row-key="name"
      selection="single"
    />

    <h4>Multiple selection</h4>
    <q-data-table
      :data="data"
      :columns="columns"
      row-key="name"
      selection="multiple"
    />

    <h4>Selection actions</h4>
    <q-data-table
      :data="data"
      :columns="columns"
      row-key="name"
      selection="multiple"
      color="secondary"
      title="Select some rows"
    >
      <template slot="top-selection" slot-scope="props">
        <q-btn color="secondary" flat label="Action 1" />
        <q-btn color="secondary" flat label="Action 2" />
        <div class="col"></div>
        <q-btn color="negative" flat round small icon="delete" />
      </template>
    </q-data-table>
  </div>
</template>

<script>
export default {
  data () {
    return {
      filter: '',
      serverPagination: {
        page: 1,
        rowsNumber: 10
      },
      serverData: [],
      loader: false,
      visibleColumns: ['desc', 'fat', 'carbs', 'protein', 'sodium', 'calcium', 'iron'],

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
      data: [
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
    }
  },
  methods: {
    request (props) {
      this.loader = true
      console.log('REQUEST', props)
      setTimeout(() => {
        this.serverPagination = props.pagination

        let
          table = this.$refs.server,
          rows = this.data.slice(),
          { page, rowsPerPage, sortBy, descending } = props.pagination

        if (props.filter) {
          rows = table.filterMethod(rows, table.computedColumns, props.filter)
        }

        if (sortBy) {
          rows = table.sortMethod(rows, table.computedColumns.find(def => def.name === sortBy), descending)
        }

        if (rowsPerPage) {
          rows = rows.slice((page - 1) * rowsPerPage, page * rowsPerPage)
        }

        this.serverPagination.rowsNumber = rows.length
        this.serverData = rows
        this.loader = false
      }, 1500)
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

<style lang="stylus">
</style>
