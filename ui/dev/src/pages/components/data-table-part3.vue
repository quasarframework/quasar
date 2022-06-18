<template>
  <div class="q-layout-padding" :class="dark ? 'bg-grey-10 text-white' : ''">
    <q-toggle v-model="loading" label="Loading" :dark="dark" />
    <q-toggle v-model="dark" label="Dark" :dark="dark" :false-value="null" />
    <q-toggle v-model="dense" label="Dense" :dark="dark" />
    <q-select class="q-ma-sm inline" filled v-model="separator" :options="['horizontal', 'vertical', 'cell', 'none']" :dark="dark" />
    <q-toggle v-model="hasSelection" label="Selection" :dark="dark" />

    <q-table
      :rows="data"
      :columns="columns"
      :grid="$q.screen.lt.md"
      row-key="name"
      title="Loading slot"
      :loading="loading"
      :separator="separator"
      dense
      class="q-my-lg"
      :color="$q.dark.isActive || dark ? 'amber' : 'primary'"
      :dark="dark"
      flat
      bordered
    >
      <template v-slot:loading>
        <q-inner-loading showing color="primary" />
      </template>
    </q-table>

    <q-table
      :rows="data"
      :columns="columns"
      title="Responsive with grid (no slot)"
      row-key="name"
      :loading="loading"
      :grid="$q.screen.lt.md"
      :separator="separator"
      :dense="dense"
      class="q-my-lg"
      :color="$q.dark.isActive || dark ? 'amber' : 'primary'"
      :selection="selection"
      v-model:selected="selected"
      :dark="dark"
      flat
      bordered
      @row-dblclick="onRowClick"
    />

    <q-table
      :rows="data"
      :columns="columns"
      title="Responsive with grid item slot"
      row-key="name"
      :loading="loading"
      :grid="$q.screen.lt.md"
      :separator="separator"
      :dense="dense"
      selection="multiple"
      :rows-per-page-options="[1, 3, 5, 50, 0]"
      v-model:selected="selected"
      :dark="dark"
      @row-click="onRowClick"
    >
      <template v-slot:top-right="props">
        <q-btn size="sm" round flat :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'" @click="props.toggleFullscreen()" />
      </template>
      <template v-slot:item="props">
        <div
          class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3"
          :style="props.selected ? 'transform: scale(0.95);' : ''"
        >
          <q-card :dark="dark">
            <q-card-section>
              <q-checkbox :dark="dark" v-model="props.selected" :label="props.row.name" />
            </q-card-section>
            <q-separator :dark="dark" />
            <q-list :dark="dark">
              <q-item v-for="col in props.cols.filter(col => col.name !== 'desc')" :key="col.name">
                <q-item-section>
                  <q-item-label>{{ col.label }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-item-label caption>
                    {{ col.value }}
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card>
        </div>
      </template>
    </q-table>
  </div>
</template>

<script>
export default {
  data () {
    return {
      loading: false,
      dark: null,
      hasSelection: false,
      selected: [],
      separator: 'horizontal',
      dense: false,

      columns: [
        {
          name: 'desc',
          required: true,
          label: 'Dessert (100g serving)',
          align: 'left',
          field: 'name',
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
    selection () {
      return this.hasSelection === true
        ? 'multiple'
        : void 0
    }
  },

  methods: {
    onRowClick (evt, row) {
      // alert('click')
      console.log('clicked on', evt, row)
    }
  }
}
</script>
