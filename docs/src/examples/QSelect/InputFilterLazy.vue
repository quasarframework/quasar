<template>
  <div class="q-pa-md">
    <div class="q-gutter-md">
      <q-select
        filled
        v-model="model"
        use-input
        hide-selected
        fill-input
        input-debounce="0"
        label="Lazy filter"
        :options="options"
        @filter="filterFn"
        @filter-abort="abortFilterFn"
        style="width: 250px"
        hint="With hide-selected and fill-input"
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
        use-input
        use-chips
        input-debounce="0"
        label="Lazy filter"
        :options="options"
        @filter="filterFn"
        @filter-abort="abortFilterFn"
        style="width: 250px"
        hint="With use-chips"
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
]

export default {
  setup () {
    const options = ref(stringOptions)

    return {
      model: ref(null),
      options,

      filterFn (val, update, abort) {
        // call abort() at any time if you can't retrieve data somehow

        setTimeout(() => {
          update(() => {
            if (val === '') {
              options.value = stringOptions
            }
            else {
              const needle = val.toLowerCase()
              options.value = stringOptions.filter(v => v.toLowerCase().indexOf(needle) > -1)
            }
          })
        }, 1500)
      },

      abortFilterFn () {
        // console.log('delayed filter aborted')
      }
    }
  }
}
</script>
