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
      <div class="q-mb-lg">
        <q-toggle v-model="readonly" label="Readonly" />
        <q-toggle v-model="disable" label="Disable" />
        <q-toggle v-model="dense" label="Dense" />
        <q-toggle v-model="expandBesides" label="Expand besides" />
      </div>

      <q-select
        v-bind="props"
        v-model="simpleFilter"
        label="Simple filter"
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
        label="Simple filter"
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
        label="Simple filter - min 3 chars"
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
        :loading="delayedLoading"
        label="Delayed filter"
        :options="delayedFilterInputOptions"
        @filter="delayedFilterInputFn"
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

      simpleFilterInput: null,
      simpleFilterInputOptions: null,

      minFilterInput: null,
      minFilterInputOptions: null,

      chipFilterInput: null,
      chipFilterInputOptions: null,

      delayedFilterInput: null,
      delayedFilterInputOptions: null,
      delayedLoading: false,

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
    simpleFilterFn (val, done) {
      done()

      if (this.simpleFilterOptions !== null) {
        return
      }

      this.simpleFilterOptions = stringOptions
    },

    simpleFilterInputFn (val, done) {
      if (val === '') {
        this.simpleFilterInputOptions = stringOptions
        done()
        return
      }

      const needle = val.toLowerCase()
      this.simpleFilterInputOptions = stringOptions.filter(v => v.toLowerCase().indexOf(needle) > -1)
      done()
    },

    minFilterInputFn (val, done) {
      if (val.length < 2) { return }

      const needle = val.toLowerCase()
      this.minFilterInputOptions = stringOptions.filter(v => v.toLowerCase().indexOf(needle) > -1)
      done()
    },

    chipFilterInputFn (val, done) {
      done()

      if (val === '') {
        this.chipFilterInputOptions = stringOptions
        return
      }

      const needle = val.toLowerCase()
      this.chipFilterInputOptions = stringOptions.filter(v => v.toLowerCase().indexOf(needle) > -1)
    },

    delayedFilterInputFn (val, done) {
      this.delayedLoading = true

      setTimeout(() => {
        this.delayedLoading = false

        if (val === '') {
          this.delayedFilterInputOptions = stringOptions
          done()
          return
        }

        const needle = val.toLowerCase()
        this.delayedFilterInputOptions = stringOptions.filter(v => v.toLowerCase().indexOf(needle) > -1)
        done()
      }, 2500)
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
