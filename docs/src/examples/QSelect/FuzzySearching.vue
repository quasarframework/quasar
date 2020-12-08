<template>
  <div class="q-pa-md">
    <div class="q-gutter-md row">
      <q-select
        filled
        v-model="model"
        use-input
        hide-selected
        fill-input
        input-debounce="0"
        :options="filteringOptions"
        @filter="filterFn"
        :hint="hint"
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
// using "fuzzysort" library as filtering algorithm.
import fuzzysort from 'fuzzysort'

const stringOptions = [
  'Google', 'Facebook', 'Twitter', 'Apple', 'Oracle'
].reduce((acc, opt) => {
  for (let i = 1; i <= 5; i++) {
    acc.push(opt + ' ' + i)
  }
  return acc
}, [])

const mappedOptions = [ ...stringOptions ].map((item) => ({ label: item, value: item }))

export default {
  data () {
    return {
      hint: 'Fuzzy Searching (search for "ace")',
      model: null,
      options: stringOptions,
      filteringOptions: [],
      highlightClass: 'bg-orange-3'
    }
  },

  methods: {
    filterFn (val, update, abort) {
      const options = mappedOptions
      if (!options) return abort()
      update(
        () => {
          if (val === '') this.filteringOptions = options
          else {
            this.filteringOptions = fuzzysort.go(val, options, {
              key: 'label',
              allowTypo: true,
              limit: 50
            }).map((item) => ({
              value: item.obj.value,
              label: fuzzysort.highlight(item, `<b class="${this.highlightClass}">`, '</b>')
            }))
          }
        },
        (ref) => {
          if (val !== '' && ref.options.length > 0) {
            ref.setOptionIndex(-1) // reset optionIndex in case there is something selected
            ref.moveOptionSelection(1, true) // focus the first selectable option and do not update the input-value
          }
        }
      )
    }
  }
}
</script>
