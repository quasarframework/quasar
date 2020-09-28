import { h } from 'vue'

import QCheckbox from '../checkbox/QCheckbox.js'
import QTh from './QTh.js'

export default {
  computed: {
    headerSelectedValue () {
      return this.someRowsSelected === true
        ? null
        : this.allRowsSelected
    }
  },

  methods: {
    __getTHead () {
      const child = this.__getTHeadTR()

      if (this.loading === true && this.$slots.loading === void 0) {
        child.push(
          h('tr', { class: 'q-table__progress' }, [
            h('th', {
              class: 'relative-position',
              colspan: this.computedColspan
            }, this.__getProgress())
          ])
        )
      }

      return h('thead', child)
    },

    __getTHeadTR () {
      const
        header = this.$slots.header,
        headerCell = this.$slots['header-cell']

      if (header !== void 0) {
        return header(
          this.__getHeaderScope({ header: true })
        ).slice()
      }

      const child = this.computedCols.map(col => {
        const
          headerCellCol = this.$slots[`header-cell-${col.name}`],
          slot = headerCellCol !== void 0 ? headerCellCol : headerCell,
          props = this.__getHeaderScope({ col })

        return slot !== void 0
          ? slot(props)
          : h(QTh, {
            key: col.name,
            props,
            style: col.headerStyle,
            class: col.headerClasses
          }, () => col.label)
      })

      if (this.singleSelection === true && this.grid !== true) {
        child.unshift(
          h('th', { class: 'q-table--col-auto-width' }, ' ')
        )
      }
      else if (this.multipleSelection === true) {
        const slot = this.$slots['header-selection']
        const content = slot !== void 0
          ? slot(this.__getHeaderScope({}))
          : [
            h(QCheckbox, {
              color: this.color,
              modelValue: this.headerSelectedValue,
              dark: this.isDark,
              dense: this.dense,
              'onUpdate:modelValue': this.__onMultipleSelectionSet
            })
          ]

        child.unshift(
          h('th', { class: 'q-table--col-auto-width' }, content)
        )
      }

      return [
        h('tr', {
          class: this.tableHeaderClass,
          style: this.tableHeaderStyle
        }, child)
      ]
    },

    __getHeaderScope (data) {
      Object.assign(data, {
        cols: this.computedCols,
        sort: this.sort,
        colsMap: this.computedColsMap,
        color: this.color,
        dark: this.isDark,
        dense: this.dense
      })

      if (this.multipleSelection === true) {
        Object.defineProperty(data, 'selected', {
          get: () => this.headerSelectedValue,
          set: this.__onMultipleSelectionSet,
          configurable: true,
          enumerable: true
        })
      }

      return data
    },

    __onMultipleSelectionSet (val) {
      if (this.someRowsSelected === true) {
        val = false
      }
      this.__updateSelection(
        this.computedRows.map(this.getRowKey),
        this.computedRows,
        val
      )
    }
  }
}
