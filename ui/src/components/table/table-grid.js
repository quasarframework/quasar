import { h } from 'vue'

import QCheckbox from '../checkbox/QCheckbox.js'
import QSeparator from '../separator/QSeparator.js'

export default {
  methods: {
    __getGridHeader () {
      const child = this.gridHeader === true
        ? [
          h('table', { class: 'q-table' }, [
            this.__getTHead(h)
          ])
        ]
        : (
          this.loading === true && this.$slots.loading === void 0
            ? this.__getProgress(h)
            : void 0
        )

      return h('div', { class: 'q-table__middle' }, child)
    },

    __getGridBody () {
      const item = this.$slots.item !== void 0
        ? this.$slots.item
        : scope => {
          const child = scope.cols.map(
            col => h('div', { class: 'q-table__grid-item-row' }, [
              h('div', { class: 'q-table__grid-item-title' }, [ col.label ]),
              h('div', { class: 'q-table__grid-item-value' }, [ col.value ])
            ])
          )

          if (this.hasSelectionMode === true) {
            const slot = this.$slots['body-selection']
            const content = slot !== void 0
              ? slot(scope)
              : [
                h(QCheckbox, {
                  modelValue: scope.selected,
                  color: this.color,
                  dark: this.isDark,
                  dense: this.dense,
                  'onUpdate:modelValue': (adding, evt) => {
                    this.__updateSelection([ scope.key ], [ scope.row ], adding, evt)
                  }
                })
              ]

            child.unshift(
              h('div', { class: 'q-table__grid-item-row' }, content),
              h(QSeparator, { dark: this.isDark })
            )
          }

          const data = {
            class: [
              'q-table__grid-item-card' + this.cardDefaultClass,
              this.cardClass
            ],
            style: this.cardStyle
          }

          if (this.$attrs['onRow-click'] !== void 0 || this.$attrs['onRow-dblclick'] !== void 0) {
            data.class[0] += ' cursor-pointer'
          }

          if (this.$attrs['onRow-click'] !== void 0) {
            data.onClick = evt => {
              this.$emit('row-click', evt, scope.row, scope.pageIndex)
            }
          }

          if (this.$attrs['onRow-dblclick'] !== void 0) {
            data.onDblclick = evt => {
              this.$emit('row-dblclick', evt, scope.row, scope.pageIndex)
            }
          }

          return h('div', {
            class: 'q-table__grid-item col-xs-12 col-sm-6 col-md-4 col-lg-3' +
              (scope.selected === true ? 'q-table__grid-item--selected' : '')
          }, [
            h('div', data, child)
          ])
        }

      return h('div', {
        class: [
          'q-table__grid-content row',
          this.cardContainerClass
        ],
        style: this.cardContainerStyle
      }, this.computedRows.map((row, pageIndex) => {
        return item(this.__getBodyScope({
          key: this.getRowKey(row),
          row,
          pageIndex
        }))
      }))
    }
  }
}
