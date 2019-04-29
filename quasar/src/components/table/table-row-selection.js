export default {
  props: {
    selection: {
      type: String,
      default: 'none',
      validator: v => ['single', 'multiple', 'none'].includes(v)
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

    hasSelectionMode () {
      return this.selection !== 'none'
    },

    singleSelection () {
      return this.selection === 'single'
    },

    multipleSelection () {
      return this.selection === 'multiple'
    },

    allRowsSelected () {
      if (this.multipleSelection === true) {
        return this.computedRows.length > 0 && this.computedRows.every(row => this.selectedKeys[row[this.rowKey]] === true)
      }
    },

    someRowsSelected () {
      if (this.multipleSelection === true) {
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

    __updateSelection (keys, rows, added) {
      this.$emit('selection', { rows, added, keys })

      if (this.singleSelection === true) {
        this.$emit('update:selected', added ? rows : [])
      }
      else {
        this.$emit('update:selected', added
          ? this.selected.concat(rows)
          : this.selected.filter(
            row => keys.includes(row[this.rowKey]) === false
          )
        )
      }
    }
  }
}
