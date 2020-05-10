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
      this.selected.map(this.getRowKey).forEach(key => {
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
      return this.computedRows.length > 0 && this.computedRows.every(
        row => this.selectedKeys[ this.getRowKey(row) ] === true
      )
    },

    someRowsSelected () {
      return this.allRowsSelected !== true &&
        this.computedRows.some(row => this.selectedKeys[ this.getRowKey(row) ] === true)
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

    __updateSelection (keys, rows, added, evt) {
      this.$emit('selection', { rows, added, keys, evt })

      const payload = this.singleSelection === true
        ? (added === true ? rows : [])
        : (
          added === true
            ? this.selected.concat(rows)
            : this.selected.filter(
              row => keys.includes(this.getRowKey(row)) === false
            )
        )

      this.$emit('update:selected', payload)
    }
  }
}
