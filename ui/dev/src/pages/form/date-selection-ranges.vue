<template>
  <div class="q-layout-padding column q-gutter-md">
    <q-date
      v-model="date"
      :events="eventFn"
      :event-color="eventColorFn"
      :options="optionsFn"
      :range="selectionRangesFn"
      @input="inputLog"
    />

    <div>Ranges (model with v-model)</div>
    <div class="row q-gutter-md items-start">
      <q-date
        v-model="date2"
        :range="selectionRanges"
        minimal
        @update:range="onRange"
      />
      <small><pre>{{ selectionRanges }}</pre></small>
    </div>

    <div>Ranges (model with :value)</div>
    <div class="row q-gutter-md items-start">
      <q-date
        :value="noDate"
        :range="selectionRanges"
        minimal
        @update:range="onRange"
        color="deep-orange"
      />
      <small><pre>{{ selectionRanges }}</pre></small>
    </div>
  </div>
</template>

<script>
const
  now = new Date(),
  month = now.getMonth() + 1,
  prefix = now.getFullYear() + '/' + (month < 10 ? '0' : '') + month + '/',
  selectionRanges = []

for (let i = 2; i < 8; i++) {
  selectionRanges.push(prefix + '0' + i)
}

export default {
  data () {
    return {
      date: null,
      date2: null,
      noDate: null,
      selectionRanges,
      prevRange: null
    }
  },

  methods: {
    eventFn (date) {
      return (date[9] * date[6]) % 3 === 0
    },

    eventColorFn (date) {
      return (date[9] * date[6]) % 2 === 0 ? 'teal' : 'orange'
    },

    optionsFn (date) {
      return (date[9] * date[6]) % 7 > 2
    },

    selectionRangesFn (date) {
      return (date[9] * date[6]) % 14 < 3 || (date[9] * date[6]) % 11 < 6
    },

    inputLog (value, reason, date) {
      console.log('@input', value, reason, date)
    },

    changeRange (value, toggle) {
      const index = this.selectionRanges.indexOf(value)
      if (index > -1) {
        toggle === true && this.selectionRanges.splice(index, 1)
      }
      else {
        this.selectionRanges.push(value)
      }
      this.selectionRanges = this.selectionRanges.slice()
    },

    onRange (current, prev) {
      console.log('@range', current, prev)
      if (prev) {
        console.log('setRange: ', current, prev)
        this.changeRange(current)
        this.changeRange(prev)
      }
      else {
        this.changeRange(current, true)
      }
    }
  }
}
</script>
