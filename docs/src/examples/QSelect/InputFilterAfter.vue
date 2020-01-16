<template>
  <div class="q-pa-md">
    <div class="q-gutter-md">
      <q-select
        filled
        v-model="model"
        use-input
        input-debounce="0"
        label="Focus first option after filtering"
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
        use-input
        input-debounce="0"
        label="Autoselect first option after filtering"
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
        update(
          () => {
            if (val === '') {
              this.options = stringOptions
            }
            else {
              const needle = val.toLowerCase()
              this.options = stringOptions.filter(v => v.toLowerCase().indexOf(needle) > -1)
            }
          },

          ref => {
            // with Quasar v1.7.4+
            // here you have access to "ref" which
            // is the Vue reference of the QSelect

            // DO NOT use moveOptionSelection with fill-input
            ref.moveOptionSelection()
          }
        )
      }, 1500)
    },

    filterFnAutoselect (val, update, abort) {
      // call abort() at any time if you can't retrieve data somehow

      setTimeout(() => {
        update(
          () => {
            if (val === '') {
              this.options = stringOptions
            }
            else {
              const needle = val.toLowerCase()
              this.options = stringOptions.filter(v => v.toLowerCase().indexOf(needle) > -1)
            }
          },

          ref => {
            // with Quasar v1.7.4+
            // here you have access to "ref" which
            // is the Vue reference of the QSelect

            // DO NOT use moveOptionSelection or toggleOption with fill-input
            ref.moveOptionSelection()
            ref.toggleOption(ref.options[ref.optionIndex], true)
          }
        )
      }, 1500)
    },

    abortFilterFn () {
      // console.log('delayed filter aborted')
    }
  }
}
</script>
