import { QProgress } from '../progress'
import { QCheckbox } from '../checkbox'
import { QIcon } from '../icon'

export default {
  methods: {
    getTableHeader (h) {
      if (this.noHeader) {
        return
      }

      const child = [ this.getTableHeaderRow(h) ]

      if (this.loader) {
        child.push(h('tr', { staticClass: 'q-datatable-progress animate-fade' }, [
          h('td', { attrs: {colspan: '100%'} }, [
            h(QProgress, {
              props: {
                color: this.color,
                indeterminate: true
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
        return header(this.addTableHeaderRowMeta({cols: this.computedColumns, sort: this.sort}))
      }

      let mapFn

      if (headerCell) {
        mapFn = col => headerCell({col, cols: this.computedColumns, sort: this.sort})
      }
      else {
        mapFn = col => h('th',
          {
            staticClass: col.__thClass,
            on: {click: () => { if (col.sortable) { this.sort(col) } }}
          }, [
            col.label,
            h(QIcon, {
              props: { name: 'arrow_upward' },
              staticClass: col.__iconClass
            })
          ]
        )
      }
      const child = this.computedColumns.map(mapFn)

      if (this.singleSelection) {
        child.unshift(h('th', [' ']))
      }
      else if (this.multipleSelection) {
        child.unshift(h('th', [
          h(QCheckbox, {
            props: {
              color: this.color,
              value: this.allRowsSelected,
              indeterminate: this.someRowsSelected
            },
            on: {
              input: val => {
                if (this.someRowsSelected) {
                  val = false
                }
                this.computedRows.forEach(row => {
                  this.$set(this.multipleSelected, row[this.rowKey], val)
                })
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
            this.computedRows.forEach(row => {
              this.$set(this.multipleSelected, row[this.rowKey], val)
            })
          }
        })
        data.partialSelected = this.someRowsSelected
        data.multipleSelect = true
      }

      return data
    }
  }
}
