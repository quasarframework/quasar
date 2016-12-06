<template>
  <div class="q-data-table-toolbar upper-toolbar row reverse-wrap items-center justify-end">
    <q-search v-model="filtering.terms" style="min-width: 250px"></q-search>
    <div class="row items-center group">
      <q-select
        v-model="filtering.field"
        type="radio"
        :options="filterFields"
        class="text-right"
      ></q-select>
      <button class="primary clear" @click="close()">
        <i>close</i>
      </button>
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
  },
  methods: {
    close () {
      this.filtering.terms = ''
      this.$emit('close')
    }
  }
}
</script>
