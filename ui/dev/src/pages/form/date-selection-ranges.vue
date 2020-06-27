<template>
  <div class="q-layout-padding column q-gutter-md">
    <q-date
      v-model="date"
      :events="eventFn"
      :event-color="eventColorFn"
      :options="optionsFn"
      :ranges="rangesFn"
      @input="inputLog"
    />

    <div class="row q-gutter-md items-start">
      <q-date
        v-model="date2"
        :ranges="selectedDates"
        :selection-start="selectionStart"
        :selection-end="selectionEnd"
        minimal
        @start:selection="onSelectionStart"
        @extend:selection="onSelectionExtend"
        @update:selection="onSelectionUpdate"
      />
      <div>
        <div>Ranges (model with v-model)</div>
        <small><pre>{{ selectedDates }}</pre></small>
      </div>
    </div>

    <div class="row q-gutter-md items-start">
      <q-date
        :value="noDate"
        :ranges="selectedDates"
        :selection-start="selectionStart"
        :selection-end="selectionEnd"
        minimal
        color="deep-orange"
        @start:selection="onSelectionStart"
        @extend:selection="onSelectionExtend"
        @update:selection="onSelectionUpdate"
      />
      <div>
        <div>Ranges (model with :value)</div>
        <small><pre>{{ selectedDates }}</pre></small>
      </div>
    </div>
  </div>
</template>

<script>
const
  now = new Date(),
  month = now.getMonth() + 1,
  prefix = now.getFullYear() + '/' + (month < 10 ? '0' : '') + month + '/',
  selectedDates = []

const date2int = date => Number(date.replace(/\//g, ''))

selectedDates.push([ prefix + '02', prefix + '08' ])

export default {
  data () {
    return {
      date: null,
      date2: null,
      noDate: null,
      selectedDates,

      selectionStart: null,
      selectionEnd: null
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

    rangesFn (date) {
      const day = 1 * date.slice(8, 10)
      const size = 4 + date.slice(5, 7) % 3
      const group = Math.floor(day / size)

      if (
        [1, 2, 4].indexOf(group) > -1 &&
        group * size <= day &&
        day <= group * size + size - 1
      ) {
        return {
          start: group * size === day,
          end: group * size + size - 1 === day,
          color: group === 1 ? 'deep-orange' : ( group === 2 ? 'green' : 'blue')
        }
      }
    },

    inputLog (value, reason, date) {
      console.log('@input', value, reason, date)
    },

    onSelectionStart (selectionStart) {
      let index = this.selectedDates.indexOf(selectionStart)

      if (index > -1) {
        // remove selection
        this.selectedDates.splice(index, 1)

        console.log('@start:selection - remove selection', selectionStart)

        return
      }

      // start range selection mode
      this.selectionStart = selectionStart
      this.selectionEnd = selectionStart

      index = this.selectedDates.findIndex(range => Array.isArray(range) === true && range.length > 1 && range.indexOf(selectionStart) > -1)

      if (index > -1) {
        // edit one end of a range
        const
          range = this.selectedDates[index].slice(0, 2),
          orderedRange = date2int(range[0]) <= date2int(range[1]) ? range : range.reverse()

        this.selectionStart = selectionStart === orderedRange[0]
          ? orderedRange[1]
          : orderedRange[0]
      }

      console.log('@start:selection - set start', selectionStart)
    },

    onSelectionExtend ([ selectionStart, selectionEnd ]) {
      // mark the selection as outlined
      this.selectionEnd = selectionEnd

      console.log('@extend:selection', selectionStart, selectionEnd)
    },

    onSelectionUpdate ([ selectionStart, selectionEnd ]) {
      this.selectionStart = null
      this.selectionEnd = null

      let exactMatch = false

      // remove all previous selected dates that overlap the new range
      const ranges = this.selectedDates.filter(range => {
        if (Array.isArray(range) !== true) {
          const rangeInt = date2int(range)

          return rangeInt < date2int(selectionStart) || rangeInt > date2int(selectionEnd)
        }

        if (range.length < 2) {
          return false
        }

        const rangeInt = range.map(date2int).slice(0, 2).sort()

        if (rangeInt[0] <= date2int(selectionEnd) && rangeInt[1] >= date2int(selectionStart)) {
          if (range[0] === selectionStart && range[1] === selectionEnd) {
            exactMatch = true
          }

          return false
        }

        return true
      })

      // remove the range if it is selected again
      if (exactMatch !== true) {
        ranges.push(selectionStart === selectionEnd ? selectionStart : [ selectionStart, selectionEnd ])
      }

      this.selectedDates = ranges

      console.log('@update:selection', selectionStart, selectionEnd)
    }
  }
}
</script>
