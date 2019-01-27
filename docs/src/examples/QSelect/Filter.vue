<template>
  <div class="q-pa-md q-gutter-sm">
    <q-select
        :options="options"
        @filter="filter"
        label="Simple filter - lazy load options"
        use-input
        v-model="selected">
    </q-select>
  </div>
</template>

<script>
const options = ['Google', 'Facebook', 'Twitter']
export default {
  name: 'Filtered',
  data () {
    return {
      selected: null,
      options: options,
      filteredOptions: options
    }
  },
  methods: {
    filter (val, update) {
      if (val === '') {
        update(() => {
          this.filteredOptions = this.options
        })
        return
      }

      update(() => {
        const needle = val.toLowerCase()
        this.filteredOptions = this.options.filter(v => v.toLowerCase().indexOf(needle) > -1)
      })
    }
  }
}
</script>
