<template>
  <div class="q-pa-md">
    <div class="q-gutter-md row">
      <q-select
        filled
        :model-value="model"
        use-input
        hide-selected
        fill-input
        input-debounce="0"
        :options="options"
        @filter="filterFn"
        @input-value="setModel"
        hint="Text autocomplete"
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
    const model = ref(null)
    const options = ref(stringOptions)

    return {
      model,
      options,

      filterFn (val, update, abort) {
        update(() => {
          const needle = val.toLocaleLowerCase()
          options.value = stringOptions.filter(v => v.toLocaleLowerCase().indexOf(needle) > -1)
        })
      },

      setModel (val) {
        model.value = val
      }
    }
  }
}
</script>
