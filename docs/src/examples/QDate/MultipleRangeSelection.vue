<template>
  <div class="q-pa-md">
    <div class="q-gutter-md row items-start">
      <q-date
        :value="null"
        default-year-month="2020/03"
        :ranges="selectedDates"
        :selection-start="selectionStart"
        :selection-end="selectionEnd"
        minimal
        color="purple-12"
        @start:selection="onSelectionStart"
        @extend:selection="onSelectionExtend"
        @update:selection="onSelectionUpdate"
      />

      <ul style="max-width: 350px">
        <li>Click once to start selection mode (if the clicked day is one end of a range than you'll edit that end of the range)</li>
        <li>Click again to select the range</li>
        <li>When a range is selected all previous ranges that overlap it are removed</li>
        <li>Click on a single selected date to deselect it</li>
        <li>Select a range again to deselect it</li>
        <li>Ranges can span multiple months / years</li>
      </ul>
    </div>
  </div>
</template>

<script>
const date2int = date => Number(date.replace(/\//g, ''))

export default {
  data () {
    return {
      selectedDates: [ '2020/02/21', [ '2020/03/01', '2020/03/06' ], '2020/03/11', [ '2020/03/21', '2020/03/18' ], '2020/04/10' ],

      selectionStart: null,
      selectionEnd: null
    }
  },

  methods: {
    onSelectionStart (selectionStart) {
      let index = this.selectedDates.indexOf(selectionStart)

      if (index > -1) {
        // remove selection
        this.selectedDates.splice(index, 1)

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
    },

    onSelectionExtend ([ selectionStart, selectionEnd ]) {
      // mark the selection as outlined
      this.selectionEnd = selectionEnd
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
    }
  }
}
</script>
