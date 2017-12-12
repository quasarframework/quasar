<template>
  <div>
    <div class="layout-padding" style="max-width: 1400px;">
      <q-field icon="search">
        <q-input v-model="filter" float-label="Float" />
      </q-field>

      <div>
        <q-btn-toggle color="primary" toggle-color="red" v-model="loader" label="Show loader" />
        <q-toggle color="primary" v-model="selectionToggle" label="Multiple selection" />
        <q-select multiple toggle v-model="visibleColumns" :options="visibleColumnsOptions" />
        <q-radio v-model="separator" val="horizontal" label="Horizontal" />
        <q-radio v-model="separator" val="vertical" label="Vertical" />
        <q-radio v-model="separator" val="cell" label="Cell" />
        <q-radio v-model="separator" val="none" label="None" />
      </div>

      <h2>Emulate server-side</h2>
      <q-table
        ref="server"
        :data="serverData"
        :columns="columns"
        :title="title"
        :filter="filter"
        :loader="loader"
        selection="multiple"
        :selected.sync="selected"
        row-key="name"
        :pagination.sync="serverPagination"
        :separator="separator"
        @request="request"
      >
        <template slot="top-right" slot-scope="props">
          <q-search v-model="filter" />
        </template>
      </q-table>

      <h2>NO templates</h2>
      <q-table
        dark
        class="bg-black"
        color="grey-3"
        :separator="separator"
        :data="data"
        :columns="columns"
        :title="title"
        :filter="filter"
        :loader="loader"
        selection="multiple"
        :selected.sync="selected"
        row-key="name"
      />

      <h2>body-cell-desc template</h2>
      <q-table
        :data="data"
        :columns="columns"
        :title="title"
        :filter="filter"
        :loader="loader"
        :selection="selection"
        :selected.sync="selected"
        :visible-columns="visibleColumns"
        row-key="name"
        color="secondary"
        :separator="separator"
      >
        <template slot="top-selection" slot-scope="props">
          Selection
        </template>
        <template slot="top-left" slot-scope="props">
          <q-btn size="sm" round flat :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'" @click="props.toggleFullscreen()" />
        </template>
        <template slot="top-right" slot-scope="props">
          <q-table-columns color="secondary" v-model="visibleColumns" :columns="columns" />
        </template>

        <q-td slot="body-cell-desc" slot-scope="props" :props="props">
          <q-chip color="secondary">{{ props.value }}</q-chip>
          <br>
          <q-chip color="secondary">{{ props.value }}</q-chip>
        </q-td>
      </q-table>

      <h2>no-top, no-bottom</h2>
      <q-table
        :data="data"
        :columns="columns"
        :title="title"
        :filter="filter"
        :loader="loader"
        row-key="name"
        color="primary"
        no-top
        no-bottom
      />

      <h2>top-left template</h2>
      <q-table
        :data="data"
        :columns="columns"
        :title="title"
        :filter="filter"
        :loader="loader"
        :selection="selection"
        :selected.sync="selected"
        :visible-columns="visibleColumns"
        row-key="name"
        color="amber"
      >
        <div slot="top-left" slot-scope="props">
          Top left template
        </div>

        <div slot="top-right" slot-scope="props" class="row items-center">
          <q-btn flat round size="sm" color="grey-8" icon="filter_list" class="on-right" />
          <q-btn flat round size="sm" color="grey-8" icon="more_vert" class="on-right" />
        </div>
        <div slot="top-selection" slot-scope="props">
          Selection
        </div>
      </q-table>

      <h2>top template</h2>
      <q-table
        :data="data"
        :columns="columns"
        :title="title"
        :filter="filter"
        :loader="loader"
        row-key="name"
        color="primary"
      >
        <div slot="top" slot-scope="props" class="row items-center">
          Some awesome table
        </div>
      </q-table>

      <h2>header-cell</h2>
      <q-table
        :data="data"
        :columns="columns"
        :title="title"
        :filter="filter"
        row-key="name"
      >
        <q-th slot="header-cell" slot-scope="props" :props="props">
          # {{props.col.label}}
        </q-th>
      </q-table>

      <h2>header</h2>
      <q-table
        :data="data"
        :columns="columns"
        :filter="filter"
        :title="title"
        row-key="name"
      >
        <q-tr slot="header" slot-scope="props" :props="props">
          <q-th v-for="col in props.cols" :key="col.name" :props="props">
            {{col.label}}
          </q-th>
        </q-tr>
      </q-table>

      <h2>header 2</h2>
      <q-table
        :data="data"
        :columns="columns"
        :filter="filter"
        :title="title"
        row-key="name"
      >
        <tr slot="header" slot-scope="props">
          <q-th key="desc" :props="props">
            Dessert
          </q-th>
          <q-th key="calories" :props="props">
            Calo
          </q-th>
          <q-th key="fat" :props="props">
            Fat
          </q-th>
          <q-th key="carbs" :props="props">
            Carbs
          </q-th>
          <q-th key="protein" :props="props">
            Protein
          </q-th>
          <q-th key="sodium" :props="props">
            Sodium
          </q-th>
          <q-th key="calcium" :props="props">
            Calcium
          </q-th>
          <q-th key="iron" :props="props">
            Iron
          </q-th>
        </tr>
      </q-table>
      <h2>body template</h2>
      <q-table
        :data="data"
        :columns="columns"
        :filter="filter"
        :title="title"
        row-key="name"
      >
        <q-tr slot="body" slot-scope="props" :props="props">
          <q-td key="desc" :props="props">
            {{ props.row.name }}
            <q-popover>
              <q-input v-model="props.row.name" />
            </q-popover>
          </q-td>
          <q-td key="calories" :props="props">{{ props.row.calories }}</q-td>
          <q-td key="fat" :props="props">{{ props.row.fat }}</q-td>
          <q-td key="carbs" :props="props">{{ props.row.carbs }}</q-td>
          <q-td key="protein" :props="props">{{ props.row.protein }}</q-td>
          <q-td key="sodium" :props="props">{{ props.row.sodium }}</q-td>
          <q-td key="calcium" :props="props">{{ props.row.calcium }}</q-td>
          <q-td key="iron" :props="props">
            <q-chip square color="amber">{{ props.row.iron }}</q-chip>
          </q-td>
        </q-tr>
      </q-table>

      <h2>body template 2</h2>
      <q-table
        :data="data"
        :columns="columns"
        :filter="filter"
        :title="title"
        row-key="name"
      >
        <q-tr slot="body" slot-scope="props" :props="props">
          <q-td v-for="col in props.cols" :key="col.name" :props="props">
            {{ col.value }}
          </q-td>
        </q-tr>
      </q-table>

      <h2>body-cell template</h2>
      <q-table
        :data="data"
        :columns="columns"
        :filter="filter"
        :title="title"
        row-key="name"
      >
        <q-td slot="body-cell" slot-scope="props" :props="props">
          !{{ props.value }}
        </q-td>
      </q-table>

      <h2>before/after header/footer template</h2>
      <q-table
        :data="data"
        :columns="columns"
        :filter="filter"
        :title="title"
        row-key="name"
      >
        <div slot="top">
          Top
        </div>
        <q-tr slot="top-row" slot-scope="props">
          <q-td colspan="100%">
            Top row
          </q-td>
        </q-tr>

        <q-tr slot="bottom-row" slot-scope="props">
          <q-td colspan="100%">
            Bottom row
          </q-td>
        </q-tr>

        <div slot="bottom">
          Bottom
        </div>
      </q-table>

      <h2>selection template</h2>
      <q-toggle v-model="selectionToggle" />
      <q-table
        :data="data"
        :columns="columns"
        :filter="filter"
        :color="color"
        row-key="name"
        :selection="selection"
        :selected.sync="selected"
        :loader="loader"
        :visible-columns="visibleColumns"
        :title="title"
      >
        <q-tr slot="header" slot-scope="props">
          <q-th auto-width>
            <q-checkbox v-if="props.multipleSelect" v-model="props.selected" :indeterminate="props.partialSelected" :color="color" />
          </q-th>
          <q-th v-for="col in props.cols" :key="col.name" :props="props">
            @ {{col.label}}
          </q-th>
        </q-tr>

        <template slot="body" slot-scope="props">
          <q-tr :props="props">
            <q-td auto-width>
              <q-checkbox :color="color" v-model="props.selected" />
            </q-td>
            <q-td key="desc" :props="props">
              <q-checkbox :color="color" v-model="props.expand" checked-icon="remove" unchecked-icon="add" />
              %%% {{ props.row.name }} %%%
            </q-td>
            <q-td key="calories" :props="props">{{ props.row.calories }}</q-td>
            <q-td key="fat" :props="props">{{ props.row.fat }}</q-td>
            <q-td key="carbs" :props="props">{{ props.row.carbs }}</q-td>
            <q-td key="protein" :props="props">{{ props.row.protein }}</q-td>
            <q-td key="sodium" :props="props">{{ props.row.sodium }}</q-td>
            <q-td key="calcium" :props="props">{{ props.row.calcium }}</q-td>
            <q-td key="iron" :props="props">
              <q-chip square color="amber">{{ props.row.iron }}</q-chip>
            </q-td>
          </q-tr>
          <q-tr v-show="props.expand" :props="props">
            <q-td colspan="100%">
              <div class="text-left">This is expand slot for row above: {{props.row.name}}.</div>
            </q-td>
          </q-tr>
        </template>
      </q-table>
      <q-table
        :data="data"
        :columns="columns"
        :filter="filter"
        :color="color"
        row-key="name"
        :selection="selection"
        :selected.sync="selected"
        :loader="loader"
        :visible-columns="visibleColumns"
        :title="title"
      >
        <q-tr slot="header" slot-scope="props">
          <q-th auto-width>
            <q-checkbox v-if="props.multipleSelect" v-model="props.selected" :indeterminate="props.partialSelected" :color="color" />
          </q-th>
          <q-th v-for="col in props.cols" :key="col.name" :props="props">
            @ {{col.label}}
          </q-th>
        </q-tr>
        <q-tr slot="body" slot-scope="props" :key="props.key" :props="props">
          <q-td auto-width>
            <q-checkbox :color="color" v-model="props.selected" />
          </q-td>
          <q-td v-for="col in props.cols" :key="col.name" :props="props">
            ^{{ col.value }}
          </q-td>
        </q-tr>
      </q-table>

      <q-table
        :data="data"
        :columns="columns"
        :filter="filter"
        :color="color"
        row-key="name"
        :selection="selection"
        :selected.sync="selected"
        :loader="loader"
        :visible-columns="visibleColumns"
        :title="title"
      >
        <q-th slot="header-cell" slot-scope="props" :props="props">
          # {{props.col.label}}
        </q-th>
        <q-td slot="body-cell" slot-scope="props" :props="props">
          !{{ props.value }}
        </q-td>
      </q-table>

      <q-table
        :data="data"
        :columns="columns"
        :filter="filter"
        :color="color"
        row-key="name"
        :selection="selection"
        :selected.sync="selected"
        :loader="loader"
        :visible-columns="visibleColumns"
        :title="title"
      />
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      selectionToggle: false,
      loader: false,
      color: 'amber',
      visibleColumns: ['desc', 'fat', 'carbs', 'protein', 'sodium', 'calcium', 'iron'],
      separator: 'horizontal',
      selected: [],

      serverPagination: {
        page: 1,
        rowsNumber: 10
      },
      serverData: [],

      title: 'QDataTable',
      filter: '',
      columns: [
        {
          name: 'desc',
          required: true,
          label: 'Dessert (100g serving)',
          align: 'left',
          field: row => row.name,
          format: val => `~${val}`,
          sortable: true
        },
        { name: 'calories', align: 'center', label: 'Calories', field: 'calories', sortable: true },
        { name: 'fat', label: 'Fat (g)', field: 'fat', sortable: true },
        { name: 'carbs', label: 'Carbs (g)', field: 'carbs' },
        { name: 'protein', label: 'Protein (g)', field: 'protein' },
        { name: 'sodium', label: 'Sodium (mg)', field: 'sodium' },
        { name: 'calcium', label: 'Calcium (%)', field: 'calcium', sortable: true, sort: (a, b) => parseInt(a, 10) - parseInt(b, 10) },
        { name: 'iron', label: 'Iron (%)', field: 'iron', sortable: true, sort: (a, b) => parseInt(a, 10) - parseInt(b, 10) }
      ],
      data: [
        {
          name: '1Frozen Yogurt',
          calories: 159,
          fat: 6.0,
          carbs: 24,
          protein: 4.0,
          sodium: 87,
          calcium: '14%',
          iron: '1%'
        },
        {
          name: '2Ice cream sandwich',
          calories: 237,
          fat: 9.0,
          carbs: 37,
          protein: 4.3,
          sodium: 129,
          calcium: '8%',
          iron: '1%'
        },
        {
          name: '3Eclair',
          calories: 262,
          fat: 16.0,
          carbs: 23,
          protein: 6.0,
          sodium: 337,
          calcium: '6%',
          iron: '7%'
        },
        {
          name: '4Cupcake',
          calories: 305,
          fat: 3.7,
          carbs: 67,
          protein: 4.3,
          sodium: 413,
          calcium: '3%',
          iron: '8%'
        },
        {
          name: '5Gingerbread',
          calories: 356,
          fat: 16.0,
          carbs: 49,
          protein: 3.9,
          sodium: 327,
          calcium: '7%',
          iron: '16%'
        },
        {
          name: '6Jelly bean',
          calories: 375,
          fat: 0.0,
          carbs: 94,
          protein: 0.0,
          sodium: 50,
          calcium: '0%',
          iron: '0%'
        },
        {
          name: '7Lollipop',
          calories: 392,
          fat: 0.2,
          carbs: 98,
          protein: 0,
          sodium: 38,
          calcium: '0%',
          iron: '2%'
        },
        {
          name: '8Honeycomb',
          calories: 408,
          fat: 3.2,
          carbs: 87,
          protein: 6.5,
          sodium: 562,
          calcium: '0%',
          iron: '45%'
        },
        {
          name: '9Donut',
          calories: 452,
          fat: 25.0,
          carbs: 51,
          protein: 4.9,
          sodium: 326,
          calcium: '2%',
          iron: '22%'
        },
        {
          name: '10KitKat',
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
  computed: {
    selection () {
      return this.selectionToggle ? 'multiple' : 'single'
    },
    visibleColumnsOptions () {
      return this.columns.filter(col => !col.required).map(col => ({
        value: col.name,
        label: col.label
      }))
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
    this.request({
      pagination: this.serverPagination,
      filter: this.filter
    })
  }
}
</script>

<style lang="stylus">
.q-table + .q-table
  margin-top 25px
</style>
