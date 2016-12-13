import TableSticky from './TableSticky.vue'

export default {
  computed: {
    leftStickyColumns () {
      let
        number = this.config.leftStickyColumns || 0,
        cols = number

      for (let i = 0; i < cols; i++) {
        if (!this.columnSelection.includes(this.columns[i].field)) {
          number--
        }
      }
      return number
    },
    rightStickyColumns () {
      let
        number = this.config.rightStickyColumns || 0,
        cols = number,
        length = this.columns.length

      for (let i = 1; i <= cols; i++) {
        if (!this.columnSelection.includes(this.columns[length - i].field)) {
          number--
        }
      }
      return number
    },
    regularCols () {
      return this.cols.slice(this.leftStickyColumns, this.cols.length - this.rightStickyColumns)
    },
    leftCols () {
      return Array.apply(null, Array(this.leftStickyColumns)).map((col, n) => this.cols[n])
    },
    rightCols () {
      return Array.apply(null, Array(this.rightStickyColumns)).map((col, n) => this.cols[this.cols.length - this.rightStickyColumns + n])
    }
  },
  components: {
    TableSticky
  }
}
