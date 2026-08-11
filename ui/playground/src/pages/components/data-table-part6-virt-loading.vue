<template>
  <div class="q-pa-md">
    <q-responsive :ratio="4 / 3" style="max-width: 700px">
      <q-table
        title="Treats; ratio 4/3"
        :rows="data"
        :columns="columns"
        row-key="index"
        no-hover
        virtual-scroll
        :virtual-scroll-item-size="48"
        @virtual-scroll="onScroll"
        ref="table"
        :pagination="pagination"
        :rows-per-page-options="[0]"
        v-model:expanded="expanded"
      >
        <template v-slot:body="props">
          <q-tr :props="props" :key="`m_${props.row.index}`" no-hover>
            <q-td auto-width>
              <q-toggle
                dense
                v-model="props.expand"
                :label="`Row: ${props.row.index}`"
              />
            </q-td>
            <q-td key="name" :props="props">
              {{ props.row.name }}
            </q-td>
            <q-td key="calories" :props="props">{{ props.row.calories }}</q-td>
          </q-tr>
          <q-tr
            v-show="props.expand"
            :props="props"
            :key="`e_${props.row.index}`"
            no-hover
            class="q-virtual-scroll--with-prev"
          >
            <q-td colspan="100%">
              <div class="q-pl-xl"
                >Row: {{ props.row.index }} - Fat: {{ props.row.fat }}</div
              >
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </q-responsive>
  </div>
</template>

<script setup>
import { computed, nextTick, ref } from 'vue'

const seed = [
  {
    name: 'Frozen Yogurt',
    calories: 159,
    fat: 6
  },
  {
    name: 'Ice cream sandwich',
    calories: 237,
    fat: 9
  },
  {
    name: 'Eclair',
    calories: 262,
    fat: 16
  },
  {
    name: 'Cupcake',
    calories: 305,
    fat: 3.7
  },
  {
    name: 'Gingerbread',
    calories: 356,
    fat: 16
  },
  {
    name: 'Jelly bean',
    calories: 375,
    fat: 0
  },
  {
    name: 'Lollipop',
    calories: 392,
    fat: 0.2
  },
  {
    name: 'Honeycomb',
    calories: 408,
    fat: 3.2
  },
  {
    name: 'Donut',
    calories: 452,
    fat: 25
  },
  {
    name: 'KitKat',
    calories: 518,
    fat: 26
  }
]

const seedSize = seed.length

const allData = []
for (let i = 0; i < 1000; i++) {
  allData.push(...seed.map((r, j) => ({ ...r, index: i * seedSize + j + 1 })))
}
Object.freeze(allData)

const initialExpanded = allData.map(r => r.index)

const pageSize = 50
const initialNextPage = 2
const lastPage = Math.ceil(allData.length / pageSize)

const pagination = ref({
  rowsPerPage: 0,
  rowsNumber: allData.length
})
const columns = ref([
  { name: 'index', label: '#', field: 'index' },
  { name: 'name', label: 'Dessert', field: 'name' },
  {
    name: 'calories',
    align: 'center',
    label: 'Calories',
    field: 'calories',
    sortable: true
  }
])
const nextPage = ref(initialNextPage)
const expanded = ref(initialExpanded)

const data = computed(() =>
  Object.freeze(allData.slice(0, pageSize * (nextPage.value - 1)))
)

function onScroll(evt) {
  const lastIndex = data.value.length - 1

  if (nextPage.value < lastPage && evt.to === lastIndex) {
    nextPage.value++
    nextTick(() => {
      evt.ref.refresh()
    })
  }
}
</script>
