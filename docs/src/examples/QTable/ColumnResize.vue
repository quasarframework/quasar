<template>
  <div class="q-pa-md">
    <q-table
      title="Resizable Columns"
      :rows="rows"
      :columns="columns"
      row-key="name"
      resizable-columns
      @column-resize="onColumnResize"
    />

    <div class="q-mt-md">
      Column widths: {{ columnWidths }}
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

const columns = [
  {
    name: 'name',
    required: true,
    label: 'Dessert (100g serving)',
    align: 'left',
    field: row => row.name,
    sortable: true
  },
  { name: 'calories', align: 'center', label: 'Calories', field: 'calories', sortable: true },
  { name: 'fat', label: 'Fat (g)', field: 'fat', sortable: true },
  { name: 'carbs', label: 'Carbs (g)', field: 'carbs' },
  { name: 'protein', label: 'Protein (g)', field: 'protein' },
  { name: 'sodium', label: 'Sodium (mg)', field: 'sodium' }
]

const rows = [
  { name: 'Frozen Yogurt', calories: 159, fat: 6.0, carbs: 24, protein: 4.0, sodium: 87 },
  { name: 'Ice cream sandwich', calories: 237, fat: 9.0, carbs: 37, protein: 4.3, sodium: 129 },
  { name: 'Eclair', calories: 262, fat: 16.0, carbs: 23, protein: 6.0, sodium: 337 },
  { name: 'Cupcake', calories: 305, fat: 3.7, carbs: 67, protein: 4.3, sodium: 413 },
  { name: 'Gingerbread', calories: 356, fat: 16.0, carbs: 49, protein: 3.9, sodium: 327 }
]

export default {
  setup () {
    const columnWidths = ref({})

    function onColumnResize (evt) {
      columnWidths.value = evt.widths
    }

    return {
      columns,
      rows,
      columnWidths,
      onColumnResize
    }
  }
}
</script>
