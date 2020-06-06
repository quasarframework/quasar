<template>
  <div class="q-pa-md">
    <div class="q-gutter-md row">
      <div class="row items-start shadow-2">
        <q-date
          ref="start"
          :value="null"
          :default-year-month="defaultYM.start"
          :ranges="selectedDates"
          :selection-start="selectionStart"
          :selection-end="selectionEnd"
          minimal
          flat
          emit-immediately
          @input="(_, reason, dateObj) => { syncCalendars('start', reason, dateObj) }"
          @start:selection="onSelectionStart"
          @extend:selection="onSelectionExtend"
          @update:selection="onSelectionUpdate"
        />

        <q-date
          ref="end"
          :value="null"
          :default-year-month="defaultYM.end"
          :ranges="selectedDates"
          :selection-start="selectionStart"
          :selection-end="selectionEnd"
          minimal
          flat
          emit-immediately
          @input="(_, reason, dateObj) => { syncCalendars('end', reason, dateObj) }"
          @extend:selection="onSelectionExtend"
          @update:selection="onSelectionUpdate"
        />
      </div>

      <ul style="max-width: 350px">
        <li>Click once to start selection mode</li>
        <li>Click again to select the range</li>
        <li>The selected range must be at least 3 days and at most 14 days</li>
      </ul>
    </div>
  </div>
</template>

<script>
import { date } from 'quasar'

const date2int = date => Number(date.replace(/\//g, ''))
const { addToDate, formatDate } = date

export default {
  data () {
    return {
      defaultYM: {
        start: '2020/03',
        end: '2020/04'
      },

      selectedDates: [],

      selectionStart: null,
      selectionEnd: null,

      selectionMin: null,
      selectionMax: null
    }
  },

  methods: {
    onSelectionStart (selectionStart) {
      this.selectionStart = selectionStart
      this.selectionEnd = formatDate(addToDate(selectionStart, { days: 2 }), 'YYYY/MM/DD')

      this.selectionMin = this.selectionEnd
      this.selectionMax = formatDate(addToDate(selectionStart, { days: 13 }), 'YYYY/MM/DD')
    },

    onSelectionExtend ([ selectionStart, selectionEnd ]) {
      if (date2int(this.selectionMin) <= date2int(selectionEnd)) {
        this.selectionEnd = date2int(selectionEnd) <= date2int(this.selectionMax)
          ? selectionEnd
          : this.selectionMax
      }
      else {
        this.selectionEnd = this.selectionMin
      }
    },

    onSelectionUpdate ([ selectionStart, selectionEnd ]) {
      if (
        selectionStart === this.selectionStart &&
        date2int(this.selectionMin) <= date2int(selectionEnd) &&
        date2int(selectionEnd) <= date2int(this.selectionMax)
      ) {
        this.selectedDates = [ [ selectionStart, selectionEnd ] ]

        this.selectionStart = null
        this.selectionEnd = null
      }
    },

    syncCalendars (ref, reason, dateObj) {
      if (ref === 'start' && this.selectionStart !== null) {
        if (this.$refs.start !== void 0) {
          const [ startY, startM ] = this.defaultYM.start.split('/').map(Number)

          this.$refs.start.setMonthYear(startM, startY)
        }
      }
      else if (ref === 'end' || reason === 'day' || this.selectionStart === null) {
        this.defaultYM[ref] = dateObj.year + (dateObj.month > 9 ? '/' : '/0') + dateObj.month

        if (date2int(this.defaultYM.start) >= date2int(this.defaultYM.end) && this.$refs.end !== void 0) {
          const [ startY, startM ] = this.defaultYM.start.split('/').map(Number)

          if (startM === 12) {
            this.$refs.end.setMonthYear(1, startY + 1)
          }
          else {
            this.$refs.end.setMonthYear(startM + 1, startY)
          }
        }
      }
    }
  }
}
</script>
