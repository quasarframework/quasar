import { QCheckbox } from '../checkbox'

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

      console.log('RENDER')

      if (body) {
        child = this.computedRows.map(row => {
          const
            key = row[this.rowKey],
            selected = this.isRowSelected(key)

          return body(this.addTableBodyRowMeta({
            key,
            row,
            cols: this.computedColumns,
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
              ? this.computedColumns.map(col => bodyCell({ row, col: col, value: typeof col.field === 'function' ? col.field(row) : row[col.field] }))
              : this.computedColumns.map(col => {
                const slot = this.$scopedSlots[`body-cell-${col.name}`]
                return slot
                  ? slot({ row, col: col, value: typeof col.field === 'function' ? col.field(row) : row[col.field] })
                  : h('td', { staticClass: col.__tdClass }, typeof col.field === 'function' ? col.field(row) : row[col.field])
              })

          if (this.selection) {
            child.unshift(h('td', { staticClass: 'q-table-select' }, [
              h(QCheckbox, {
                props: {
                  value: this.multipleSelection
                    ? this.multipleSelected[key] === true
                    : this.singleSelected === key,
                  color: this.color
                },
                on: {
                  input: val => {
                    if (this.multipleSelection) {
                      this.$set(this.multipleSelected, key, val)
                    }
                    else {
                      this.singleSelected = val ? key : null
                    }
                  }
                }
              })
            ]))
          }

          return h('tr', { key: key, 'class': { selected } }, child)
        })
      }

      if (topRow) {
        child.unshift(topRow({cols: this.computedColumns}))
      }
      if (bottomRow) {
        child.push(bottomRow({cols: this.computedColumns}))
      }

      return h('tbody', child)
    },
    addTableBodyRowMeta (data) {
      if (this.selection) {
        Object.defineProperty(data, 'selected', {
          get: () => this.isRowSelected(data.key),
          set: val => {
            if (this.multipleSelection) {
              this.$set(this.multipleSelected, data.key, val)
            }
            else {
              this.singleSelected = val ? data.key : null
            }
          }
        })
      }

      Object.defineProperty(data, 'expand', {
        get: () => this.rowsExpanded[data.key] === true,
        set: val => {
          this.$set(this.rowsExpanded, data.key, val)
        }
      })

      data.cols = data.cols.map(col => {
        const c = Object.assign({}, col)
        Object.defineProperty(c, 'value', {
          get: () => typeof col.field === 'function' ? col.field(data.row) : data.row[col.field]
        })
        return c
      })

      return data
    }
  }
}
