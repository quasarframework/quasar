import QCheckbox from '../checkbox/QCheckbox.js'

export default {
  methods: {
    getTableRowBody (row, body) {
      const
        key = this.getRowKey(row),
        selected = this.isRowSelected(key)

      return body(this.addBodyRowMeta({
        key,
        row,
        cols: this.computedCols,
        colsMap: this.computedColsMap,
        __trClass: selected ? 'selected' : ''
      }))
    },

    getTableRow (h, row) {
      const
        bodyCell = this.$scopedSlots['body-cell'],
        key = this.getRowKey(row),
        selected = this.isRowSelected(key),
        child = bodyCell
          ? this.computedCols.map(col => bodyCell(this.addBodyCellMetaData({ row, col })))
          : this.computedCols.map(col => {
            const slot = this.$scopedSlots[`body-cell-${col.name}`]
            return slot !== void 0
              ? slot(this.addBodyCellMetaData({ row, col }))
              : h('td', {
                class: col.__tdClass,
                style: col.__tdStyle
              }, this.getCellValue(col, row))
          })

      this.hasSelectionMode === true && child.unshift(
        h('td', { staticClass: 'q-table--col-auto-width' }, [
          h(QCheckbox, {
            props: {
              value: selected,
              color: this.color,
              dark: this.isDark,
              dense: this.dense
            },
            on: {
              input: adding => {
                this.__updateSelection([ key ], [ row ], adding)
              }
            }
          })
        ])
      )

      const data = { key, class: { selected }, on: {} }

      if (this.$listeners['row-click'] !== void 0) {
        data.class['cursor-pointer'] = true
        data.on.click = evt => {
          this.$emit('row-click', evt, row)
        }
      }

      if (this.$listeners['row-dblclick'] !== void 0) {
        data.class['cursor-pointer'] = true
        data.on.dblclick = evt => {
          this.$emit('row-dblclick', evt, row)
        }
      }

      return h('tr', data, child)
    },

    getTableBody (h) {
      const
        body = this.$scopedSlots.body,
        topRow = this.$scopedSlots['top-row'],
        bottomRow = this.$scopedSlots['bottom-row'],
        mapFn = body !== void 0
          ? row => this.getTableRowBody(row, body)
          : row => this.getTableRow(h, row)

      let child = this.computedRows.map(mapFn)

      if (topRow !== void 0) {
        child = topRow({ cols: this.computedCols }).concat(child)
      }
      if (bottomRow !== void 0) {
        child = child.concat(bottomRow({ cols: this.computedCols }))
      }

      return h('tbody', child)
    },

    getTableRowVirtual (h) {
      const body = this.$scopedSlots.body

      return body !== void 0
        ? props => this.getTableRowBody(props.item, body)
        : props => this.getTableRow(h, props.item)
    },

    addBodyRowMeta (data) {
      this.hasSelectionMode === true && Object.defineProperty(data, 'selected', {
        get: () => this.isRowSelected(data.key),
        set: adding => {
          this.__updateSelection([ data.key ], [ data.row ], adding)
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
