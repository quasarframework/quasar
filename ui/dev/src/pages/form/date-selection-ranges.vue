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

    <div>Ranges (model with v-model)</div>
    <div class="row q-gutter-md items-start">
      <q-date
        v-model="date2"
        :ranges="ranges"
        :selection-start="selectionStart"
        :selection-end="selectionEnd"
        minimal
        @start:selection="onSelectionStart"
        @extend:selection="onSelectionExtend"
        @update:selection="onSelectionUpdate"
      />
      <small><pre>{{ ranges }}</pre></small>
    </div>

    <div>Ranges (model with :value)</div>
    <div class="row q-gutter-md items-start">
      <q-date
        :value="noDate"
        :ranges="ranges"
        :selection-start="selectionStart"
        :selection-end="selectionEnd"
        minimal
        color="deep-orange"
        @start:selection="onSelectionStart"
        @extend:selection="onSelectionExtend"
        @update:selection="onSelectionUpdate"
      />
      <small><pre>{{ ranges }}</pre></small>
    </div>
  </div>
</template>

<script>
const
  now = new Date(),
  month = now.getMonth() + 1,
  prefix = now.getFullYear() + '/' + (month < 10 ? '0' : '') + month + '/',
  ranges = []

const date2int = date => Number(date.replace(/\//g, ''))

ranges.push([ prefix + '02', prefix + '08' ])

export default {
  data () {
    return {
      date: null,
      date2: null,
      noDate: null,
      ranges,

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
      const index = this.ranges.indexOf(selectionStart)

      if (index > -1) {
        this.ranges.splice(index, 1)

        console.log('@start:selection - remove selection', selectionStart)
      }
      else {
        this.selectionStart = selectionStart
        this.selectionEnd = selectionStart

        console.log('@start:selection - set start', selectionStart)
      }
    },

    onSelectionExtend ([ selectionStart, selectionEnd ]) {
      this.selectionStart = selectionStart
      this.selectionEnd = selectionEnd

      console.log('@extend:selection', selectionStart, selectionEnd)
    },

    onSelectionUpdate ([ selectionStart, selectionEnd ]) {
      this.selectionStart = null
      this.selectionEnd = null

      let exactMatch = false

      const ranges = this.ranges.filter(range => {
        if (Array.isArray(range) !== true) {
          const rangeInt = date2int(range)

          return rangeInt < date2int(selectionStart) || rangeInt > date2int(selectionEnd)
        }

        if (range.length < 2) {
          return false
        }

        const rangeInt = range.map(date2int)

        if (rangeInt[0] <= date2int(selectionEnd) && rangeInt[1] >= date2int(selectionStart)) {
          if (range[0] === selectionStart && range[1] === selectionEnd) {
            exactMatch = true
          }

          return false
        }

        return true
      })

      if (exactMatch !== true) {
        ranges.push(selectionStart === selectionEnd ? selectionStart : [ selectionStart, selectionEnd ])
      }

      this.ranges = ranges

      console.log('@update:selection', selectionStart, selectionEnd)
    }
  }
}
</script>
