<template>
  <div class="layout-padding">
    <h4>Emulate server-side</h4>
    {{serverPagination}}
    <q-table
      ref="server"
      color="primary"
      :data="serverData"
      :columns="columns"
      title="Server side data"
      :filter="filter"
      selection="multiple"
      :selected.sync="selected"
      row-key="name"
      :pagination.sync="serverPagination"
      @request="request"
      :loader="loader"
    >
      <template slot="top-right" slot-scope="props">
        <q-search v-model="filter" />
      </template>
    </q-table>

    <h4>Client-side</h4>
    <q-table
      :data="data"
      :columns="columns"
      title="Client side data"
      row-key="name"
    />

    <h4>Dark</h4>
    <q-table
      dark
      class="bg-grey-10"
      color="grey-3"
      :data="data"
      :columns="columns"
      title="Client side"
      row-key="name"
    />

    <h4>No separator</h4>
    <q-table
      separator="none"
      :data="data"
      :columns="columns"
      row-key="name"
    />

    <h4>Column separator</h4>
    <q-table
      separator="vertical"
      :data="data"
      :columns="columns"
      row-key="name"
    />

    <h4>Cell separator</h4>
    <q-table
      separator="cell"
      :data="data"
      :columns="columns"
      row-key="name"
    />

    <h4>No top/bottom</h4>
    <q-table
      :data="data"
      :columns="columns"
      :filter="filter"
      :loader="loader"
      row-key="name"
      color="primary"
      no-top
      no-bottom
    />

    <h4>Custom top</h4>
    <q-table
      :data="data"
      :columns="columns"
      :filter="filter"
      :loader="loader"
      row-key="name"
      color="primary"
    >
      <template slot="top" slot-scope="props">
        <q-btn flat color="primary" icon="add" label="Add row" />
        <q-btn class="on-right" flat color="primary" icon="refresh" label="Refresh" />
      </template>
    </q-table>

    <h4>Filter, Column selection</h4>
    <q-table
      :data="data"
      :columns="columns"
      :filter="filter"
      :visible-columns="visibleColumns"
      row-key="name"
      color="primary"
    >
      <template slot="top-right" slot-scope="props">
        <q-search color="primary" v-model="filter" />
        <q-table-columns color="primary" class="on-right" v-model="visibleColumns" :columns="columns" />
        <q-btn color="primary" flat round size="sm" icon="more_vert" class="on-right">
          <q-popover ref="popover">
            <q-list link>
              <q-item @click="$refs.popover.hide()">
                <q-item-side icon="map" />
                <q-item-main label="View map" />
              </q-item>
              <q-item @click="$refs.popover.hide()">
                <q-item-side icon="add" />
                <q-item-main label="Create new table" />
              </q-item>
            </q-list>
          </q-popover>
        </q-btn>
      </template>
    </q-table>

    <h4>Custom header/body</h4>
    <q-table
      :data="data"
      :columns="columns"
      row-key="name"
      table-style="height: 400px"
      table-class="gigi"
    >
      <template slot="header" slot-scope="props">
        <q-tr :props="props">
          <q-th rowspan="2" @click="props.sort(props.cols[0].name)" :class="props.cols[0].__thClass">
            {{props.cols[0].label}} <q-icon :class="props.cols[0].__iconClass" name="arrow_upward" />
          </q-th>
          <q-th @click="props.sort(props.cols[1].name)" :class="props.cols[1].__thClass">
            {{props.cols[1].label}} <q-icon :class="props.cols[1].__iconClass" name="arrow_upward" />
          </q-th>
          <q-th @click="props.sort(props.cols[3].name)" :class="props.cols[3].__thClass">
            {{props.cols[3].label}} <q-icon :class="props.cols[3].__iconClass" name="arrow_upward" />
          </q-th>
          <q-th @click="props.sort(props.cols[5].name)" :class="props.cols[5].__thClass">
            {{props.cols[5].label}} <q-icon :class="props.cols[5].__iconClass" name="arrow_upward" />
          </q-th>
          <q-th rowspan="2" @click="props.sort(props.cols[7].name)" :class="props.cols[7].__thClass">
            {{props.cols[7].label}} <q-icon :class="props.cols[7].__iconClass" name="arrow_upward" />
          </q-th>
        </q-tr>
        <q-tr>
          <q-th @click="props.sort(props.cols[2].name)" :class="props.cols[2].__thClass">
            {{props.cols[2].label}} <q-icon :class="props.cols[2].__iconClass" name="arrow_upward" />
          </q-th>
          <q-th @click="props.sort(props.cols[4].name)" :class="props.cols[4].__thClass">
            {{props.cols[4].label}} <q-icon :class="props.cols[4].__iconClass" name="arrow_upward" />
          </q-th>
          <q-th @click="props.sort(props.cols[6].name)" :class="props.cols[6].__thClass">
            {{props.cols[6].label}} <q-icon :class="props.cols[6].__iconClass" name="arrow_upward" />
          </q-th>
        </q-tr>
      </template>
      <template slot="body" slot-scope="props">
        <q-tr :props="props">
          <q-td rowspan="2">
            {{ props.row.name }}
          </q-td>
          <q-td key="calories" :props="props" style="border: 0">{{ props.row.calories }}</q-td>
          <q-td key="fat" :props="props" style="border: 0">{{ props.row.fat }}</q-td>
          <q-td key="carbs" :props="props" style="border: 0">{{ props.row.carbs }}</q-td>
          <q-td key="iron" :props="props" rowspan="2">
            <q-chip square color="amber">{{ props.row.iron }}</q-chip>
          </q-td>
        </q-tr>
        <q-tr :props="props">
          <q-td key="protein" :props="props">{{ props.row.protein }}</q-td>
          <q-td key="sodium" :props="props">{{ props.row.sodium }}</q-td>
          <q-td key="calcium" :props="props">{{ props.row.calcium }}</q-td>
        </q-tr>
      </template>
    </q-table>

    <h4>Extra top/bottom rows</h4>
    <q-table
      :data="data"
      :columns="columns"
      row-key="name"
    >
      <div slot="top">
        Top
      </div>
      <q-tr slot="top-row" slot-scope="props" :props="props">
        <q-td colspan="100%">
          <strong>Top row</strong>
        </q-td>
      </q-tr>

      <q-tr slot="bottom-row" slot-scope="props" :props="props">
        <q-td colspan="100%">
          <strong>Bottom row</strong>
        </q-td>
      </q-tr>

      <div slot="bottom">
        Bottom
      </div>
    </q-table>

    <h4>Single selection</h4>
    <q-table
      :data="data"
      :columns="columns"
      row-key="name"
      selection="single"
      :selected.sync="selected"
    />

    <h4>Multiple selection</h4>
    <q-table
      :data="data"
      :columns="columns"
      row-key="name"
      selection="multiple"
      :selected.sync="selected"
    />

    <h4>Selection actions</h4>
    <q-table
      :data="data"
      :columns="columns"
      row-key="name"
      selection="multiple"
      :selected.sync="selected"
      color="secondary"
      title="Select some rows"
    >
      <template slot="top-selection" slot-scope="props">
        <q-btn color="secondary" flat label="Action 1" />
        <q-btn color="secondary" flat label="Action 2" />
        <div class="col"></div>
        <q-btn color="negative" flat round size="sm" icon="delete" />
      </template>
    </q-table>
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
          console.log('filter hit')
          rows = table.filterMethod(rows, props.filter)
        }

        if (sortBy) {
          rows = table.sortMethod(rows, sortBy, descending)
        }

        this.serverPagination.rowsNumber = rows.length

        if (rowsPerPage) {
          rows = rows.slice((page - 1) * rowsPerPage, page * rowsPerPage)
        }

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
