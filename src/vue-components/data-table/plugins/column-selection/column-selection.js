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
    },
    'config.columnPicker' (value) {
      if (!value) {
        this.columnSelection = this.columns.map(col => col.field)
      }
    }
  },
  computed: {
    columnSelectionOptions () {
      return this.columns.map(col => {
        return {
          label: col.label,
          value: col.field
        }
      })
    }
  }
}
