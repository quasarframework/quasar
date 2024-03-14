<template>
  <div class="q-layout-padding q-gutter-md" style="max-width: 1400px;">
    <q-table
      :rows="data"
      :columns="columns"
      row-key="name"
      title="header-before and header-after slots"
      style="height: 400px"
      :rows-per-page-options="[ 15, 20, 25, 50, 0 ]"
    >
      <template v-slot:header-before="{ cols }">
        <tr class="bg-light-blue-3">
          <td :colspan="cols.length" class="text-center q-pa-md">
            before-header with colspan
          </td>
        </tr>
      </template>

      <template v-slot:header-after="{ cols }">
        <tr class="bg-light-blue-3">
          <td v-for="col in cols" v-bind:key="col.id" >
          <q-input dense label="input for each column" :stack-label="true"/>
          </td>
        </tr>
      </template>
    </q-table>

  </div>

  <div class="q-pa-md" style="max-width: 1400px;">
    <q-table
      :rows="data"
      :columns="columns"
      row-key="name"
      title="header-before and header-after slots with selection='multiple', sticky header, loading state and virtual-scroll"
      style="height: 600px"
      :rows-per-page-options="[ 15, 20, 25, 50, 0 ]"
      class="sticky-header"
      selection="multiple"
      v-model:selected="selected"
      virtual-scroll
      :loading="loading"
    >
      <template v-slot:header-before="{ cols }">
        <tr class="bg-light-blue-3">
          <td :colspan="cols.length+1" class="text-center q-pa-md">
            <q-toggle v-model="loading" label="Loading state" class="q-mb-md" />
            <p>before-header with colspan (colspan needs to be cols.length+1)</p>
          </td>
        </tr>
      </template>

      <template v-slot:header-after="{ cols }">
        <tr class="bg-light-blue-3">
          <td>extra td for layout</td>
          <td v-for="col in cols" v-bind:key="col.id" >
            <q-input dense label="input for each column" :stack-label="true"/>
          </td>
        </tr>
      </template>
    </q-table>

  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    const randomIntFromInterval = (min, max) => Math.floor(Math.random() * (max - min + 1) + min)

    const data = []
    for (let i = 0; i < 1000; i++) {
      data.push(
        {
          name: 'entry' + i,
          inp: '',
          calories: randomIntFromInterval(120, 160),
          fat: randomIntFromInterval(4, 7),
          carbs: randomIntFromInterval(20, 30),
          protein: randomIntFromInterval(4, 7),
          sodium: randomIntFromInterval(70, 90),
          calcium: randomIntFromInterval(10, 17) + '%',
          iron: randomIntFromInterval(1, 3) + '%'
        })
    }

    return {
      columns: [
        {
          name: 'desc',
          required: true,
          label: 'Dessert (100g serving)',
          align: 'left',
          field: row => row.name,
          format: val => `${ val }`,
          sortable: true
        },
        { name: 'calories', align: 'center', label: 'Calories', field: 'calories', sortable: true },
        { name: 'fat', label: 'Fat (g)', field: 'fat', sortable: true, style: 'width: 10px' },
        { name: 'carbs', label: 'Carbs (g)', field: 'carbs' },
        { name: 'protein', label: 'Protein (g)', field: 'protein' },
        { name: 'sodium', label: 'Sodium (mg)', field: 'sodium' },
        { name: 'calcium', label: 'Calcium (%)', field: 'calcium', sortable: true, sort: (a, b) => parseInt(a, 10) - parseInt(b, 10) },
        { name: 'iron', label: 'Iron (%)', field: 'iron', sortable: true, sort: (a, b) => parseInt(a, 10) - parseInt(b, 10) }
      ],
      data,
      selected: ref([]),
      loading: ref(false)
    }
  },

  methods: {
    onExpanded (rows, added) {
      console.log(added ? 'selected' : 'un-selected', rows)
    }
  }
}
</script>

<style lang="sass">
.sticky-header
  height: 310px

  .q-table__top,
  .q-table__bottom,
  thead
    background-color: #ffffff

  thead
    position: sticky
    z-index: 1
  thead
    top: 0

  &.q-table--loading thead tr:last-child th
    top: 0px
</style>
