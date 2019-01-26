<template>
  <div class="q-pa-md">
   <q-table
      :data="data"
      :columns="columns"
      :filter="filter"
      :title="title"
      binary-state-sort
      :rows-per-page-options="[]"
      row-key="name"
    >
      <q-tr slot="body" slot-scope="props" :props="props">
        <q-td key="desc" :props="props">
          {{ props.row.name }}
          <q-popup-edit v-model="props.row.name">
            <q-input v-model="props.row.name" dense autofocus counter />
          </q-popup-edit>
        </q-td>
        <q-td key="comment" :props="props">
          <span class="text-wrap">{{ props.row.comment }}</span>
          <q-popup-edit
            buttons
            v-model="props.row.comment"
          >
            <q-input
              type="textarea"
              v-model="props.row.comment"
              autofocus
              @keyup.enter.stop
            />
          </q-popup-edit>
        </q-td>
        <q-td key="calories" :props="props">
          {{ props.row.calories }}
          <q-popup-edit v-model="props.row.calories">
            <q-input v-model="props.row.calories" dense autofocus counter />
          </q-popup-edit>
        </q-td>
        <q-td key="fat" :props="props">
          <div class="text-pre-wrap">{{ props.row.fat }}</div>
          <q-popup-edit v-model="props.row.fat">
            <q-input v-model="props.row.fat" dense autofocus counter />
          </q-popup-edit>
        </q-td>
        <q-td key="carbs" :props="props">
          {{ props.row.carbs }}
          <q-popup-edit v-model="props.row.carbs">
            <q-input v-model="props.row.carbs" dense autofocus counter />
          </q-popup-edit>
        </q-td>
        <q-td key="protein" :props="props">
          {{ props.row.protein }}
          <q-popup-edit v-model="props.row.protein">
            <q-input v-model="props.row.protein" dense autofocus counter />
          </q-popup-edit>
        </q-td>
        <q-td key="sodium" :props="props">
          {{ props.row.sodium }}
          <q-popup-edit v-model="props.row.sodium">
            <q-input v-model="props.row.sodium" dense autofocus counter />
          </q-popup-edit>
        </q-td>
      </q-tr>
    </q-table>
  </div>
</template>

<script>
const columns = [
  {
    name: 'desc',
    required: true,
    label: 'Dessert (100g serving)',
    align: 'left',
    field: row => row.name,
    format: val => `~${val}`,
    sortable: true
  },
  { name: 'comment', align: 'left', label: 'Comment', field: 'comment' },
  { name: 'calories', align: 'center', label: 'Calories', field: 'calories', sortable: true },
  { name: 'fat', label: 'Fat (g)', field: 'fat', sortable: true },
  { name: 'carbs', label: 'Carbs (g)', field: 'carbs' },
  { name: 'protein', label: 'Protein (g)', field: 'protein' },
  { name: 'sodium', label: 'Sodium (mg)', field: 'sodium' }
]

const data = [
  {
    name: 'Frozen Yogurt',
    comment: `It's cold but great and tastes different than normal ice cream, but it's great too!
Have a taste!`,
    calories: 159,
    fat: 6.0,
    carbs: 24,
    protein: 4.0,
    sodium: 87,
    calcium: '14%'
  },
  {
    name: 'Ice cream sandwich',
    comment: `It's also cold but great!
Have a taste!`,
    calories: 237,
    fat: 9.0,
    carbs: 37,
    protein: 4.3,
    sodium: 129,
    calcium: '8%'
  },
  {
    name: 'Eclair',
    comment: `It's not cold and also great!
Have a taste!`,
    calories: 262,
    fat: 16.0,
    carbs: 23,
    protein: 6.0,
    sodium: 337,
    calcium: '6%'
  },
  {
    name: 'Cupcake',
    comment: `It could be warm and it's great!
 Have a taste!`,
    calories: 305,
    fat: 3.7,
    carbs: 67,
    protein: 4.3,
    sodium: 413,
    calcium: '3%'
  },
  {
    name: 'Gingerbread',
    comment: `It's spicy and great!
Have a taste!`,
    calories: 356,
    fat: 16.0,
    carbs: 49,
    protein: 3.9,
    sodium: 327,
    calcium: '7%'
  },
  {
    name: 'Jelly bean',
    comment: `It's neither cold or warm, but great!
Have one or two or several, but not too many!`,
    calories: 375,
    fat: 0.0,
    carbs: 94,
    protein: 0.0,
    sodium: 50,
    calcium: '0%'
  },
  {
    name: 'Lollipop',
    comment: `It's sticky and normally sweet!
Have a lick!`,
    calories: 392,
    fat: 0.2,
    carbs: 98,
    protein: 0,
    sodium: 38,
    calcium: '0%'
  },
  {
    name: 'Honeycomb',
    comment: `It's special and sweet!
Have a taste!`,
    calories: 408,
    fat: 3.2,
    carbs: 87,
    protein: 6.5,
    sodium: 562,
    calcium: '0%'
  },
  {
    name: 'Donut',
    comment: `It's an American classic glazed!
Have one with coffee!`,
    calories: 452,
    fat: 25.0,
    carbs: 51,
    protein: 4.9,
    sodium: 326,
    calcium: '2%'
  },
  {
    name: 'KitKat',
    comment: `It's good with a break!
Have a section to perfection!`,
    calories: 518,
    fat: 26.0,
    carbs: 65,
    protein: 7,
    sodium: 54,
    calcium: '12%'
  }
]

export default {
  data () {
    return {
      data,
      columns,
      title: 'QDataTable with QPopupEdit',
      filter: '',
      serverPagination: {
        page: 1,
        rowsNumber: 10
      }
    }
  },
  methods: {
    withShift (e) {
      console.log(this.$refs)
      this.$refs.popupEdit.set()
    }
  }
}
</script>

<style>
.text-wrap {
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>
