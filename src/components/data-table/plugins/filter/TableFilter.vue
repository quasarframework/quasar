<template>
  <div class="q-data-table-toolbar upper-toolbar row auto items-center">
    <q-search
      class="auto"
      v-model="filtering.terms"
      :placeholder="labels.search"
    ></q-search>
    <q-select
      v-model="filtering.field"
      :options="filterFields"
      class="no-margin text-right"
      simple
    ></q-select>
  </div>
</template>

<script>
import { QSearch } from '../../../search'
import { QSelect } from '../../../select'

export default {
  name: 'q-table-filter',
  components: {
    QSearch,
    QSelect
  },
  props: ['filtering', 'columns', 'labels'],
  computed: {
    filterFields () {
      let cols = this.columns.map(col => {
        return {
          label: col.label,
          value: col.field
        }
      })

      return [{label: this.labels.allCols, value: ''}].concat(cols)
    }
  }
}
</script>
