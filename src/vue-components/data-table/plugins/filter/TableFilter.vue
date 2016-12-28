<template>
  <div class="q-data-table-toolbar upper-toolbar row auto reverse-wrap items-center">
    <div class="row items-center auto">
      <q-search class="auto" v-model="filtering.terms"></q-search>
      <q-select
        v-model="filtering.field"
        type="list"
        :options="filterFields"
        class="text-right"
      ></q-select>
    </div>
  </div>
</template>

<script>
export default {
  props: ['filtering', 'columns'],
  computed: {
    filterFields () {
      let cols = this.columns.map(col => {
        return {
          label: col.label,
          value: col.field
        }
      })

      return [{label: 'All Fields', value: ''}].concat(cols)
    }
  }
}
</script>
