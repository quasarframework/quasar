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
    </div>
  </div>
</template>

<script>
const date2int = date => Number(date.replace(/\//g, ''))

export default {
  data () {
    return {
      defaultYM: {
        start: '2020/03',
        end: '2020/04'
      },

      selectedDates: [],

      selectionStart: null,
      selectionEnd: null
    }
  },

  methods: {
    onSelectionStart (selectionStart) {
      this.selectionStart = selectionStart
      this.selectionEnd = selectionStart
    },

    onSelectionExtend ([ selectionStart, selectionEnd ]) {
      this.selectionEnd = date2int(selectionStart) <= date2int(selectionEnd) ? selectionEnd : selectionStart
    },

    onSelectionUpdate ([ selectionStart, selectionEnd ]) {
      if (selectionStart === this.selectionStart) {
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
