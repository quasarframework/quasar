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

      <q-select
        filled
        v-model="model2"
        use-input
        hide-selected
        fill-input
        emit-value
        map-options
        label="Lazy filter with new options"
        :options="objectOptions"
        @filter="filterObjectFn"
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
        v-model="model3"
        use-input
        hide-selected
        fill-input
        emit-value
        map-options
        label="Lots of options"
        :options="lotsOptions"
        @filter="filterLotsFn"
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
const
  stringOptions = [
    'Google', 'Facebook', 'Twitter', 'Apple', 'Oracle'
  ],
  objectOptions = () => ([
    {
      label: 'Google',
      value: 1
    },
    {
      label: 'Facebook',
      value: 2
    },
    {
      label: 'Twitter',
      value: 3
    },
    {
      label: 'Apple',
      value: 4
    },
    {
      label: 'Oracle',
      value: 5
    }
  ]),
  lotsOptions = () => Array(50).fill(0).map((item, i) => ({
    value: i,
    label: `Item ${i}`
  }))

export default {
  data () {
    return {
      model: 'Twitter',
      model2: null,
      model3: null,
      options: stringOptions,
      objectOptions: objectOptions(),
      lotsOptions: lotsOptions()
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
    },

    filterObjectFn (val, update) {
      console.log('filterObjectFn', val)
      if (val === '') {
        update(() => {
          this.objectOptions = objectOptions()
        })
        return
      }

      setTimeout(() => {
        update(() => {
          const needle = val.toLowerCase()
          this.objectOptions = objectOptions().filter(v => v.label.toLowerCase().indexOf(needle) > -1)
        })
      }, 100)
    },

    filterLotsFn (val, update) {
      console.log('filterLotsFn', val)
      if (val === '') {
        update(() => {
          this.lotsOptions = lotsOptions()
        })
        return
      }

      update(() => {
        const needle = val.toLowerCase()
        this.lotsOptions = lotsOptions().filter(v => v.label.toLowerCase().indexOf(needle) > -1)
      })
    }
  }
}
</script>
