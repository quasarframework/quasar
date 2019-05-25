<template>
  <div class="q-layout-padding">
    <div class="q-gutter-md">
      <div>
        Model: {{ model }}
      </div>

      <q-btn label="Focus 1" @click="e => { $refs.sel1.focus(e) }" />
      <q-btn label="Show 1" @click="$refs.sel1.showPopup()" />

      <q-btn label="Focus 2" @click="e => { $refs.sel2.focus(e) }" />
      <q-btn label="Show 2" @click="$refs.sel2.showPopup()" />

      <q-select
        filled
        ref="sel1"
        v-model="model"
        use-input
        hide-selected
        fill-input
        input-debounce="0"
        label="Hide selected"
        :options="options"
        @filter="filterFn"
        style="width: 250px"
        clearable
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
        ref="sel2"
        v-model="model"
        use-input
        hide-selected
        fill-input
        input-debounce="0"
        label="Hide selected, no filter"
        :options="options"
        style="width: 250px"
        clearable
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
        ref="sel3"
        v-model="model"
        label="Simple"
        :options="options"
        style="width: 250px"
        clearable
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
      model: 'Twitter',
      options: stringOptions
    }
  },

  methods: {
    filterFn (val, update) {
      console.log('filterFn', val)
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
