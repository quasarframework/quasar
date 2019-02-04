<template>
  <div class="q-pa-md" style="max-width: 300px">
    <div class="q-gutter-md">
      <q-badge color="secondary">Model: "{{ modelSingle }}" / {{ modelMultiple || '[]' }}</q-badge>

      <q-select
        filled
        v-model="modelSingle"
        :options="options"
        use-chips
        stack-label
        label="Single selection"
      />

      <q-select
        filled
        v-model="modelMultiple"
        multiple
        :options="options"
        use-chips
        stack-label
        label="Multiple selection"
      />
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      modelSingle: null,
      modelMultiple: null,

      options: [
        'Google', 'Facebook', 'Twitter', 'Apple', 'Oracle'
      ]
    }
  }
}
</script>
