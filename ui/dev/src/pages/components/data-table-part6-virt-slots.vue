<template>
  <div class="q-layout-padding">
    <div class="row q-gutter-lg">
      <div class="column no-wrap q-gutter-y-md">
        <q-input
          v-model.number="index1"
          type="number"
          dense
          outlined
          :min="0"
          :max="255"
          @update:model-value="val => { table1.value !== null && table1.value.scrollTo(val) }"
        />

        <q-table
          ref="table1"
          style="height: 400px; max-height: 80vh; width: 600px; max-width: 80vw"
          flat
          :rows="rows"
          :columns="columns"
          row-key="id"
          :pagination="pagination"
          :rows-per-page-options="[]"
        >
          <template v-slot:top-row="{ cols }">
            <tr class="bg-red text-white">
              <td :colspan="cols.length" class="text-center q-pa-md">
                Top row content no-vscroll
              </td>
            </tr>
          </template>

          <template v-slot:bottom-row="{ cols }">
            <tr class="bg-red text-white">
              <td :colspan="cols.length" class="text-center q-pa-md">
                Bottom row content no-vscroll
              </td>
            </tr>
          </template>
        </q-table>
      </div>

      <div class="column no-wrap q-gutter-y-md">
        <q-input
          v-model.number="index2"
          type="number"
          dense
          outlined
          :min="0"
          :max="255"
          @update:model-value="val => { table2.value !== null && table2.value.scrollTo(val, 'center-force') }"
        />

        <q-table
          ref="table2"
          style="height: 400px; max-height: 80vh; width: 600px; max-width: 80vw"
          flat
          :rows="rows"
          :columns="columns"
          row-key="id"
          :pagination="pagination"
          :rows-per-page-options="[]"
          virtual-scroll
          @virtual-scroll="({ index }) => { index2 = index }"
        >
          <template v-slot:top-row="{ cols }">
            <tr class="bg-red text-white">
              <td :colspan="cols.length" class="text-center q-pa-md">
                Top row content vscroll
              </td>
            </tr>
          </template>

          <template v-slot:bottom-row="{ cols }">
            <tr class="bg-red text-white">
              <td :colspan="cols.length" class="text-center q-pa-md">
                Bottom row content vscroll
              </td>
            </tr>
          </template>
        </q-table>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    return {
      index1: 0,
      index2: 0,

      table1: ref(null),
      table2: ref(null),

      pagination: { sortBy: '', descending: false, rowsPerPage: 0 },
      columns: [
        {
          field: 'id',
          label: 'ID',
          align: 'center',
          sortable: true
        },
        {
          field: 'ip',
          label: 'IP',
          align: 'center',
          sortable: true
        }
      ],

      rows: Array(256).fill(null).map((_, i) => ({ id: '#' + i, ip: '10.0.0.' + i }))
    }
  }
}
</script>
