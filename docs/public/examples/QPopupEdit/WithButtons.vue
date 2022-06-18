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
            <q-popup-edit v-model="props.row.name" buttons v-slot="scope">
              <q-input v-model="scope.value" dense autofocus counter @keyup.enter="scope.set" />
            </q-popup-edit>
          </q-td>
          <q-td key="calories" :props="props">
            {{ props.row.calories }}
            <q-popup-edit v-model.number="props.row.calories" buttons v-slot="scope">
              <q-input type="number" v-model.number="scope.value" dense autofocus @keyup.enter="scope.set" />
            </q-popup-edit>
          </q-td>
          <q-td key="fat" :props="props">
            <div class="text-pre-wrap">{{ props.row.fat }}</div>
            <q-popup-edit v-model.number="props.row.fat" buttons v-slot="scope">
              <q-input type="number" v-model.number="scope.value" dense autofocus @keyup.enter="scope.set" />
            </q-popup-edit>
          </q-td>
          <q-td key="carbs" :props="props">
            {{ props.row.carbs }}
            <q-popup-edit v-model.number="props.row.carbs" buttons persistent v-slot="scope">
              <q-input type="number" v-model.number="scope.value" dense autofocus @keyup.enter="scope.set" />
            </q-popup-edit>
          </q-td>
          <q-td key="protein" :props="props">
            {{ props.row.protein }}
            <q-popup-edit v-model.number="props.row.protein" buttons label-set="Save" label-cancel="Close" v-slot="scope">
              <q-input type="number" v-model.number="scope.value" dense autofocus @keyup.enter="scope.set" />
            </q-popup-edit>
          </q-td>
          <q-td key="sodium" :props="props">
            {{ props.row.sodium }}
            <q-popup-edit v-model.number="props.row.sodium" buttons v-slot="scope">
              <q-input type="number" v-model.number="scope.value" dense autofocus @keyup.enter="scope.set" />
            </q-popup-edit>
          </q-td>
          <q-td key="calcium" :props="props">
            {{ props.row.calcium }}
            <q-popup-edit v-model="props.row.calcium" buttons v-slot="scope">
              <q-input v-model="scope.value" dense autofocus @keyup.enter="scope.set" />
            </q-popup-edit>
          </q-td>
          <q-td key="iron" :props="props">
            {{ props.row.iron }}
            <q-popup-edit v-model="props.row.iron" buttons v-slot="scope">
              <q-input v-model="scope.value" dense autofocus @keyup.enter="scope.set" />
            </q-popup-edit>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>

<script>
import { ref } from 'vue'

const columns = [
  { name: 'desc', align: 'left', label: 'Dessert (100g serving)', field: 'name' },
  { name: 'calories', align: 'center', label: 'Calories', field: 'calories' },
  { name: 'fat', label: 'Fat (g)', field: 'fat' },
  { name: 'carbs', label: 'Carbs (g)', field: 'carbs' },
  { name: 'protein', label: 'Protein (g)', field: 'protein' },
  { name: 'sodium', label: 'Sodium (mg)', field: 'sodium' },
  { name: 'calcium', label: 'Calcium (%)', field: 'calcium' },
  { name: 'iron', label: 'Iron (%)', field: 'iron' }
]

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
  setup () {
    return {
      rows: ref(rows),
      columns
    }
  }
}
</script>
