<template>
  <div class="q-pa-md">
    <div class="row items-center q-gutter-sm q-mb-md">
      <q-btn label="Toggle data / no data" no-caps color="primary" @click="toggleData" />
      <q-toggle label="Hide bottom" v-model="hideBottom" />
      <q-toggle label="Hide sel rows banner" v-model="hideSelectedBanner" />
      <q-toggle label="Hide no data" v-model="hideNoData" />
      <q-toggle label="Hide pagination" v-model="hidePagination" />
    </div>

    <q-table
      title="Treats"
      :data="rows"
      :columns="columns"
      row-key="name"
      selection="multiple"
      :selected.sync="selected"
      :hide-bottom="hideBottom"
      :hide-selected-banner="hideSelectedBanner"
      :hide-no-data="hideNoData"
      :hide-pagination="hidePagination"
      no-hover
      column-sort-order="da"
    >
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td auto-width>
            <q-toggle dense v-model="props.selected" />
          </q-td>
          <q-td key="desc" :props="props" no-hover>
            {{ props.rowIndex }} / {{ props.pageIndex }} -
            {{ props.row.name }}
            <q-btn dense round flat :icon="props.expand ? 'arrow_drop_up' : 'arrow_drop_down'" @click="props.expand = !props.expand" />
          </q-td>
          <q-td key="calories" :props="props">{{ props.row.calories }}</q-td>
          <q-td key="fat" :props="props">{{ props.row.fat }}</q-td>
          <q-td key="carbs" :props="props">{{ props.row.carbs }}</q-td>
          <q-td key="protein" :props="props">{{ props.row.protein }}</q-td>
          <q-td key="sodium" :props="props">{{ props.row.sodium }}</q-td>
          <q-td key="calcium" :props="props">{{ props.row.calcium }}</q-td>
          <q-td key="iron" :props="props">
            <q-badge color="amber">
              {{ props.row.iron }}
            </q-badge>
          </q-td>
        </q-tr>
        <q-tr v-show="props.expand" :props="props" no-hover>
          <q-td colspan="100%">
            <q-table
              :data="rows"
              :columns="columns"
            >
              <q-tr :props="props" />
            </q-table>
          </q-td>
        </q-tr>
      </template>
    </q-table>

    <q-table
      class="q-mt-md"
      title="classes() & style() with no slots"
      :data="rows"
      :columns="columns"
      row-key="name"
    />
  </div>
</template>

<script>
const rows = [
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
      hideBottom: false,
      hideSelectedBanner: false,
      hideNoData: false,
      hidePagination: false,
      selected: [],
      columns: [
        {
          name: 'desc',
          required: true,
          label: 'Dessert (100g serving)',
          align: 'left',
          field: row => row.name,
          format: val => `${val}`,
          sortable: true
        },
        {
          name: 'calories', align: 'center', label: 'Calories', field: 'calories', sortable: true, // eslint-disable-line
          classes: row => (row.calories % 2 === 0 ? 'bg-green text-white' : 'bg-yellow')
        },
        {
          name: 'fat', sortOrder: 'ad', label: 'Fat (g)', field: 'fat', sortable: true, // eslint-disable-line
          style: row => 'width:10px' + (row.fat % 2 === 0 ? ';font-size: 2em' : '')
        },
        { name: 'carbs', label: 'Carbs (g)', field: 'carbs' },
        { name: 'protein', label: 'Protein (g)', field: 'protein' },
        { name: 'sodium', label: 'Sodium (mg)', field: 'sodium' },
        { name: 'calcium', label: 'Calcium (%)', field: 'calcium', sortable: true, sort: (a, b) => parseInt(a, 10) - parseInt(b, 10) },
        { name: 'iron', label: 'Iron (%)', field: 'iron', sortable: true, sort: (a, b) => parseInt(a, 10) - parseInt(b, 10) }
      ],
      rows
    }
  },

  methods: {
    toggleData () {
      this.rows = this.rows.length === 0
        ? rows
        : []
    }
  }
}
</script>
