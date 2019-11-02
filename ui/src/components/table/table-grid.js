import QLinearProgress from '../linear-progress/QLinearProgress.js'
import QCheckbox from '../checkbox/QCheckbox.js'
import QSeparator from '../separator/QSeparator.js'

export default {
  methods: {
    getGridBody (h) {
      const item = this.$scopedSlots.item !== void 0
        ? this.$scopedSlots.item
        : scope => {
          const child = scope.cols.map(
            col => h('div', { staticClass: 'q-table__grid-item-row' }, [
              h('div', { staticClass: 'q-table__grid-item-title' }, [ col.label ]),
              h('div', { staticClass: 'q-table__grid-item-value' }, [ col.value ])
            ])
          )

          this.hasSelectionMode === true && child.unshift(
            h('div', { staticClass: 'q-table__grid-item-row' }, [
              h(QCheckbox, {
                props: {
                  value: scope.selected,
                  color: this.color,
                  dark: this.isDark,
                  dense: true
                },
                on: {
                  input: val => {
                    scope.selected = val
                  }
                }
              })
            ]),

            h(QSeparator, { props: { dark: this.isDark } })
          )

          const data = {
            staticClass: 'q-table__grid-item-card' + this.cardDefaultClass,
            class: this.cardClass,
            style: this.cardStyle
          }

          if (this.$listeners['row-click'] !== void 0) {
            data.on = {
              click: evt => {
                this.$emit('row-click', evt, scope.row)
              }
            }
          }

          return h('div', {
            staticClass: 'q-table__grid-item col-xs-12 col-sm-6 col-md-4 col-lg-3',
            class: scope.selected === true ? 'q-table__grid-item--selected' : ''
          }, [
            h('div', data, child)
          ])
        }

      return h('div', { staticClass: 'row' }, this.computedRows.map(row => {
        const
          key = this.getRowKey(row),
          selected = this.isRowSelected(key)

        return item(this.addBodyRowMeta({
          key,
          row,
          cols: this.computedCols,
          colsMap: this.computedColsMap,
          __trClass: selected ? 'selected' : ''
        }))
      }))
    },

    getGridHeader (h) {
      return h('div', { staticClass: 'q-table__middle' }, [
        this.gridHeader === true
          ? h('table', { staticClass: 'q-table' }, [
            this.getTableHeader(h)
          ])
          : (this.loading === true
            ? h(QLinearProgress, {
              staticClass: 'q-table__linear-progress',
              props: {
                color: this.color,
                dark: this.isDark,
                indeterminate: true
              }
            })
            : null
          )
      ])
    }
  }
}
