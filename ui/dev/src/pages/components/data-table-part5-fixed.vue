<template>
  <div class="q-layout-padding">
    <q-input filled v-model="filter" label="Search" debounce="300">
      <template v-slot:append>
        <q-icon name="search" />
      </template>
    </q-input>

    <div>
      <q-toggle color="primary" v-model="loading" label="Show loading" />
      <q-toggle color="primary" v-model="dense" label="Dense" />
      <q-select filled multiple v-model="visibleColumns" :options="columns" option-value="name" option-disable="required" emit-value />
      <q-select class="q-mt-md" filled v-model="separator" :options="['horizontal', 'vertical', 'cell', 'none']" />
    </div>

    <h2>Fixed header</h2>
    <q-table
      :dense="dense"
      table-style="max-height: 500px"
      class="table-sticky"
      :separator="separator"
      :rows="data"
      :columns="columns"
      :title="title"
      :filter="filter"
      :loading="loading"
      :visible-columns="visibleColumns"
      row-key="index"
      virtual-scroll
      :virtual-scroll-sticky-start="dense ? 24 : 48"
      v-model:selected="selected"
      :rows-per-page-options="[0]"
    />

    <h2>Basic</h2>
    <q-table
      :dense="dense"
      table-style="max-height: 500px"
      :separator="separator"
      :rows="data"
      :columns="columns"
      :title="title"
      :filter="filter"
      :loading="loading"
      :visible-columns="visibleColumns"
      row-key="index"
      virtual-scroll
    />

    <h2>With slots</h2>
    <q-table
      ref="virtualScrollTable"
      :dense="dense"
      table-style="max-height: 500px"
      class="table-sticky"
      :separator="separator"
      :rows="data"
      :columns="columns"
      :title="title"
      :filter="filter"
      :loading="loading"
      :visible-columns="visibleColumns"
      row-key="index"
      :virtual-scroll="pagination.rowsPerPage === 0"
      :virtual-scroll-sticky-start="dense ? 24 : 48"
      @virtual-scroll="onVirtualScroll"
      v-model:pagination="pagination"
    >
      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th v-for="col in props.cols" :key="col.name" :props="props">
            {{ col.label }}
          </q-th>
        </q-tr>
      </template>

      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td v-for="col in props.cols" :key="col.name" :props="props">
            {{ col.value }}
          </q-td>
        </q-tr>
      </template>
    </q-table>
    <div class="q-pa-md">
      <q-input
        type="number"
        :model-value="listIndex"
        :min="0"
        :max="pagination.rowsPerPage === 0 ? listSize : pagination.rowsPerPage - 1"
        label="Scroll to index"
        input-class="text-right"
        @update:model-value="onIndexChange"
      />
    </div>

    <h2>With slots & different sizes</h2>
    <q-table
      :dense="dense"
      table-style="max-height: 500px"
      class="table-sticky"
      :separator="separator"
      :rows="data"
      :columns="columns"
      :title="title"
      :filter="filter"
      :loading="loading"
      :visible-columns="visibleColumns"
      row-key="index"
      virtual-scroll
      :virtual-scroll-sticky-start="dense ? 24 : 48"
      v-model:pagination="pagination"
    >
      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th v-for="col in props.cols" :key="col.name" :props="props">
            {{ col.label }}
          </q-th>
        </q-tr>
      </template>

      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td v-for="col in props.cols" :key="col.name" :props="props">
            {{ col.value }}
            <div v-if="pagination.page % 2 === 0" style="height: 50px;" />
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>

<script>
const seed = [
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

// we generate lots of rows here
let data = []
const listSize = 1000
for (let i = 0; i < listSize; i++) {
  data = data.concat(seed.slice(0).map(r => ({ ...r })))
}
data.forEach((row, index) => {
  row.index = index
})

export default {
  data () {
    return {
      dense: false,
      title: 'QDataTable',
      filter: '',
      loading: false,
      selected: [],
      visibleColumns: [ 'index', 'desc', 'fat', 'carbs', 'protein', 'sodium', 'calcium', 'iron' ],
      separator: 'horizontal',
      pagination: {
        rowsPerPage: 0
      },

      listSize: listSize * seed.length - 1,
      listIndex: 50,

      columns: [
        {
          name: 'index',
          label: '#',
          field: 'index'
        },
        {
          name: 'desc',
          required: true,
          label: 'Dessert (100g serving)',
          align: 'left',
          field: row => row.name,
          format: val => `~${ val }`,
          sortable: true
        },
        { name: 'calories', align: 'center', label: 'Calories', field: 'calories', sortable: true },
        { name: 'fat', label: 'Fat (g)', field: 'fat', sortable: true },
        { name: 'carbs', label: 'Carbs (g)', field: 'carbs' },
        { name: 'protein', label: 'Protein (g)', field: 'protein' },
        { name: 'sodium', label: 'Sodium (mg)', field: 'sodium' },
        { name: 'calcium', label: 'Calcium (%)', field: 'calcium', sortable: true, sort: (a, b) => parseInt(a, 10) - parseInt(b, 10) },
        { name: 'iron', label: 'Iron (%)', field: 'iron', sortable: true, sort: (a, b) => parseInt(a, 10) - parseInt(b, 10) }
      ]
    }
  },

  methods: {
    onIndexChange (index) {
      this.$refs.virtualScrollTable.scrollTo(index)
    },
    onVirtualScroll ({ index }) {
      this.listIndex = index
    }
  },

  created () {
    this.data = data
  },

  mounted () {
    this.$refs.virtualScrollTable.scrollTo(this.listIndex)
  }
}
</script>

<style lang="sass">
.table-sticky
  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th /* bg color is important for th; just specify one */
    background-color: #c1f4cd

  thead tr th
    position: sticky
    z-index: 1
  thead tr:last-child th // this will be the loading indicator
    top: 48px // height of all previous header rows
  thead tr:first-child th
    top: 0
</style>
