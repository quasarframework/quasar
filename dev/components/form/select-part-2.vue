<template>
  <div>
    <div class="q-layout-padding q-gutter-y-md">
      <div class="q-gutter-sm">
        <q-radio v-model="type" val="filled" label="Filled" />
        <q-radio v-model="type" val="outlined" label="Outlined" />
        <q-radio v-model="type" val="standout" label="Standout" />
        <q-radio v-model="type" val="standard" label="Standard" />
        <q-radio v-model="type" val="borderless" label="Borderless" />
      </div>
      <div>
        <q-toggle v-model="readonly" label="Readonly" />
        <q-toggle v-model="disable" label="Disable" />
        <q-toggle v-model="dense" label="Dense" />
        <q-toggle v-model="expandBesides" label="Expand besides" />
      </div>
      <div class="q-mb-lg q-gutter-sm">
        <q-btn label="Set Google" @click="setGoogle" color="primary" outline />
        <q-btn label="Set Null" @click="setNull" color="primary" outline />
      </div>

      <q-select
        v-bind="props"
        v-model="simpleFilter"
        label="Simple filter - lazy load options"
        :options="simpleFilterOptions"
        @filter="simpleFilterFn"
      >
        <q-item slot="no-option">
          <q-item-section class="text-grey">
            No results
          </q-item-section>
        </q-item>
      </q-select>

      <q-select
        v-bind="props"
        v-model="simpleFilterInput"
        use-input
        input-debounce="0"
        label="Simple filter - useInput"
        :options="simpleFilterInputOptions"
        @filter="simpleFilterInputFn"
      >
        <q-item slot="no-option">
          <q-item-section class="text-grey">
            No results
          </q-item-section>
        </q-item>
      </q-select>

      <q-select
        v-bind="props"
        v-model="createInput"
        use-input
        use-chips
        multiple
        input-debounce="0"
        label="Create new values"
        @new-value="createInputNewValue"
        :options="createInputOptions"
        @filter="createInputFn"
      />

      <q-select
        v-bind="props"
        v-model="simpleFilterInput"
        use-input
        input-debounce="0"
        hide-selected
        label="Simple filter - hide selected + useInput"
        :options="simpleFilterInputOptions"
        @filter="simpleFilterInputFn"
      >
        <q-item slot="no-option">
          <q-item-section class="text-grey">
            No results
          </q-item-section>
        </q-item>
      </q-select>

      <q-select
        v-bind="props"
        v-model="minFilterInput"
        use-input
        input-debounce="0"
        label="Simple filter - min 2 chars"
        :options="minFilterInputOptions"
        @filter="minFilterInputFn"
      >
        <q-item slot="no-option">
          <q-item-section class="text-grey">
            No results
          </q-item-section>
        </q-item>
      </q-select>

      <q-select
        v-bind="props"
        v-model="chipFilterInput"
        use-input
        use-chips
        input-debounce="0"
        label="Simple filter - selected slot"
        :options="chipFilterInputOptions"
        @filter="chipFilterInputFn"
      >
        <q-item slot="no-option">
          <q-item-section class="text-grey">
            No results
          </q-item-section>
        </q-item>
      </q-select>

      <q-select
        v-bind="props"
        v-model="delayedFilterInput"
        use-input
        use-chips
        color="teal"
        label="Delayed filter"
        :options="delayedFilterInputOptions"
        @filter="delayedFilterInputFn"
        @filter-abort="delayedAbort"
      >
        <q-item slot="no-option">
          <q-item-section class="text-grey">
            No results
          </q-item-section>
        </q-item>
      </q-select>

      <div style="height: 400px">Scroll on purpose</div>
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
      type: 'filled',
      readonly: false,
      disable: false,
      dense: false,
      expandBesides: false,

      simpleFilter: null,
      simpleFilterOptions: null,

      createInput: null,
      createInputOptions: null,

      simpleFilterInput: null,
      simpleFilterInputOptions: null,

      minFilterInput: null,
      minFilterInputOptions: null,

      chipFilterInput: null,
      chipFilterInputOptions: null,

      delayedFilterInput: null,
      delayedFilterInputOptions: null,

      stringSingle: 'Facebook',
      stringMultiple: ['Facebook', 'Twitter'],
      stringOptions,

      objectSingle: {
        label: 'Facebook',
        value: 'Facebook',
        description: 'Social media',
        icon: 'bluetooth'
      },
      objectMultiple: [
        {
          label: 'Google',
          value: 'Google',
          description: 'Search engine',
          icon: 'mail'
        },
        {
          label: 'Facebook',
          value: 'Facebook',
          description: 'Social media',
          icon: 'bluetooth'
        }
      ],
      objectOptions: [
        {
          label: 'Google',
          value: 'Google',
          description: 'Search engine',
          icon: 'mail'
        },
        {
          label: 'Facebook',
          value: 'Facebook',
          description: 'Social media',
          icon: 'bluetooth'
        },
        {
          label: 'Twitter',
          value: 'Twitter',
          description: 'Quick updates',
          icon: 'map'
        },
        {
          label: 'Apple',
          value: 'Apple',
          description: 'iStuff',
          icon: 'golf_course'
        },
        {
          label: 'Oracle',
          value: 'Oracle',
          disable: true,
          description: 'Databases',
          icon: 'casino'
        }
      ]
    }
  },

  methods: {
    setGoogle () {
      this.simpleFilter = this.simpleFilterInput = this.minFilterInput = this.chipFilterInput = this.delayedFilterInput = 'Google'
    },

    setNull () {
      this.simpleFilter = this.simpleFilterInput = this.minFilterInput = this.chipFilterInput = this.delayedFilterInput = null
    },

    createInputNewValue (val, done) {
      console.log('createInputValue', val)
      if (val.length > 0) {
        done(val)
      }
    },

    createInputFn (val, update) {
      update(() => {
        if (val === '') {
          this.createInputOptions = stringOptions
        }
        else {
          const needle = val.toLowerCase()
          this.createInputOptions = stringOptions.filter(v => v.toLowerCase().indexOf(needle) > -1)
        }
      })
    },

    simpleFilterFn (val, update) {
      if (this.simpleFilterOptions !== null) {
        update()
        return
      }

      update(() => {
        this.simpleFilterOptions = stringOptions
      })
    },

    simpleFilterInputFn (val, update) {
      if (val === '') {
        update(() => {
          this.simpleFilterInputOptions = stringOptions
        })
        return
      }

      update(() => {
        const needle = val.toLowerCase()
        this.simpleFilterInputOptions = stringOptions.filter(v => v.toLowerCase().indexOf(needle) > -1)
      })
    },

    minFilterInputFn (val, update, abort) {
      if (val.length < 2) {
        abort()
        return
      }

      update(() => {
        const needle = val.toLowerCase()
        this.minFilterInputOptions = stringOptions.filter(v => v.toLowerCase().indexOf(needle) > -1)
      })
    },

    chipFilterInputFn (val, update) {
      update(() => {
        if (val === '') {
          this.chipFilterInputOptions = stringOptions
        }
        else {
          const needle = val.toLowerCase()
          this.chipFilterInputOptions = stringOptions.filter(v => v.toLowerCase().indexOf(needle) > -1)
        }
      })
    },

    delayedFilterInputFn (val, update, abort) {
      // call abort() at any time if you can't retrieve data somehow

      setTimeout(() => {
        update(() => {
          if (val === '') {
            this.delayedFilterInputOptions = stringOptions
          }
          else {
            const needle = val.toLowerCase()
            this.delayedFilterInputOptions = stringOptions.filter(v => v.toLowerCase().indexOf(needle) > -1)
          }
        })
      }, 2500)
    },

    delayedAbort () {
      console.log('delayed filter aborted')
    }
  },

  computed: {
    props () {
      return {
        [this.type]: true,
        readonly: this.readonly,
        disable: this.disable,
        dense: this.dense,
        expandBesides: this.expandBesides
      }
    }
  }
}
</script>

<style lang="stylus">
@import '~variables'

.select-card
  transition .3s background-color
  &:not(.disabled):hover
    background $grey-3
</style>
