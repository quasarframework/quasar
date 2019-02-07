<template>
  <div class="q-pa-md">
    <div class="q-gutter-md row">
      <q-select
        filled
        v-model="model"
        use-input
        use-chips
        input-debounce="0"
        label="Lazy filter"
        :options="options"
        @filter="filterFn"
        @filter-abort="abortFilterFn"
        style="width: 250px"
      >
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey">
              No results
            </q-item-section>
          </q-item>
        </template>
      </q-select>
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
      options: stringOptions
    }
  },

  methods: {
    filterFn (val, update, abort) {
      // call abort() at any time if you can't retrieve data somehow

      setTimeout(() => {
        update(() => {
          if (val === '') {
            this.options = stringOptions
          }
          else {
            const needle = val.toLowerCase()
            this.options = stringOptions.filter(v => v.toLowerCase().indexOf(needle) > -1)
          }
        })
      }, 2500)
    },

    abortFilterFn () {
      console.log('delayed filter aborted')
    }
  }
}
</script>
