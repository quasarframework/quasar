export default {
  props: {
    selection: {
      type: String,
      validator: v => ['single', 'multiple'].includes(v)
    },
    selected: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    selectedKeys () {
      const keys = {}
      this.selected.map(row => row[this.rowKey]).forEach(key => {
        keys[key] = true
      })
      return keys
    },
    singleSelection () {
      return this.selection === 'single'
    },
    multipleSelection () {
      return this.selection === 'multiple'
    },
    allRowsSelected () {
      if (this.multipleSelection) {
        return this.computedRows.length > 0 && this.computedRows.every(row => this.selectedKeys[row[this.rowKey]] === true)
      }
    },
    someRowsSelected () {
      if (this.multipleSelection) {
        return !this.allRowsSelected && this.computedRows.some(row => this.selectedKeys[row[this.rowKey]] === true)
      }
    },
    rowsSelectedNumber () {
      return this.selected.length
    }
  },
  methods: {
    isRowSelected (key) {
      return this.selectedKeys[key] === true
    },
    clearSelection () {
      this.$emit('update:selected', [])
    },
    __updateSelection (keys, rows, adding) {
      if (this.singleSelection) {
        this.$emit('update:selected', adding ? rows : [])
      }
      else {
        this.$emit('update:selected', adding
          ? this.selected.concat(rows)
          : this.selected.filter(row => !keys.includes(row[this.rowKey]))
        )
      }
    }
  }
}
