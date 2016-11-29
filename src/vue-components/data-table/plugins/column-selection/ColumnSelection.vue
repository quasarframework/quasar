<template>
  <div class="q-data-table-toolbar upper-toolbar row reverse-wrap items-center justify-end">
    <div class="auto"></div>
    <q-select
      type="toggle"
      v-model="selection"
      :options="options"
    />
    <div>
      <button class="primary clear" @click="$emit('close')">
        <i>close</i>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: ['columns', 'value'],
  computed: {
    selection: {
      get () {
        return this.value
      },
      set (value) {
        this.$emit('input', value)
      }
    },
    options () {
      return this.columns.map(col => {
        return {
          label: col.label,
          value: col.field
        }
      })
    }
  }
}
</script>
