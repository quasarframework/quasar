<template>
  <div class="q-pa-md">
    <div class="q-gutter-md">
      <q-select
        filled
        v-model="model"
        clearable
        use-input
        hide-selected
        fill-input
        input-debounce="0"
        label="Focus after filtering"
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

      <q-select
        filled
        v-model="model"
        clearable
        use-input
        hide-selected
        fill-input
        input-debounce="0"
        label="Autoselect after filtering"
        :options="options"
        @filter="filterFnAutoselect"
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
import { ref } from 'vue'

const stringOptions = [
  'Google', 'Facebook', 'Twitter', 'Apple', 'Oracle'
].reduce((acc, opt) => {
  for (let i = 1; i <= 5; i++) {
    acc.push(opt + ' ' + i)
  }
  return acc
}, [])

export default {
  setup () {
    const options = ref(stringOptions)

    return {
      model: ref(null),
      options,

      filterFn (val, update, abort) {
        // call abort() at any time if you can't retrieve data somehow

        setTimeout(() => {
          update(
            () => {
              if (val === '') {
                options.value = stringOptions
              }
              else {
                const needle = val.toLowerCase()
                options.value = stringOptions.filter(v => v.toLowerCase().indexOf(needle) > -1)
              }
            },

            // "ref" is the Vue reference to the QSelect
            ref => {
              if (val !== '' && ref.options.length > 0) {
                ref.setOptionIndex(-1) // reset optionIndex in case there is something selected
                ref.moveOptionSelection(1, true) // focus the first selectable option and do not update the input-value
              }
            }
          )
        }, 300)
      },

      filterFnAutoselect (val, update, abort) {
        // call abort() at any time if you can't retrieve data somehow

        setTimeout(() => {
          update(
            () => {
              if (val === '') {
                options.value = stringOptions
              }
              else {
                const needle = val.toLowerCase()
                options.value = stringOptions.filter(v => v.toLowerCase().indexOf(needle) > -1)
              }
            },

            // "ref" is the Vue reference to the QSelect
            ref => {
              if (val !== '' && ref.options.length > 0 && ref.optionIndex === -1) {
                ref.moveOptionSelection(1, true) // focus the first selectable option and do not update the input-value
                ref.toggleOption(ref.options[ ref.optionIndex ], true) // toggle the focused option
              }
            }
          )
        }, 300)
      },

      abortFilterFn () {
        // console.log('delayed filter aborted')
      }
    }
  }
}
</script>
