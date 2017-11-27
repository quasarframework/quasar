import { QProgress } from '../progress'
import { QCheckbox } from '../checkbox'
import QTh from './QTh'

export default {
  methods: {
    getTableHeader (h) {
      if (this.noHeader) {
        return
      }

      const child = [ this.getTableHeaderRow(h) ]

      if (this.loader) {
        child.push(h('tr', { staticClass: 'q-table-progress animate-fade' }, [
          h('td', { attrs: {colspan: '100%'} }, [
            h(QProgress, {
              props: {
                color: this.color,
                indeterminate: true,
                height: '2px'
              }
            })
          ])
        ]))
      }

      return h('thead', child)
    },
    getTableHeaderRow (h) {
      const
        header = this.$scopedSlots.header,
        headerCell = this.$scopedSlots['header-cell']

      if (header) {
        return header(this.addTableHeaderRowMeta({header: true, cols: this.computedCols, sort: this.sort, colsMap: this.computedColsMap}))
      }

      let mapFn

      if (headerCell) {
        mapFn = col => headerCell({col, cols: this.computedCols, sort: this.sort, colsMap: this.computedColsMap})
      }
      else {
        mapFn = col => h(QTh, {
          key: col.name,
          props: {
            props: {
              col,
              cols: this.computedCols,
              sort: this.sort,
              colsMap: this.computedColsMap
            }
          }
        }, col.label)
      }
      const child = this.computedCols.map(mapFn)

      if (this.singleSelection) {
        child.unshift(h('th', { staticClass: 'q-table-col-auto-width' }, [' ']))
      }
      else if (this.multipleSelection) {
        child.unshift(h('th', { staticClass: 'q-table-col-auto-width' }, [
          h(QCheckbox, {
            props: {
              color: this.color,
              value: this.allRowsSelected,
              dark: this.dark,
              indeterminate: this.someRowsSelected
            },
            on: {
              input: val => {
                if (this.someRowsSelected) {
                  val = false
                }
                this.__updateSelection(
                  this.computedRows.map(row => row[this.rowKey]),
                  this.computedRows,
                  val
                )
              }
            }
          })
        ]))
      }

      return h('tr', child)
    },
    addTableHeaderRowMeta (data) {
      if (this.multipleSelection) {
        Object.defineProperty(data, 'selected', {
          get: () => this.allRowsSelected,
          set: val => {
            if (this.someRowsSelected) {
              val = false
            }
            this.__updateSelection(
              this.computedRows.map(row => row[this.rowKey]),
              this.computedRows,
              val
            )
          }
        })
        data.partialSelected = this.someRowsSelected
        data.multipleSelect = true
      }

      return data
    }
  }
}
