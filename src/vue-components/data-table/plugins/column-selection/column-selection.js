import ColumnSelection from './ColumnSelection.vue'

export default {
  data () {
    return {
      cols: this.columns,
      columnSelection: this.columns.map(col => col.field)
    }
  },
  watch: {
    columnSelection (select) {
      this.cols = this.columns.filter(col => select.includes(col.field))
    }
  },
  components: {
    ColumnSelection
  }
}
