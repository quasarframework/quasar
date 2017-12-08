import { QIcon } from '../icon'

export default {
  name: 'q-th',
  functional: true,
  props: {
    props: Object,
    autoWidth: Boolean
  },
  render (h, ctx) {
    const
      data = ctx.data,
      prop = ctx.props.props,
      name = ctx.data.key,
      child = ctx.children,
      autoWidth = ctx.props.autoWidth
    let
      col,
      cls = data.staticClass

    if (autoWidth) {
      cls = `q-table-col-auto-width${cls ? ` ${cls}` : ''}`
    }

    if (!prop) {
      data.staticClass = cls
      return h('th', data, ctx.children)
    }

    if (name) {
      col = prop.colsMap[name]
      if (!col) { return }
    }
    else {
      col = prop.col
    }

    data.staticClass = `${col.__thClass}${cls ? ` ${cls}` : ''}`

    if (col.sortable) {
      data.on = data.on || {}
      data.on.click = () => {
        prop.sort(col)
      }

      const action = col.align === 'right'
        ? 'unshift'
        : 'push'

      child[action](
        h(QIcon, {
          props: { name: ctx.parent.$q.icon.table.arrowUp },
          staticClass: col.__iconClass
        })
      )
    }

    return h('th', data, ctx.children)
  }
}
