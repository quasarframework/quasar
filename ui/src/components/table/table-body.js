import QCheckbox from '../checkbox/QCheckbox.js'

export default {
  methods: {
    getTableBody (h) {
      const
        body = this.$scopedSlots.body,
        bodyCell = this.$scopedSlots['body-cell'],
        topRow = this.$scopedSlots['top-row'],
        bottomRow = this.$scopedSlots['bottom-row']
      let
        child = []

      if (body !== void 0) {
        child = this.computedRows.map(row => {
          const
            key = row[this.rowKey],
            selected = this.isRowSelected(key)

          return body(this.addBodyRowMeta({
            key,
            row,
            cols: this.computedCols,
            colsMap: this.computedColsMap,
            __trClass: selected ? 'selected' : ''
          }))
        })
      }
      else {
        child = this.computedRows.map(row => {
          const
            key = row[this.rowKey],
            selected = this.isRowSelected(key),
            child = bodyCell
              ? this.computedCols.map(col => bodyCell(this.addBodyCellMetaData({ row, col })))
              : this.computedCols.map(col => {
                const slot = this.$scopedSlots[`body-cell-${col.name}`]
                return slot !== void 0
                  ? slot(this.addBodyCellMetaData({ row, col }))
                  : h('td', {
                    staticClass: col.__tdClass,
                    style: col.style,
                    class: col.classes
                  }, this.getCellValue(col, row))
              })

          this.hasSelectionMode === true && child.unshift(
            h('td', { staticClass: 'q-table--col-auto-width' }, [
              h(QCheckbox, {
                props: {
                  value: selected,
                  color: this.color,
                  dark: this.dark,
                  dense: this.dense
                },
                on: {
                  input: adding => {
                    this.__updateSelection([key], [row], adding)
                  }
                }
              })
            ])
          )

          return h('tr', { key, class: { selected } }, child)
        })
      }

      if (topRow !== void 0) {
        child.unshift(topRow({ cols: this.computedCols }))
      }
      if (bottomRow !== void 0) {
        child.push(bottomRow({ cols: this.computedCols }))
      }

      return h('tbody', child)
    },

    addBodyRowMeta (data) {
      this.hasSelectionMode === true && Object.defineProperty(data, 'selected', {
        get: () => this.isRowSelected(data.key),
        set: adding => {
          this.__updateSelection([data.key], [data.row], adding)
        },
        configurable: true,
        enumerable: true
      })

      Object.defineProperty(data, 'expand', {
        get: () => this.rowsExpanded[data.key] === true,
        set: val => {
          this.$set(this.rowsExpanded, data.key, val)
        },
        configurable: true,
        enumerable: true
      })

      data.cols = data.cols.map(col => {
        const c = { ...col }
        Object.defineProperty(c, 'value', {
          get: () => this.getCellValue(col, data.row),
          configurable: true,
          enumerable: true
        })
        return c
      })

      return data
    },

    addBodyCellMetaData (data) {
      Object.defineProperty(data, 'value', {
        get: () => this.getCellValue(data.col, data.row),
        configurable: true,
        enumerable: true
      })
      return data
    },

    getCellValue (col, row) {
      const val = typeof col.field === 'function' ? col.field(row) : row[col.field]
      return col.format !== void 0 ? col.format(val, row) : val
    }
  }
}
