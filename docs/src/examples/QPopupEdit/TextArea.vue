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
          </q-td>

          <q-td key="comment" :props="props">
            <div>{{ props.row.comment }}</div>
            <q-popup-edit
              buttons
              v-model="props.row.comment"
              v-slot="scope"
            >
              <q-input
                type="textarea"
                v-model="scope.value"
                autofocus
                counter
                @keyup.enter.stop
              />
            </q-popup-edit>
          </q-td>

          <q-td key="calories" :props="props">
            {{ props.row.calories }}
          </q-td>

          <q-td key="fat" :props="props">
            <div>{{ props.row.fat }}</div>
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
    comment: `It's cold but great and tastes different than normal ice cream, but it's great too!
Have a taste!`,
    calories: 159,
    fat: 6.0
  },
  {
    name: 'Ice cream sandwich',
    comment: `It's also cold but great!
Have a taste!`,
    calories: 237,
    fat: 9.0
  },
  {
    name: 'Eclair',
    comment: `It's not cold and also great!
Have a taste!`,
    calories: 262,
    fat: 16.0
  },
  {
    name: 'Cupcake',
    comment: `It could be warm and it's great!
 Have a taste!`,
    calories: 305,
    fat: 3.7
  },
  {
    name: 'Gingerbread',
    comment: `It's spicy and great!
Have a taste!`,
    calories: 356,
    fat: 16.0
  },
  {
    name: 'Jelly bean',
    comment: `It's neither cold or warm, but great!
Have one or two or several, but not too many!`,
    calories: 375,
    fat: 0.0
  },
  {
    name: 'Lollipop',
    comment: `It's sticky and normally sweet!
Have a lick!`,
    calories: 392,
    fat: 0.2
  },
  {
    name: 'Honeycomb',
    comment: `It's special and sweet!
Have a taste!`,
    calories: 408,
    fat: 3.2
  },
  {
    name: 'Donut',
    comment: `It's an American classic glazed!
Have one with coffee!`,
    calories: 452,
    fat: 25.0
  },
  {
    name: 'KitKat',
    comment: `It's good with a break!
Have a section to perfection!`,
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
