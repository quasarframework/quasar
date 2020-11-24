import { h } from 'vue'

import QCheckbox from '../checkbox/QCheckbox.js'

export default {
  methods: {
    __getTBodyTR (row, bodySlot, pageIndex) {
      const
        key = this.getRowKey(row),
        selected = this.isRowSelected(key)

      if (bodySlot !== void 0) {
        return bodySlot(
          this.__getBodyScope({
            key,
            row,
            pageIndex,
            __trClass: selected ? 'selected' : ''
          })
        )
      }

      const
        bodyCell = this.$slots[ 'body-cell' ],
        child = this.computedCols.map(col => {
          const
            bodyCellCol = this.$slots[ `body-cell-${col.name}` ],
            slot = bodyCellCol !== void 0 ? bodyCellCol : bodyCell

          return slot !== void 0
            ? slot(this.__getBodyCellScope({ key, row, pageIndex, col }))
            : h('td', {
              class: col.__tdClass,
              style: col.style
            }, this.getCellValue(col, row))
        })

      if (this.hasSelectionMode === true) {
        const slot = this.$slots[ 'body-selection' ]
        const content = slot !== void 0
          ? slot(this.__getBodySelectionScope({ key, row, pageIndex }))
          : [
              h(QCheckbox, {
                modelValue: selected,
                color: this.color,
                dark: this.isDark,
                dense: this.dense,
                'onUpdate:modelValue': (adding, evt) => {
                  this.__updateSelection([key], [row], adding, evt)
                }
              })
            ]

        child.unshift(
          h('td', { class: 'q-table--col-auto-width' }, content)
        )
      }

      const data = { key, class: { selected } }

      if (this.emitListeners[ 'onRow-click' ] === true) {
        data.class[ 'cursor-pointer' ] = true
        data.onClick = evt => {
          this.$emit('row-click', evt, row, pageIndex)
        }
      }

      if (this.emitListeners[ 'onRow-dblclick' ] === true) {
        data.class[ 'cursor-pointer' ] = true
        data.onDblclick = evt => {
          this.$emit('row-dblclick', evt, row, pageIndex)
        }
      }

      return h('tr', data, child)
    },

    __getTBody () {
      const
        body = this.$slots.body,
        topRow = this.$slots[ 'top-row' ],
        bottomRow = this.$slots[ 'bottom-row' ]

      let child = this.computedRows.map(
        (row, pageIndex) => this.__getTBodyTR(row, body, pageIndex)
      )

      if (topRow !== void 0) {
        child = topRow({ cols: this.computedCols }).concat(child)
      }
      if (bottomRow !== void 0) {
        child = child.concat(bottomRow({ cols: this.computedCols }))
      }

      return h('tbody', child)
    },

    __getBodyScope (data) {
      this.__injectBodyCommonScope(data)

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

    __getBodyCellScope (data) {
      this.__injectBodyCommonScope(data)

      Object.defineProperty(data, 'value', {
        get: () => this.getCellValue(data.col, data.row),
        configurable: true,
        enumerable: true
      })

      return data
    },

    __getBodySelectionScope (data) {
      this.__injectBodyCommonScope(data)
      return data
    },

    __injectBodyCommonScope (data) {
      Object.assign(data, {
        cols: this.computedCols,
        colsMap: this.computedColsMap,
        sort: this.sort,
        rowIndex: this.firstRowIndex + data.pageIndex,
        color: this.color,
        dark: this.isDark,
        dense: this.dense
      })

      this.hasSelectionMode === true && Object.defineProperty(data, 'selected', {
        get: () => this.isRowSelected(data.key),
        set: (adding, evt) => {
          this.__updateSelection([data.key], [data.row], adding, evt)
        },
        configurable: true,
        enumerable: true
      })

      Object.defineProperty(data, 'expand', {
        get: () => this.isRowExpanded(data.key),
        set: adding => {
          this.__updateExpanded(data.key, adding)
        },
        configurable: true,
        enumerable: true
      })
    },

    getCellValue (col, row) {
      const val = typeof col.field === 'function' ? col.field(row) : row[ col.field ]
      return col.format !== void 0 ? col.format(val, row) : val
    }
  }
}
