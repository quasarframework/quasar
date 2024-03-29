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
      <q-checkbox v-model="forceMenu" toggle-indeterminate :label="forceMenuLabel" />

      <q-btn label="Focus 3" @click="e => { $refs.sel3.focus(e) }" />
      <q-btn label="Show 3" @click="$refs.sel3.showPopup()" />

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
        style="max-width: 450px"
        clearable
        :behavior="behavior"
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
        style="max-width: 450px"
        clearable
        :behavior="behavior"
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
        style="max-width: 450px"
        clearable
        :behavior="behavior"
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
        style="max-width: 450px"
        clearable
        :behavior="behavior"
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
        style="max-width: 450px"
        clearable
        :behavior="behavior"
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
        label="Lots of options - before-options and after-options slots"
        :options="lotsOptions"
        @filter="filterLotsFn"
        style="max-width: 450px"
        clearable
        :behavior="behavior"
      >
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey">
              No results
            </q-item-section>
          </q-item>
        </template>

        <template v-slot:before-options>
          <q-item class="bg-black text-white q-py-lg">
            <q-item-section>
              Rendered before the list of options
            </q-item-section>
          </q-item>
        </template>

        <template v-slot:after-options>
          <q-item class="bg-black text-white q-py-lg">
            <q-item-section>
              Rendered after the list of options
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
        label="Lots of options - sticky before-options"
        :options="lotsOptions"
        @filter="filterLotsFn"
        style="max-width: 450px"
        clearable
        :behavior="behavior"
        :virtual-scroll-sticky-size-start="69"
      >
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey">
              No results
            </q-item-section>
          </q-item>
        </template>

        <template v-slot:before-options>
          <q-item class="bg-black text-white q-py-lg sticky-top">
            <q-item-section>
              Rendered before the list of options
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
        label="Lots of options - horizontal"
        :options="lotsOptions"
        @filter="filterLotsFn"
        style="max-width: 450px"
        clearable
        :behavior="behavior"
        virtual-scroll-horizontal
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
        label="Lots of options - horizontal - before-options and after-options slots"
        :options="lotsOptions"
        @filter="filterLotsFn"
        style="max-width: 450px"
        clearable
        :behavior="behavior"
        virtual-scroll-horizontal
      >
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey">
              No results
            </q-item-section>
          </q-item>
        </template>

        <template v-slot:before-options>
          <q-item class="bg-black text-white q-py-lg">
            <q-item-section>
              Rendered before the list of options
            </q-item-section>
          </q-item>
        </template>

        <template v-slot:after-options>
          <q-item class="bg-black text-white q-py-lg">
            <q-item-section>
              Rendered after the list of options
            </q-item-section>
          </q-item>
        </template>
      </q-select>
    </div>
  </div>
</template>

<style lang="sass">
.sticky-top
  position: sticky
  opacity: 1
  z-index: 1
  top: 0
</style>

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
  lotsOptions = () => Array(5000).fill(0).map((item, i) => ({
    value: i,
    label: `Item ${ i }`
  }))

export default {
  data () {
    return {
      model: 'Twitter',
      model2: null,
      model3: null,
      options: stringOptions,
      objectOptions: objectOptions(),
      lotsOptions: Object.freeze(lotsOptions()),
      forceMenu: null
    }
  },

  computed: {
    behavior () {
      return this.forceMenu === null
        ? 'default'
        : (this.forceMenu === true ? 'menu' : 'dialog')
    },

    forceMenuLabel () {
      if (this.forceMenu === true) {
        return 'Force menu'
      }

      return this.forceMenu === false ? 'Force dialog' : 'Based on platform'
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
          this.lotsOptions = Object.freeze(lotsOptions())
        })
        return
      }

      update(() => {
        const needle = val.toLowerCase()
        this.lotsOptions = Object.freeze(lotsOptions().filter(v => v.label.toLowerCase().indexOf(needle) > -1))
      })
    }
  }
}
</script>
