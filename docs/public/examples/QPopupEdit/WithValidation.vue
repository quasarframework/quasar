<template>
  <div class="q-pa-md">
   <q-table
      :rows="rows"
      :columns="columns"
      title="QDataTable with QPopupEdit"
      :rows-per-page-options="[]"
      row-key="name"
    >
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="desc" :props="props">
            {{ props.row.name }}
          </q-td>
          <q-td key="calories" :props="props">
            {{ props.row.calories }}
            <q-popup-edit
              v-model.number="props.row.calories"
              buttons
              label-set="Save"
              label-cancel="Close"
              :validate="caloriesRangeValidation"
              @hide="caloriesRangeValidation"
              v-slot="scope"
            >
              <q-input
                type="number"
                v-model.number="scope.value"
                hint="Enter a number between 4 and 7"
                :error="errorCalories"
                :error-message="errorMessageCalories"
                dense
                autofocus
                @keyup.enter="scope.set"
              />
            </q-popup-edit>
          </q-td>
          <q-td key="fat" :props="props">
            <div class="text-pre-wrap">{{ props.row.fat }}</div>
          </q-td>
          <q-td key="carbs" :props="props">
            {{ props.row.carbs }}
          </q-td>
          <q-td key="protein" :props="props">
            {{ props.row.protein }}
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>

<script>
import { ref } from 'vue'

const columns = [
  { name: 'desc', align: 'left', label: 'Dessert', field: 'name' },
  { name: 'calories', align: 'center', label: 'Calories (editable)', field: 'calories' },
  { name: 'fat', label: 'Fat', field: 'fat' },
  { name: 'carbs', label: 'Carbs', field: 'carbs' },
  { name: 'protein', label: 'Protein', field: 'protein' }
]

const rows = [
  {
    name: 'Frozen Yogurt',
    calories: 159,
    fat: 6.0,
    carbs: 24,
    protein: 4.0
  },
  {
    name: 'Ice cream sandwich',
    calories: 237,
    fat: 9.0,
    carbs: 37,
    protein: 4.3
  },
  {
    name: 'Eclair',
    calories: 262,
    fat: 16.0,
    carbs: 23,
    protein: 6.0
  },
  {
    name: 'Cupcake',
    calories: 305,
    fat: 3.7,
    carbs: 67,
    protein: 4.3
  },
  {
    name: 'Gingerbread',
    calories: 356,
    fat: 16.0,
    carbs: 49,
    protein: 3.9
  },
  {
    name: 'Jelly bean',
    calories: 375,
    fat: 0.0,
    carbs: 94,
    protein: 0.0
  },
  {
    name: 'Lollipop',
    calories: 392,
    fat: 0.2,
    carbs: 98,
    protein: 0
  },
  {
    name: 'Honeycomb',
    calories: 408,
    fat: 3.2,
    carbs: 87,
    protein: 6.5
  },
  {
    name: 'Donut',
    calories: 452,
    fat: 25.0,
    carbs: 51,
    protein: 4.9
  },
  {
    name: 'KitKat',
    calories: 518,
    fat: 26.0,
    carbs: 65,
    protein: 7
  }
]

export default {
  setup () {
    const errorCalories = ref(false)
    const errorMessageCalories = ref('')

    return {
      rows: ref(rows),
      columns,

      errorCalories,
      errorMessageCalories,

      caloriesRangeValidation (val) {
        if (val < 4 || val > 7) {
          errorCalories.value = true
          errorMessageCalories.value = 'The value must be between 4 and 7!'
          return false
        }
        errorCalories.value = false
        errorMessageCalories.value = ''
        return true
      }
    }
  }
}
</script>
