<template>
  <div class="q-pa-md">
    <div class="q-gutter-md row items-start">
      <q-select
        filled
        v-model="model"
        use-input
        use-chips
        multiple
        input-debounce="0"
        hint="No filtering"
        @new-value="createValue"
        style="width: 250px"
      />

      <q-select
        filled
        v-model="modelFilter"
        use-input
        use-chips
        multiple
        input-debounce="0"
        hint="With filtering"
        @new-value="filterCreateValue"
        :options="filterOptions"
        @filter="filterFn"
        style="width: 250px"
      />
    </div>
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
      modelFilter: null,

      filterOptions: stringOptions
    }
  },

  methods: {
    createValue (val, done) {
      if (val.length > 0) {
        done(val)
      }
    },

    filterCreateValue (val, done) {
      if (val.length > 0) {
        if (stringOptions.includes(val)) {
          done(val)
        }
        else {
          stringOptions.push(val)
          done(val)
        }
      }
    },

    filterFn (val, update) {
      update(() => {
        if (val === '') {
          this.filterOptions = stringOptions
        }
        else {
          const needle = val.toLowerCase()
          this.filterOptions = stringOptions.filter(v => v.toLowerCase().indexOf(needle) > -1)
        }
      })
    }
  }
}
</script>
