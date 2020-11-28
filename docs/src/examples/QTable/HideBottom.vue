<template>
  <div class="q-pa-md">
    <div class="row items-center q-gutter-sm q-mb-md">
      <q-toggle label="Fill with data" v-model="hasData" />
      <q-toggle label="Hide no data" v-model="hideNoData" />
      <q-toggle label="Hide bottom layer" v-model="hideBottom" />
      <q-toggle label="Hide pagination" v-model="hidePagination" />
      <q-toggle label="Hide selected rows banner" v-model="hideSelectedBanner" />
    </div>

    <q-table
      title="Treats"
      :rows="rows"
      :columns="columns"
      row-key="name"
      selection="multiple"
      v-model:selected="selected"
      :hide-bottom="hideBottom"
      :hide-selected-banner="hideSelectedBanner"
      :hide-no-data="hideNoData"
      :hide-pagination="hidePagination"
    />
  </div>
</template>

<script>
import { ref, computed } from 'vue'

const columns = [
  {
    name: 'name',
    required: true,
    label: 'Dessert (100g serving)',
    align: 'left',
    field: row => row.name,
    format: val => `${val}`,
    sortable: true
  },
  { name: 'calories', align: 'center', label: 'Calories', field: 'calories', sortable: true },
  { name: 'fat', label: 'Fat (g)', field: 'fat', sortable: true },
  { name: 'carbs', label: 'Carbs (g)', field: 'carbs' }
]

const rows = [
  {
    name: 'Frozen Yogurt',
    calories: 159,
    fat: 6.0,
    carbs: 24
  },
  {
    name: 'Ice cream sandwich',
    calories: 237,
    fat: 9.0,
    carbs: 37
  },
  {
    name: 'Eclair',
    calories: 262,
    fat: 16.0,
    carbs: 23
  },
  {
    name: 'Cupcake',
    calories: 305,
    fat: 3.7,
    carbs: 67
  },
  {
    name: 'Gingerbread',
    calories: 356,
    fat: 16.0,
    carbs: 49
  },
  {
    name: 'Jelly bean',
    calories: 375,
    fat: 0.0,
    carbs: 94
  },
  {
    name: 'Lollipop',
    calories: 392,
    fat: 0.2,
    carbs: 98
  },
  {
    name: 'Honeycomb',
    calories: 408,
    fat: 3.2,
    carbs: 87
  },
  {
    name: 'Donut',
    calories: 452,
    fat: 25.0,
    carbs: 51
  },
  {
    name: 'KitKat',
    calories: 518,
    fat: 26.0,
    carbs: 65
  }
]

export default {
  setup () {
    const hasData = ref(true)

    return {
      hasData,
      hideBottom: ref(false),
      hideSelectedBanner: ref(false),
      hideNoData: ref(false),
      hidePagination: ref(false),

      selected: ref([rows[ 1 ]]),

      columns,
      rows,

      records: computed(() => hasData.value === true ? rows : [])
    }
  }
}
</script>
