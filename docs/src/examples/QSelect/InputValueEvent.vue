<template>
  <div class="q-pa-md">
    <div :style="inputVal? '' : 'padding-bottom:21px;' ">
      {{inputVal}}
    </div>
    <div class="q-gutter-md row">
      <q-select
        filled
        v-model="model"
        use-input
        hide-selected
        fill-input
        input-debounce="0"
        @input-value="updateInputValue"
        :options="options"
        @filter="filterFn"
        hint="Basic autocomplete"
        style="width: 250px; padding-bottom: 32px"
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
      options: stringOptions,
      inputVal: ''
    }
  },

  methods: {
    filterFn (val, update, abort) {
      update(() => {
        const needle = val.toLowerCase()
        this.options = stringOptions.filter(v => v.toLowerCase().indexOf(needle) > -1)
      })
    },
    updateInputValue (val) {
      this.inputVal = val
    }
  }
}
</script>
