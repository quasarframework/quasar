import QCheckbox from '../checkbox/QCheckbox.js'
import QTh from './QTh.js'

import cache from '../../utils/cache.js'

export default {
  methods: {
    getTableHeader (h) {
      const child = this.getTableHeaderFooterRow(h, 'header')

      if (this.loading === true && this.$scopedSlots.loading === void 0) {
        child.push(
          h('tr', { staticClass: 'q-table__progress' }, [
            h('th', {
              staticClass: 'relative-position',
              attrs: { colspan: this.computedColspan }
            }, this.__getProgress(h))
          ])
        )
      }

      return h('thead', child)
    },

    getTableFooter (h) {
      return h('tfoot', this.getTableHeaderFooterRow(h, 'footer'))
    },

    getTableHeaderFooterRow (h, scope) {
      const
        slotFull = this.$scopedSlots[scope],
        slotCell = this.$scopedSlots[scope + '-cell']

      if (slotFull !== void 0) {
        return slotFull(this.addTableSelectionRowMeta({
          [scope]: true, cols: this.computedCols, sort: this.sort, colsMap: this.computedColsMap
        })).slice()
      }

      const child = this.computedCols.map(col => {
        const
          slotCellCol = this.$scopedSlots[`${scope}-cell-${col.name}`],
          slot = slotCellCol !== void 0 ? slotCellCol : slotCell,
          props = {
            col, cols: this.computedCols, sort: this.sort, colsMap: this.computedColsMap, scope
          }

        return slot !== void 0
          ? slot(props)
          : h(QTh, {
            key: col.name,
            props: { props },
            style: col[scope + 'Style'],
            class: col[scope + 'Classes']
          }, col.label)
      })

      if (this.singleSelection === true && this.grid !== true) {
        child.unshift(h('th', { staticClass: 'q-table--col-auto-width' }, [' ']))
      }
      else if (this.multipleSelection === true) {
        child.unshift(h('th', { staticClass: 'q-table--col-auto-width' }, [
          h(QCheckbox, {
            props: {
              color: this.color,
              value: this.someRowsSelected === true
                ? null
                : this.allRowsSelected,
              dark: this.isDark,
              dense: this.dense
            },
            on: cache(this, 'inp', {
              input: val => {
                if (this.someRowsSelected === true) {
                  val = false
                }
                this.__updateSelection(
                  this.computedRows.map(this.getRowKey),
                  this.computedRows,
                  val
                )
              }
            })
          })
        ]))
      }

      return [
        h('tr', scope === 'header'
          ? { style: this.tableHeaderStyle, class: this.tableHeaderClass }
          : { style: this.tableFooterStyle, class: this.tableFooterClass }
        , child)
      ]
    },

    addTableSelectionRowMeta (data) {
      if (this.multipleSelection === true) {
        Object.defineProperty(data, 'selected', {
          get: () => this.someRowsSelected === true
            ? 'some'
            : this.allRowsSelected,
          set: val => {
            if (this.someRowsSelected === true) {
              val = false
            }
            this.__updateSelection(
              this.computedRows.map(this.getRowKey),
              this.computedRows,
              val
            )
          },
          configurable: true,
          enumerable: true
        })
        data.partialSelected = this.someRowsSelected
        data.multipleSelect = true
      }

      return data
    }
  }
}
