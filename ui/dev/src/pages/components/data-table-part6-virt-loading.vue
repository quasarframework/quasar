<template>
  <div class="q-pa-md">
    <q-responsive :ratio="4/3" style="max-width: 700px">
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
              <q-toggle dense v-model="props.expand" :label="`Row: ${props.row.index}`" />
            </q-td>
            <q-td key="name" :props="props">
              {{ props.row.name }}
            </q-td>
            <q-td key="calories" :props="props">{{ props.row.calories }}</q-td>
          </q-tr>
          <q-tr v-show="props.expand" :props="props" :key="`e_${props.row.index}`" no-hover class="q-virtual-scroll--with-prev">
            <q-td colspan="100%">
              <div class="q-pl-xl">
                Row: {{ props.row.index }} - Fat: {{ props.row.fat }}
              </div>
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </q-responsive>
  </div>
</template>

<script>
const seed = [
  {
    name: 'Frozen Yogurt',
    calories: 159,
    fat: 6.0
  },
  {
    name: 'Ice cream sandwich',
    calories: 237,
    fat: 9.0
  },
  {
    name: 'Eclair',
    calories: 262,
    fat: 16.0
  },
  {
    name: 'Cupcake',
    calories: 305,
    fat: 3.7
  },
  {
    name: 'Gingerbread',
    calories: 356,
    fat: 16.0
  },
  {
    name: 'Jelly bean',
    calories: 375,
    fat: 0.0
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
    fat: 25.0
  },
  {
    name: 'KitKat',
    calories: 518,
    fat: 26.0
  }
]

const seedSize = seed.length

let data = []
for (let i = 0; i < 1000; i++) {
  data = data.concat(seed.map((r, j) => ({ ...r, index: i * seedSize + j + 1 })))
}
Object.freeze(data)

const expanded = data.map(r => r.index)

const pageSize = 50
const nextPage = 2
const lastPage = Math.ceil(data.length / pageSize)

export default {
  data () {
    return {
      pagination: {
        rowsPerPage: 0,
        rowsNumber: data.length
      },
      columns: [
        { name: 'index', label: '#', field: 'index' },
        { name: 'name', label: 'Dessert', field: 'name' },
        { name: 'calories', align: 'center', label: 'Calories', field: 'calories', sortable: true }
      ],
      nextPage,
      expanded
    }
  },

  computed: {
    data () {
      return Object.freeze(data.slice(0, pageSize * (this.nextPage - 1)))
    }
  },

  methods: {
    onScroll (evt) {
      const lastIndex = this.data.length - 1

      if (this.nextPage < lastPage && evt.to === lastIndex) {
        this.nextPage++
        this.$nextTick(() => {
          evt.ref.refresh()
        })
      }
    }
  }
}
</script>
