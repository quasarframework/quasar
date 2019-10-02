<template>
  <div class="q-layout-padding">
    <q-input filled v-model="filter" label="Search" debounce="300">
      <q-icon slot="append" name="search" />
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
      :data="bigdata"
      :columns="columns"
      :title="title"
      :filter="filter"
      :loading="loading"
      :visible-columns="visibleColumns"
      row-key="_index"
      virtual-scroll
      :pagination.sync="pagination"
      :rows-per-page-options="[0]"
    />

    <h2>Basic</h2>
    <q-table
      :dense="dense"
      table-style="max-height: 500px"
      :separator="separator"
      :data="bigdata"
      :columns="columns"
      :title="title"
      :filter="filter"
      :loading="loading"
      :visible-columns="visibleColumns"
      row-key="_index"
      virtual-scroll
    />

    <h2>With slots</h2>
    <q-table
      :dense="dense"
      table-style="max-height: 500px"
      class="table-sticky"
      :separator="separator"
      :data="bigdata"
      :columns="columns"
      :title="title"
      :filter="filter"
      :loading="loading"
      :visible-columns="visibleColumns"
      row-key="_index"
      virtual-scroll
      :pagination.sync="pagination"
      :rows-per-page-options="[0]"
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
  </div>
</template>

<script>
const data = [
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

const multiplier = 1000
let bigdata = []
for (let i = 0; i < multiplier; i++) {
  bigdata = bigdata.concat(data)
}

export default {
  data () {
    return {
      dense: false,
      title: 'QDataTable',
      filter: '',
      loading: false,
      visibleColumns: ['desc', 'fat', 'carbs', 'protein', 'sodium', 'calcium', 'iron'],
      separator: 'horizontal',
      pagination: {
        rowsPerPage: 0
      },

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
      ]
    }
  },

  created () {
    this.bigdata = bigdata
  }
}
</script>

<style lang="stylus">
.table-sticky
  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th /* bg color is important for th; just specify one */
    background-color: #c1f4cd

  thead tr:first-child th
    position: sticky
    top: 0
    opacity: 1
    z-index: 1
</style>
