<template>
  <div class="q-layout-padding">
    <!--
      This is for fast tests.
      Use this page but don't add it into your commits (leave it outside
      of your commit).

      For some test that you think it should be persistent,
      make a new *.vue file here or in another folder under /dev/components.
    -->
    <q-table
      :rows="xxl"
      :columns="columns"
      :filter="filter"
      :color="color"
      row-key="name"
      v-model:pagination="pagination"
      :selection="selection"
      v-model:selected="selected"
      :loading="loading"
      :visible-columns="visibleColumns"
      :title="title"
      table-style="max-height: 500px;"
    />
  </div>
</template>

<script setup>
import { clone } from 'quasar'
import { computed, ref } from 'vue'

// deterministic values: this data is server-rendered, so the
// client hydration must produce the exact same output
let randSeed = 1
const rand = () => {
  randSeed = (randSeed * 16_807) % 2_147_483_647
  return Math.floor((randSeed / 2_147_483_647) * 450)
}
let rowId = 0
const nextRowName = () => `row-${++rowId}`

const selectionToggle = ref(false)
const loading = ref(false)
const color = ref('amber')
const visibleColumns = ref([
  'desc',
  'fat',
  'carbs',
  'protein',
  'sodium',
  'calcium',
  'iron'
])
const separator = ref('horizontal')
const selected = ref([])
const selection = ref('multiple')

const pagination = ref({
  page: 1,
  rowsPerPage: 50
})
const serverData = ref([])

const title = ref('QDataTable')
const filter = ref('')
const columns = ref([
  {
    name: 'desc',
    required: true,
    label: 'Dessert (100g serving)',
    align: 'left',
    field: row => row.name,
    format: val => `~${val}`,
    sortable: true
  },
  {
    name: 'calories',
    align: 'center',
    label: 'Calories',
    field: 'calories',
    sortable: true
  },
  { name: 'fat', label: 'Fat (g)', field: 'fat', sortable: true },
  { name: 'carbs', label: 'Carbs (g)', field: 'carbs' },
  { name: 'protein', label: 'Protein (g)', field: 'protein' },
  { name: 'sodium', label: 'Sodium (mg)', field: 'sodium' },
  {
    name: 'calcium',
    label: 'Calcium (%)',
    field: 'calcium',
    sortable: true,
    sort: (a, b) => Number.parseInt(a, 10) - Number.parseInt(b, 10)
  },
  {
    name: 'iron',
    label: 'Iron (%)',
    field: 'iron',
    sortable: true,
    sort: (a, b) => Number.parseInt(a, 10) - Number.parseInt(b, 10)
  }
])
const data = ref([
  {
    name: '1Frozen Yogurt',
    calories: 159,
    fat: 6,
    carbs: 24,
    protein: 4,
    sodium: 87,
    calcium: '14%',
    iron: '1%'
  },
  {
    name: '2Ice cream sandwich',
    calories: 237,
    fat: 9,
    carbs: 37,
    protein: 4.3,
    sodium: 129,
    calcium: '8%',
    iron: '1%'
  },
  {
    name: '3Eclair',
    calories: 262,
    fat: 16,
    carbs: 23,
    protein: 6,
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
    fat: 16,
    carbs: 49,
    protein: 3.9,
    sodium: 327,
    calcium: '7%',
    iron: '16%'
  },
  {
    name: '6Jelly bean',
    calories: 375,
    fat: 0,
    carbs: 94,
    protein: 0,
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
    fat: 25,
    carbs: 51,
    protein: 4.9,
    sodium: 326,
    calcium: '2%',
    iron: '22%'
  },
  {
    name: '10KitKat',
    calories: 518,
    fat: 26,
    carbs: 65,
    protein: 7,
    sodium: 54,
    calcium: '12%',
    iron: '6%'
  }
])

const xxl = computed(() => {
  const rows = clone(data.value)
  for (let i = 0; i < 500; i++) {
    rows.push({
      name: nextRowName(),
      calories: rand(),
      fat: rand(),
      carbs: rand(),
      protein: rand(),
      sodium: rand(),
      calcium: rand(),
      iron: rand()
    })
  }
  return rows
})
</script>
