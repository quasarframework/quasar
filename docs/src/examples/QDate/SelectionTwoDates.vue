<template>
  <div class="q-pa-md">
    <div class="q-pb-sm">
      Model: {{ days }}
    </div>

    <div class="inline-block shadow-2 rounded-borders">
      <q-date
        ref="rangeStart"
        v-model="days"
        range
        :edit-range="editRangeStart"
        default-year-month="2020/06"
        default-range-view="start"
        :navigation-max-year-month="navMax"
        minimal
        flat
        @mock-range-end="onStartingMockRange"
      />

      <q-date
        ref="rangeEnd"
        v-model="days"
        range
        :edit-range="editRangeEnd"
        default-year-month="2020/07"
        default-range-view="end"
        :navigation-min-year-month="navMin"
        minimal
        flat
        @mock-range-end="onEndingMockRange"
      />
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      days: [
        [ '2020/06/21', '2020/07/10' ]
      ],

      rangeFocus: null
    }
  },

  computed: {
    editRangeStart () {
      return this.rangeFocus || 'start'
    },

    editRangeEnd () {
      return this.rangeFocus || 'end'
    },

    navMin () {
      const data = this.days[0][0].split('/')
      return `${data[0]}/${('' + (Number(data[1]) + 1)).padStart(2, '0')}`
    },

    navMax () {
      const data = this.days[0][1].split('/')
      return `${data[0]}/${('' + (Number(data[1]) - 1)).padStart(2, '0')}`
    }
  },

  methods: {
    onStartingMockRange (date) {
      this.$refs.rangeEnd.setMockRangeEnd(date)
      this.rangeFocus = 'start'
    },

    onEndingMockRange (date) {
      this.$refs.rangeStart.setMockRangeEnd(date)
      this.rangeFocus = 'end'
    }
  }
}
</script>
