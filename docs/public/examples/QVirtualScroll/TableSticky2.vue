<template>
  <div class="q-pa-md">
    <q-virtual-scroll
      type="table"
      style="max-height: 70vh"
      :virtual-scroll-item-size="48"
      :virtual-scroll-sticky-size-start="48"
      :virtual-scroll-sticky-size-end="32"
      :items="heavyList"
    >
      <template v-slot:before>
        <thead class="thead-custom-sticky text-left">
          <tr>
            <th>#</th>
            <th v-for="col in columns" :key="'1--' + col.name2">
              {{ col.name1 }}
            </th>
          </tr>
          <tr>
            <th>Index</th>
            <th v-for="col in columns" :key="'2--' + col.name2">
              {{ col.name2 }}
            </th>
          </tr>
        </thead>
      </template>

      <template v-slot:after>
        <tfoot class="tfoot-custom-sticky text-left">
          <tr>
            <th>#</th>
            <th v-for="col in columns" :key="'3--' + col.name2">
              {{ col.name1 }}
            </th>
          </tr>
          <tr>
            <th>Index</th>
            <th v-for="col in columns" :key="'4--' + col.name2">
              {{ col.name2 }}
            </th>
          </tr>
        </tfoot>
      </template>

      <template v-slot="{ item: row, index }">
        <tr :key="index">
          <td>#{{ index }}</td>
          <td v-for="col in columns" :key="index + '-' + col.name2">
            {{ row[col.prop] }}
          </td>
        </tr>
      </template>
    </q-virtual-scroll>
  </div>
</template>

<style lang="sass">
.thead-custom-sticky tr > *,
.tfoot-custom-sticky tr > *
  position: sticky
  opacity: 1
  z-index: 1
  background-color: black
  color: white

.thead-custom-sticky tr:last-child > *
  top: 0

.tfoot-custom-sticky tr:first-child > *
  bottom: 0
</style>

<script>
const rows = [
  {
    name: 'Frozen Yogurt',
    calories: 159,
    fat: 6.0,
    carbs: 24,
    protein: 4.0,
    sodium: 87,
    calcium: '14%'
  },
  {
    name: 'Ice cream sandwich',
    calories: 237,
    fat: 9.0,
    carbs: 37,
    protein: 4.3,
    sodium: 129,
    calcium: '8%'
  },
  {
    name: 'Eclair',
    calories: 262,
    fat: 16.0,
    carbs: 23,
    protein: 6.0,
    sodium: 337,
    calcium: '6%'
  },
  {
    name: 'Cupcake',
    calories: 305,
    fat: 3.7,
    carbs: 67,
    protein: 4.3,
    sodium: 413,
    calcium: '3%'
  },
  {
    name: 'Gingerbread',
    calories: 356,
    fat: 16.0,
    carbs: 49,
    protein: 3.9,
    sodium: 327,
    calcium: '7%'
  },
  {
    name: 'Jelly bean',
    calories: 375,
    fat: 0.0,
    carbs: 94,
    protein: 0.0,
    sodium: 50,
    calcium: '0%'
  },
  {
    name: 'Lollipop',
    calories: 392,
    fat: 0.2,
    carbs: 98,
    protein: 0,
    sodium: 38,
    calcium: '0%'
  },
  {
    name: 'Honeycomb',
    calories: 408,
    fat: 3.2,
    carbs: 87,
    protein: 6.5,
    sodium: 562,
    calcium: '0%'
  },
  {
    name: 'Donut',
    calories: 452,
    fat: 25.0,
    carbs: 51,
    protein: 4.9,
    sodium: 326,
    calcium: '2%'
  },
  {
    name: 'KitKat',
    calories: 518,
    fat: 26.0,
    carbs: 65,
    protein: 7,
    sodium: 54,
    calcium: '12%'
  }
]

const columns = [
  { name1: '(100g serving)', name2: 'Dessert', prop: 'name' },
  { name1: '(val)', name2: 'Calories', prop: 'calories' },
  { name1: '(g)', name2: 'Fat', prop: 'fat' },
  { name1: '(g)', name2: 'Carbs', prop: 'carbs' },
  { name1: '(g)', name2: 'Protein', prop: 'protein' },
  { name1: '(mg)', name2: 'Sodium', prop: 'sodium' },
  { name1: '(%)', name2: 'Calcium', prop: 'calcium' }
]

const heavyList = []

// adding same data multiple times to
// create a huge list
for (let i = 0; i <= 1000; i++) {
  Array.prototype.push.apply(heavyList, rows)
}

export default {
  setup () {
    return {
      heavyList,
      columns
    }
  }
}
</script>
