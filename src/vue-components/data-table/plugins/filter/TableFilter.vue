<template>
  <div class="q-data-table-toolbar upper-toolbar row auto items-center">
    <q-search class="auto" v-model="filtering.terms"></q-search>
    <q-select
      v-model="filtering.field"
      type="list"
      :options="filterFields"
      class="text-right"
    ></q-select>
  </div>
</template>

<script>
export default {
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
