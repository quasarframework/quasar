<template>
  <div class="q-pa-md">
    <div class="q-gutter-md row items-start">
      <q-date
        range
        v-model="dateRangeDoble"
      />
      <q-input mask="date" label="From" v-model="dateFrom" />
      <q-input mask="date" label="To" v-model="dateTo" />
    </div>
    <div class="q-gutter-md row items-start">
      <q-date
        range
        v-model="dateRangeSingle"
      />
      <q-input mask="####/##/##—####/##/##" label="From—To" v-model="dateFromTo" />
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      dateFrom: '2012/06/18',
      dateTo: '2015/04/10',
      dateFromTo: '2012/06/18\u20142015/04/10'
    }
  },
  computed: {
    dateRangeDoble: {
      get: function () {
        const value = [ this.dateFrom, this.dateTo ].filter(v => v !== undefined && v.length === 10 && !isNaN(new Date(v).getTime()))
        return value.length === 2 && value[0] === value[1] ? value[0] : [ [ ...value ] ]
      },
      set: function (newValue) {
        if (Array.isArray(newValue)) {
          this.dateFrom = newValue[0][0] !== null ? newValue[0][0] : ''
          this.dateTo = newValue[0][1] !== null ? newValue[0][1] : ''
        }
        else {
          this.dateFrom = this.dateTo = newValue !== null ? newValue : ''
        }
      }
    },
    dateRangeSingle: {
      get: function () {
        const value = this.dateFromTo.split('\u2014').filter(v => v !== undefined && v.length === 10 && !isNaN(new Date(v).getTime()))
        return value.length === 2 && value[0] === value[1] ? value[0] : [ [ ...value ] ]
      },
      set: function (newValue) {
        this.dateFromTo = Array.isArray(newValue)
          ? newValue[0][0] + (newValue[0].length > 1 ? '\u2014' + newValue[0][1] : '')
          : newValue + '\u2014' + newValue
      }
    }
  }
}
</script>
