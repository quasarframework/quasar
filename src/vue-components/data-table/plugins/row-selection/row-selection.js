function getRowSelection (rows, selection, multiple) {
  if (!selection) {
    return []
  }
  return multiple ? rows.map(() => false) : [-1]
}

export default {
  data () {
    return {
      rowSelection: []
    }
  },
  created () {
    this.rowSelection = getRowSelection(this.rows, this.config.selection, this.config.selection === 'multiple')
  },
  watch: {
    rows (r) {
      this.rowSelection = getRowSelection(r, this.config.selection, this.config.selection === 'multiple')
    },
    rowSelection () {
      this.$nextTick(() => {
        if (this.rowsSelected) {
          this.toolbar = 'selection'
          return
        }
        if (this.toolbar === 'selection') {
          this.toolbar = ''
        }
      })
    }
  },
  computed: {
    rowsSelected () {
      return this.rowSelection.filter(r => r).length
    },
    selectedRows () {
      if (this.config.selection === 'multiple') {
        return this.rowSelection
          .map((selected, index) => [selected, this.rows[index].__index])
          .filter(row => row[0])
          .map(row => {
            return { index: row[1], data: this.data[row[1]] }
          })
      }

      if (this.rowSelection[0] === -1) {
        return []
      }
      const
        index = this.rows[this.rowSelection[0]].__index,
        row = this.data[index]

      return {index, data: row}
    }
  },
  methods: {
    clearSelection () {
      if (this.config.selection !== 'multiple') {
        this.rowSelection = [-1]
        return
      }
      this.rowSelection = this.rows.map(() => false)
    }
  }
}
