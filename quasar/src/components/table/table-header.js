import QLinearProgress from '../linear-progress/QLinearProgress.js'
import QCheckbox from '../checkbox/QCheckbox.js'
import QTh from './QTh.js'

export default {
  methods: {
    getTableHeader (h) {
      const child = [ this.getTableHeaderRow(h) ]

      if (this.loading === true) {
        child.push(h('tr', { staticClass: 'q-table__progress q-animate--fade' }, [
          h('td', { attrs: {colspan: '100%'} }, [
            h(QLinearProgress, {
              props: {
                color: this.color,
                indeterminate: true
              },
              style: { height: '2px' }
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

      if (header !== void 0) {
        return header(this.addTableHeaderRowMeta({header: true, cols: this.computedCols, sort: this.sort, colsMap: this.computedColsMap}))
      }

      let mapFn

      if (headerCell !== void 0) {
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
          },
          style: col.style,
          class: col.classes
        }, col.label)
      }
      const child = this.computedCols.map(mapFn)

      if (this.singleSelection === true && this.grid !== true) {
        child.unshift(h('th', { staticClass: 'q-table--col-auto-width' }, [' ']))
      }
      else if (this.multipleSelection === true) {
        child.unshift(h('th', { staticClass: 'q-table--col-auto-width' }, [
          h(QCheckbox, {
            props: {
              color: this.color,
              value: this.someRowsSelected ? null : this.allRowsSelected,
              dark: this.dark,
              dense: this.dense
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
      if (this.multipleSelection === true) {
        Object.defineProperty(data, 'selected', {
          get: () => this.someRowsSelected ? 'some' : this.allRowsSelected,
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
