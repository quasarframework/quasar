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
      :data="xxl"
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

<script>
import { clone, uid } from 'quasar'

export default {
  data () {
    return {
      selectionToggle: false,
      loading: false,
      color: 'amber',
      visibleColumns: [ 'desc', 'fat', 'carbs', 'protein', 'sodium', 'calcium', 'iron' ],
      separator: 'horizontal',
      selected: [],
      selection: 'multiple',

      pagination: {
        page: 1,
        rowsPerPage: 50
      },
      serverData: [],

      title: 'QDataTable',
      filter: '',
      columns: [
        {
          name: 'desc',
          required: true,
          label: 'Dessert (100g serving)',
          align: 'left',
          field: row => row.name,
          format: val => `~${ val }`,
          sortable: true
        },
        { name: 'calories', align: 'center', label: 'Calories', field: 'calories', sortable: true },
        { name: 'fat', label: 'Fat (g)', field: 'fat', sortable: true },
        { name: 'carbs', label: 'Carbs (g)', field: 'carbs' },
        { name: 'protein', label: 'Protein (g)', field: 'protein' },
        { name: 'sodium', label: 'Sodium (mg)', field: 'sodium' },
        { name: 'calcium', label: 'Calcium (%)', field: 'calcium', sortable: true, sort: (a, b) => parseInt(a, 10) - parseInt(b, 10) },
        { name: 'iron', label: 'Iron (%)', field: 'iron', sortable: true, sort: (a, b) => parseInt(a, 10) - parseInt(b, 10) }
      ],
      data: [
        {
          name: '1Frozen Yogurt',
          calories: 159,
          fat: 6.0,
          carbs: 24,
          protein: 4.0,
          sodium: 87,
          calcium: '14%',
          iron: '1%'
        },
        {
          name: '2Ice cream sandwich',
          calories: 237,
          fat: 9.0,
          carbs: 37,
          protein: 4.3,
          sodium: 129,
          calcium: '8%',
          iron: '1%'
        },
        {
          name: '3Eclair',
          calories: 262,
          fat: 16.0,
          carbs: 23,
          protein: 6.0,
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
          fat: 16.0,
          carbs: 49,
          protein: 3.9,
          sodium: 327,
          calcium: '7%',
          iron: '16%'
        },
        {
          name: '6Jelly bean',
          calories: 375,
          fat: 0.0,
          carbs: 94,
          protein: 0.0,
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
          fat: 25.0,
          carbs: 51,
          protein: 4.9,
          sodium: 326,
          calcium: '2%',
          iron: '22%'
        },
        {
          name: '10KitKat',
          calories: 518,
          fat: 26.0,
          carbs: 65,
          protein: 7,
          sodium: 54,
          calcium: '12%',
          iron: '6%'
        }
      ]
    }
  },
  computed: {
    xxl () {
      const rand = () => Math.floor((Math.random() % 450) * 450)
      const data = clone(this.data)
      for (let i = 0; i < 500; i++) {
        data.push({
          name: uid(),
          calories: rand(),
          fat: rand(),
          carbs: rand(),
          protein: rand(),
          sodium: rand(),
          calcium: rand(),
          iron: rand()
        })
      }
      return data
    }
  },
  methods: {
  }
}
</script>
