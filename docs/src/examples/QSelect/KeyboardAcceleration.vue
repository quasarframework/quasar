<template>
  <div class="q-pa-md">
    <q-select
      ref="qsel"
      filled
      v-model="model"
      use-input
      hide-selected
      fill-input
      input-debounce="0"
      style="width: 250px"
      :options="filterOptions"
      @filter="filterFn"
      @new-value="acceptOption"
      @keydown.native.tab="acceptPartial"
    />
  </div>
</template>

<script>
const stringOptions = [
  'Google', 'Facebook', 'Twitter', 'Apple', 'Oracle'
]
export default {
  data () {
    return {
      model: null,
      partial: null,
      filterOptions: stringOptions
    }
  },
  methods: {
    filterFn (val, update, abort) {
      this.partial = val
      update(() => {
        const needle = val.toLowerCase()
        this.options = stringOptions.filter(v => v.toLowerCase().indexOf(needle) > -1)
      })
    },
    // On 'new-value' triggered by hitting Enter, if there is a single
    // option in the filtered list, set the model to this value
    acceptOption () {
      if (this.$refs.qsel.options.length === 1) {   
        this.model = this.$refs.qsel.options[0]
        this.partial = ''
      }
    },
    // Any text entered so far is copied to the model when
    // the user 'tabs' away from the control
    acceptPartial () {
      if (this.partial) {
        this.model = this.partial
      }
    }
  }
}
</script>
