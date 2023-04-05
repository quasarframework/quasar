<template>
  <div class="q-pa-md">
    <q-table
      grid
      :card-container-class="cardContainerClass"
      title="Treats"
      :rows="rows"
      :columns="columns"
      row-key="name"
      :filter="filter"
      hide-header
      v-model:pagination="pagination"
      :rows-per-page-options="rowsPerPageOptions"
    >
      <template v-slot:top-right>
        <q-input borderless dense debounce="300" v-model="filter" placeholder="Search">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>

      <template v-slot:item="props">
        <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4">
          <q-card>
            <q-card-section class="text-center">
              Calories for
              <br>
              <strong>{{ props.row.name }}</strong>
            </q-card-section>
            <q-separator />
            <q-card-section class="flex flex-center" :style="{ fontSize: props.row.calories + 'px' }">
              <div>{{ props.row.calories }} g</div>
            </q-card-section>
          </q-card>
        </div>
      </template>
    </q-table>
  </div>
</template>

<script>
import { useQuasar } from 'quasar'
import { ref, computed, watch } from 'vue'

const deserts = [
  'Frozen Yogurt',
  'Ice cream sandwich',
  'Eclair',
  'Cupcake',
  'Gingerbread',
  'Jelly bean',
  'Lollipop',
  'Honeycomb',
  'Donut',
  'KitKat'
]

const rows = []

deserts.forEach(name => {
  for (let i = 0; i < 24; i++) {
    rows.push({ name: name + ' (' + i + ')', calories: 20 + Math.ceil(50 * Math.random()) })
  }
})

rows.sort(() => (-1 + Math.floor(3 * Math.random())))

export default {
  setup () {
    const $q = useQuasar()

    function getItemsPerPage () {
      if ($q.screen.lt.sm) {
        return 3
      }
      if ($q.screen.lt.md) {
        return 6
      }
      return 9
    }

    const filter = ref('')
    const pagination = ref({
      page: 1,
      rowsPerPage: getItemsPerPage()
    })

    watch(() => $q.screen.name, () => {
      pagination.value.rowsPerPage = getItemsPerPage()
    })

    return {
      rows,

      filter,
      pagination,

      columns: [
        { name: 'name', label: 'Name', field: 'name' },
        { name: 'calories', label: 'Calories (g)', field: 'calories' }
      ],

      cardContainerClass: computed(() => {
        return $q.screen.gt.xs
          ? 'example-masonry-table-grid example-masonry-table-grid--' + ($q.screen.gt.sm ? '3' : '2')
          : null
      }),

      rowsPerPageOptions: computed(() => {
        return $q.screen.gt.xs
          ? $q.screen.gt.sm ? [ 3, 6, 9 ] : [ 3, 6 ]
          : [3]
      })
    }
  }
}
</script>

<style lang="sass">
.example-masonry-table-grid
  flex-direction: column
  height: 700px

  &--2
    > div
      &:nth-child(2n + 1)
        order: 1
      &:nth-child(2n)
        order: 2

    &:before
      content: ''
      flex: 1 0 100% !important
      width: 0 !important
      order: 1
  &--3
    > div
      &:nth-child(3n + 1)
        order: 1
      &:nth-child(3n + 2)
        order: 2
      &:nth-child(3n)
        order: 3

    &:before,
    &:after
      content: ''
      flex: 1 0 100% !important
      width: 0 !important
      order: 2
</style>
