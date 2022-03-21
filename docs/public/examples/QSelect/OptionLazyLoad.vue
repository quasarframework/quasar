<template>
  <div class="q-pa-md">
    <div class="q-gutter-md row items-start">
      <q-select
        filled
        v-model="model"
        use-chips
        label="Lazy load opts"
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

      <q-btn
        v-if="options"
        label="Reset"
        color="primary"
        @click="options = null"
      />
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
    const options = ref(null)

    return {
      model: ref(null),
      options,

      filterFn (val, update, abort) {
        if (options.value !== null) {
          // already loaded
          update()
          return
        }

        setTimeout(() => {
          update(() => {
            options.value = stringOptions
          })
        }, 2000)
      },

      abortFilterFn () {
        // console.log('delayed filter aborted')
      }
    }
  }
}
</script>
