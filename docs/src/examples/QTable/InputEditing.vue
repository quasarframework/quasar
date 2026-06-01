<template>
  <div class="q-pa-md">
    <q-table
      flat
      bordered
      title="Treats"
      :rows="rows"
      :columns="columns"
      row-key="id"
    >
      <template v-slot:body-cell="props">
        <q-td :props="props">
          <q-input
            v-model.number="props.row[props.col.name]"
            input-class="text-right"
            type="number"
            dense
            borderless
          />
        </q-td>
      </template>
    </q-table>
  </div>
</template>

<script>
import { ref } from 'vue'

const columns = [
  // #region
  {
    name: 'calories',
    align: 'right',
    label: 'Calories',
    field: 'calories',
    sortable: true
  },
  {
    name: 'fat',
    align: 'right',
    label: 'Fat (g)',
    field: 'fat',
    sortable: true
  },
  { name: 'carbs', align: 'right', label: 'Carbs (g)', field: 'carbs' },
  { name: 'protein', align: 'right', label: 'Protein (g)', field: 'protein' },
  { name: 'sodium', align: 'right', label: 'Sodium (mg)', field: 'sodium' }
  // #endregion
]

const rows = [
  // #region
  {
    id: 1,
    calories: 159,
    fat: 6,
    carbs: 24,
    protein: 4,
    sodium: 87
  },
  {
    id: 2,
    calories: 237,
    fat: 9,
    carbs: 37,
    protein: 4.3,
    sodium: 129
  },
  {
    id: 3,
    calories: 262,
    fat: 16,
    carbs: 23,
    protein: 6,
    sodium: 337
  },
  {
    id: 4,
    calories: 305,
    fat: 3.7,
    carbs: 67,
    protein: 4.3,
    sodium: 413
  }
  // #endregion
]

export default {
  setup() {
    return {
      columns,
      rows: ref(rows)
    }
  }
}
</script>
