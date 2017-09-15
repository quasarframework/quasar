export default {
  props: {
    selection: {
      type: String,
      validator: v => ['single', 'multiple'].includes(v)
    }
  },
  data () {
    return {
      multipleSelected: {},
      singleSelected: null
    }
  },
  computed: {
    singleSelection () {
      return this.selection === 'single'
    },
    multipleSelection () {
      return this.selection === 'multiple'
    },
    someRowsSelected () {
      if (this.multipleSelection) {
        return !this.allRowsSelected && this.computedRows.some(row => this.multipleSelected[row[this.rowKey]] === true)
      }
    },
    allRowsSelected () {
      if (this.multipleSelection) {
        return this.computedRows.length > 0 && this.computedRows.every(row => this.multipleSelected[row[this.rowKey]] === true)
      }
    },
    rowsSelectedNumber () {
      return this.multipleSelection
        ? Object.keys(this.multipleSelected).filter(key => this.multipleSelected[key] === true).length
        : (this.singleSelected !== null ? 1 : 0)
    }
  },
  methods: {
    isRowSelected (key) {
      return this.multipleSelection
        ? this.multipleSelected[key] === true
        : this.singleSelected === key
    },
    clearSelection () {
      this.multipleSelected = {}
      this.singleSelected = null
    }
  }
}
