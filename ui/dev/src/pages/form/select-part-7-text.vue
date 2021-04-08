<template>
  <div class="q-layout-padding" style="min-height: 80vh">
    <div class="q-gutter-y-sm" style="max-width: 300px">
      <q-toggle
        v-model="behavior"
        toggle-indeterminate
        false-value="menu"
        true-value="dialog"
        :indeterminate-value="void 0"
        :label="behavior || 'auto'"
      />

      <div class="q-pa-md bg-grey-2 rounded-borders">
        Model: [{{ model }}]
      </div>

      <q-select
        :model-value="model"
        label="Text autocomplete"
        :options="filteredOptions"
        :behavior="behavior"
        use-input
        fill-input
        hide-selected
        @filter="filterOptions"
        @update:model-value-value="val => { model = val }"
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
const prefixes = [ 'Item', 'Option', 'Address', 'Selection' ]
const options = Array(200).fill(0).map((item, i) => `${ prefixes[ Math.floor(Math.random() * prefixes.length) ] } ${ i }`).sort(() => Math.random() * 2 - 1)

export default {
  data: function () {
    return {
      model: '',
      filteredOptions: options.slice(),
      behavior: void 0
    }
  },

  methods: {
    filterOptions (val, update) {
      update(() => {
        if (val === '') {
          this.filteredOptions = options.slice()
        }
        else {
          const needle = val.toLocaleLowerCase()
          this.filteredOptions = options.filter(v => v.toLocaleLowerCase().indexOf(needle) > -1)
        }
      })
    }
  }
}
</script>
