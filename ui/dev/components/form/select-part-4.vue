<template>
  <div class="q-layout-padding">
    <div class="q-pa-md">
      <div>Last KeyUp event key: {{ outputup }}</div>
      <div>Last KeyDown event key: {{ outputdown }}</div>
      <div>Model: {{ model }}</div>
      <div class="q-gutter-md row">
        <q-select
          @keyup="mykeyup"
          @keydown="mykeydown"
          filled
          v-model="model"
          use-input
          input-debounce="0"
          label="Simple filter"
          :options="options"
          @filter="filterFn"
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
      options: stringOptions,
      outputup: 'n/a',
      outputdown: 'n/a'
    }
  },
  methods: {
    mykeyup (e) {
      console.log('keyup', e)
      this.outputup = e.key
    },
    mykeydown (e) {
      console.log('keydown', e)
      this.outputdown = e.key
    },
    filterFn (val, update) {
      if (val === '') {
        update(() => {
          this.options = stringOptions
        })
        return
      }

      update(() => {
        const needle = val.toLowerCase()
        this.options = stringOptions.filter(v => v.toLowerCase().indexOf(needle) > -1)
      })
    }
  }
}
</script>
