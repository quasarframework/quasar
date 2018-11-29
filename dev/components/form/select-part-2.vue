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
        v-model="stringSingle"
        label="Filter - single"
        :filter.sync="filter"
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
        label="Filter - single"
        :filter.sync="filter"
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

      <div style="height: 400px">Scroll on purpose</div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    const stringOptions = [
      'Google', 'Facebook', 'Twitter', 'Apple', 'Oracle'
    ]

    return {
      type: 'filled',
      readonly: false,
      disable: false,
      dense: false,
      expandBesides: false,

      stringSingle: 'Facebook',
      stringMultiple: ['Facebook', 'Twitter'],
      stringOptions: [
        'Google', 'Facebook', 'Twitter', 'Apple', 'Oracle'
      ],

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

      filter: '',
      loading: false,
      // dynamicOptions: null,
      filterOptions: stringOptions
    }
  },

  methods: {
    filterFn (val) {
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
