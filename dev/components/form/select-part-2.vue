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

      <div class="text-h6">Autocomplete with static data</div>
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
        with-filter
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
        v-model="delayedFilterInput"
        with-filter
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

      <!--
      <div class="text-h6">Autocomplete with static data</div>
      <q-select
        v-bind="props"
        v-model="stringSingle"
        with-filter
        label="Filter - single"
        :options="filterOptions"
        @filter="filterFn"
      >
        <q-item slot="no-option">
          <q-item-section class="text-grey">
            No results
          </q-item-section>
        </q-item>
      </q-select>

      <div class="text-h6">Autocomplete with dynamic data</div>
      <q-select
        v-bind="props"
        v-model="stringSingle"
        with-filter
        label="Filter - single"
        :loading="loading"
        :options="filterOptions"
        @filter="filterDynamicFn"
      >
        <q-item slot="no-option">
          <q-item-section class="text-grey">
            No results
          </q-item-section>
        </q-item>
      </q-select>

      -->
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
      ],

      loading: false,
      // dynamicOptions: null,
      filterOptions: stringOptions
    }
  },

  methods: {
    simpleFilterFn (val) {
      if (this.simpleFilterOptions !== null) {
        return
      }

      this.simpleFilterOptions = stringOptions
    },

    simpleFilterInputFn (val) {
      if (val === '') {
        this.simpleFilterInputOptions = stringOptions
        return
      }

      const needle = val.toLowerCase()
      this.simpleFilterInputOptions = stringOptions.filter(v => v.toLowerCase().indexOf(needle) > -1)
    },

    delayedFilterInputFn (val) {
      this.delayedLoading = true

      setTimeout(() => {
        this.delayedLoading = false

        if (val === '') {
          this.delayedFilterInputOptions = stringOptions
          return
        }

        const needle = val.toLowerCase()
        this.delayedFilterInputOptions = stringOptions.filter(v => v.toLowerCase().indexOf(needle) > -1)
      }, 2500)
    },

    filterFn (val) {
      console.log('filtering')
      if (val === '') {
        this.filterOptions = this.stringOptions
        return
      }

      const needle = val.toLowerCase()
      this.filterOptions = this.stringOptions.filter(v => v.toLowerCase().indexOf(needle) > -1)
    },

    filterDynamicFn (val) {
      console.log('filterDynamicFn')
      this.loading = true

      setTimeout(() => {
        this.filterFn(val)
        this.loading = false
      }, 1000)
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
