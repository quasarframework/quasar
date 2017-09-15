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
      <q-data-table
        ref="server"
        :data="serverData"
        :columns="columns"
        :title="title"
        :filter.sync="filter"
        :loader="loader"
        selection="multiple"
        row-key="name"
        :pagination.sync="serverPagination"
        :separator="separator"
        @request="request"
      >
        <template slot="top-right" scope="props">
          <q-search v-model="filter" />
        </template>
      </q-data-table>

      <h2>NO templates</h2>
      <q-data-table
        compact
        dark
        class="bg-dark"
        color="grey-3"
        :separator="separator"
        :data="data"
        :columns="columns"
        :title="title"
        :filter.sync="filter"
        :loader="loader"
        selection="multiple"
        row-key="name"
      />

      <h2>body-cell-desc template</h2>
      <q-data-table
        compact
        :data="data"
        :columns="columns"
        :title="title"
        :filter.sync="filter"
        :loader="loader"
        :selection="selection"
        :visible-columns="visibleColumns"
        row-key="name"
        color="secondary"
        :separator="separator"
      >
        <template slot="top-selection" scope="props">
          Selection
        </template>
        <template slot="top-left" scope="props">
          <q-btn flat color="secondary" label="Button" />
        </template>
        <template slot="top-right" scope="props">
          <q-data-table-columns color="secondary" v-model="visibleColumns" :columns="columns" />
        </template>
        <template slot="body-cell-desc" scope="props">
          <td :class="props.col.__tdClass">
            <q-chip color="secondary">{{ props.value }}</q-chip>
            <br>
            <q-chip color="secondary">{{ props.value }}</q-chip>
          </td>
        </template>
      </q-data-table>

      <h2>no-top, no-bottom</h2>
      <q-data-table
        :data="data"
        :columns="columns"
        :title="title"
        :filter.sync="filter"
        :loader="loader"
        row-key="name"
        color="primary"
        no-top
        no-bottom
      />

      <h2>top-left template</h2>
      <q-data-table
        :data="data"
        :columns="columns"
        :title="title"
        :filter.sync="filter"
        :loader="loader"
        :selection="selection"
        :visible-columns="visibleColumns"
        row-key="name"
        color="amber"
      >
        <template slot="top-left" scope="props">
          <div>
            Top left template
          </div>
        </template>
        <template slot="top-right" scope="props">
          <div class="row items-center">
            <q-btn flat round small color="grey-8" icon="filter_list" class="on-right" />
            <q-btn flat round small color="grey-8" icon="more_vert" class="on-right" />
          </div>
        </template>
        <template slot="top-selection" scope="props">
          <div>
            Selection
          </div>
        </template>
      </q-data-table>

      <h2>top template</h2>
      <q-data-table
        :data="data"
        :columns="columns"
        :title="title"
        :filter.sync="filter"
        :loader="loader"
        row-key="name"
        color="primary"
      >
        <template slot="top" scope="props">
          <div slot="top" class="row items-center">
            Some awesome table
          </div>
        </template>
      </q-data-table>

      <h2>header-cell</h2>
      <q-data-table
        :data="data"
        :columns="columns"
        :title="title"
        :filter="filter"
        row-key="name"
      >
        <template slot="header-cell" scope="props">
          <th @click="props.sort(props.col)" :class="props.col.__thClass">
            # {{props.col.label}}
             <q-icon :class="props.col.__iconClass" name="arrow_upward" />
          </th>
        </template>
      </q-data-table>

      <h2>header</h2>
      <q-data-table
        :data="data"
        :columns="columns"
        :filter="filter"
        :title="title"
        row-key="name"
      >
        <template slot="header" scope="props">
          <tr>
            <th v-for="col in props.cols" :key="col.label" @click="props.sort(col)" :class="col.__thClass">
              {{col.label}} <q-icon :class="col.__iconClass" name="arrow_upward" />
            </th>
          </tr>
        </template>
      </q-data-table>

      <h2>body template</h2>
      <q-data-table
        :data="data"
        :columns="columns"
        :filter="filter"
        :title="title"
        row-key="name"
      >
        <template slot="body" scope="props">
          <tr :key="props.key" :class="props.__trClass">
            <td>
              {{ props.row.name }}
              <q-popover>
                <q-input v-model="props.row.name" />
              </q-popover>
            </td>
            <td class="text-right">{{ props.row.calories }}</td>
            <td class="text-right">{{ props.row.fat }}</td>
            <td class="text-right">{{ props.row.carbs }}</td>
            <td class="text-right">{{ props.row.protein }}</td>
            <td class="text-right">{{ props.row.sodium }}</td>
            <td class="text-right">{{ props.row.calcium }}</td>
            <td class="text-right">
              <q-chip square color="amber">{{ props.row.iron }}</q-chip>
            </td>
          </tr>
        </template>
      </q-data-table>

      <h2>body-cell template</h2>
      <q-data-table
        :data="data"
        :columns="columns"
        :filter="filter"
        :title="title"
        row-key="name"
      >
        <template slot="body-cell" scope="props">
          <td :class="props.col.__tdClass">!{{ props.value }}</td>
        </template>
      </q-data-table>

      <h2>before/after header/footer template</h2>
      <q-data-table
        :data="data"
        :columns="columns"
        :filter="filter"
        :title="title"
        row-key="name"
      >
        <div slot="top">
          Top
        </div>
        <template slot="top-row" scope="props">
          <tr>
            <td colspan="100%">
              Top row
            </td>
          </tr>
        </template>

        <template slot="bottom-row" scope="props">
          <tr>
            <td colspan="100%">
              Bottom row
            </td>
          </tr>
        </template>
        <div slot="bottom">
          Bottom
        </div>
      </q-data-table>

      <h2>selection template</h2>
      <q-toggle v-model="selectionToggle" />
      <q-data-table
        :data="data"
        :columns="columns"
        :filter="filter"
        :color="color"
        row-key="name"
        :selection="selection"
        :loader="loader"
        :visible-columns="visibleColumns"
        :title="title"
      >
        <template slot="header" scope="props">
          <tr>
            <th class="q-table-select">
              <q-checkbox v-if="props.multipleSelect" v-model="props.selected" :indeterminate="props.partialSelected" :color="color" />
            </th>
            <th v-for="col in props.cols" :key="col.label" @click="props.sort(col)">
              @ {{col.label}}
              <q-icon :class="col.__iconClass" name="arrow_upward" />
            </th>
          </tr>
        </template>
        <template slot="body" scope="props">
          <tr :key="props.key" :class="props.__trClass">
            <td>
              <q-checkbox :color="color" v-model="props.selected" />
            </td>
            <td>
              <q-checkbox :color="color" v-model="props.expand" checked-icon="remove" unchecked-icon="add" />
              %%% {{ props.row.name }} %%%
            </td>
            <td class="text-center">{{ props.row.calories }}</td>
            <td class="text-right">{{ props.row.fat }}</td>
            <td class="text-right">{{ props.row.carbs }}</td>
            <td class="text-right">{{ props.row.protein }}</td>
            <td class="text-right">{{ props.row.sodium }}</td>
            <td class="text-right">{{ props.row.calcium }}</td>
            <td class="text-right">
              <q-chip square color="amber">{{ props.row.iron }}</q-chip>
            </td>
          </tr>
          <tr v-show="props.expand" :key="`expand-${props.key}`">
            <td colspan="100%">
              <div class="text-center">This is expand slot for row above: {{props.row.name}}.</div>
            </td>
          </tr>
        </template>
      </q-data-table>
      <q-data-table
        :data="data"
        :columns="columns"
        :filter="filter"
        :color="color"
        row-key="name"
        :selection="selection"
        :loader="loader"
        :visible-columns="visibleColumns"
        :title="title"
      >
        <template slot="header" scope="props">
          <tr>
            <th class="q-table-select">
              <q-checkbox v-if="props.multipleSelect" v-model="props.selected" :indeterminate="props.partialSelected" :color="color" />
            </th>
            <th v-for="col in props.cols" :key="col.label" @click="props.sort(col)" :class="col.__thClass">
              @ {{col.label}}
              <q-icon :class="col.__iconClass" name="arrow_upward" />
            </th>
          </tr>
        </template>
        <template slot="body" scope="props">
          <tr :key="props.key" :class="props.__trClass">
            <td>
              <q-checkbox :color="color" v-model="props.selected" />
            </td>
            <td v-for="col in props.cols" :key="col.name" :class="col.__tdClass">^{{ col.value }}</td>
          </tr>
        </template>
      </q-data-table>

      <q-data-table
        :data="data"
        :columns="columns"
        :filter="filter"
        :color="color"
        row-key="name"
        :selection="selection"
        :loader="loader"
        :visible-columns="visibleColumns"
        :title="title"
      >
        <template slot="header-cell" scope="props">
          <th @click="props.sort(props.col)" :class="props.col.__thClass">
            # {{props.col.label}}
            <q-icon :class="props.col.__iconClass" name="arrow_upward" />
          </th>
        </template>
        <template slot="body-cell" scope="props">
          <td :class="props.col.__tdClass">!{{ props.value }}</td>
        </template>
      </q-data-table>

      <q-data-table
        :data="data"
        :columns="columns"
        :filter="filter"
        :color="color"
        row-key="name"
        :selection="selection"
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
          field: row => `~${row.name}~`,
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
          rows = table.filterMethod(rows, table.computedColumns, props.filter)
        }

        if (sortBy) {
          rows = table.sortMethod(rows, table.computedColumns.find(def => def.name === sortBy), descending)
        }

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
.q-datatable + .q-datatable
  margin-top 25px
</style>
