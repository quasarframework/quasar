<template>
  <div class="q-pa-md">
   <q-table
      :rows="rows"
      :columns="columns"
      title="QDataTable with QPopupEdit"
      :rows-per-page-options="[]"
      row-key="name"
      wrap-cells
    >
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="desc" :props="props">
            {{ props.row.name }}
            <q-popup-edit v-model="props.row.name" v-slot="scope">
              <q-input v-model="scope.value" dense autofocus counter @keyup.enter="scope.set" />
            </q-popup-edit>
          </q-td>

          <q-td key="comment" :props="props">
            <div v-html="props.row.comment"></div>
            <q-popup-edit
              buttons
              v-model="props.row.comment"
              v-slot="scope"
            >
              <q-editor
                v-model="scope.value"
                min-height="5rem"
                autofocus
                @keyup.enter.stop
              />
            </q-popup-edit>
          </q-td>

          <q-td key="calories" :props="props">
            {{ props.row.calories }}
            <q-popup-edit v-model.number="props.row.calories" v-slot="scope">
              <q-input type="number" v-model.number="scope.value" dense autofocus @keyup.enter="scope.set" />
            </q-popup-edit>
          </q-td>

          <q-td key="fat" :props="props">
            <div class="text-pre-wrap">{{ props.row.fat }}</div>
            <q-popup-edit v-model.number="props.row.fat" v-slot="scope">
              <q-input type="number" v-model.number="scope.value" dense autofocus @keyup.enter="scope.set" />
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
  { name: 'desc', style: 'min-width: 160px; width: 160px', align: 'left', label: 'Dessert', field: 'name' },
  { name: 'comment', style: 'min-width: 200px; width: 200px', align: 'left', label: 'Comment (editable)', field: 'comment' },
  { name: 'calories', align: 'center', label: 'Calories', field: 'calories' },
  { name: 'fat', label: 'Fat (g)', field: 'fat' }
]

const rows = [
  {
    name: 'Frozen Yogurt',
    comment: '<p>It\'s cold but great and tastes different than normal ice cream, but it\'s great too!</p><p><strong>Have a taste!</strong></p>',
    calories: 159,
    fat: 6.0
  },
  {
    name: 'Ice cream sandwich',
    comment: '<p>It\'s also cold but great!</p><p><strong>Have a taste!</strong></p>',
    calories: 237,
    fat: 9.0
  },
  {
    name: 'Eclair',
    comment: '<p>It\'s not cold and also great!</p><p><strong>Have a taste!</strong></p>',
    calories: 262,
    fat: 16.0
  },
  {
    name: 'Cupcake',
    comment: '<p>It could be warm and it\'s great!</p><p><strong>Have a taste!</strong></p>',
    calories: 305,
    fat: 3.7
  },
  {
    name: 'Gingerbread',
    comment: '<p>It\'s spicy and great!</p><p><strong>Have a taste!</strong></p>',
    calories: 356,
    fat: 16.0
  },
  {
    name: 'Jelly bean',
    comment: '<p>It\'s neither cold or warm, but great!</p><p><strong>Have one or two or several, but not too many!</strong></p>',
    calories: 375,
    fat: 0.0
  },
  {
    name: 'Lollipop',
    comment: '<p>It\'s sticky and normally sweet!</p><p><strong>Have a lick!</strong></p>',
    calories: 392,
    fat: 0.2
  },
  {
    name: 'Honeycomb',
    comment: '<p>It\'s special and sweet!</p><p><strong>Have a taste!</strong></p>',
    calories: 408,
    fat: 3.2
  },
  {
    name: 'Donut',
    comment: '<p>It\'s an American classic glazed!</p><p><strong>Have one with coffee!</strong></p>',
    calories: 452,
    fat: 25.0
  },
  {
    name: 'KitKat',
    comment: '<p>It\'s good with a break!</p><p><strong>Have a section to perfection!</strong></p>',
    calories: 518,
    fat: 26.0
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
