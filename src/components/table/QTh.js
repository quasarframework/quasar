import QIcon from '../icon/QIcon.js'
import QItem from '../list/QItem'
import QItemSide from '../list/QItemSide'
import QList from '../list/QList'
import QPopover from '../popover/QPopover'
import QFilter from './QFilter'

export default {
  name: 'QTh',
  props: {
    props: Object,
    autoWidth: Boolean
  },
  methods: {
    renderSort (h, col) {
      return h(
        QItem, {
          nativeOn: {
            click: () => {
              this.props.sort(col)
            }
          }
        },
        [h(QItemSide, {
          props: {
            icon: 'sort_by_alpha'
          }
        }), 'Sort']
      )
    },
    renderFilterPopover (h, col) {
      return h(QPopover, {
        props: {
          fit: true,
          keepOnScreen: true
        }
      }, [
        h(
          QList, {
            props: {
              separator: true,
              link: true
            }
          },
          [
            this.renderSort(h, col),
            this.renderFilter(h, col),
            this.props.filter[col.name] ? this.renderFilterCancel(h, col) : null
          ]
        )
      ])
    },
    renderFilter (h, col) {
      return h(
        QItem, {},
        [h(QItemSide, {
          props: {
            icon: 'filter_list'
          }
        }), h(QFilter, {
          key: col.name,
          props: {
            props: {
              col: col,
              cols: this.props.cols,
              sort: this.props.sort,
              filter: this.props.filter,
              colsMap: this.props.colsMap
            }
          },
          on: {
            'filter:change': (col) => {
              this.props.filterQuery(col)
            }
          }
        })]
      )
    },
    renderFilterCancel (h, col) {
      return h(QItem, {
        nativeOn: {
          click: () => {
            col.filter.props.value = col.filter.defaultValue
            this.props.filterQuery(col)
          }
        }
      },
      [h(QItemSide, {
        props: {
          icon: 'close'
        }
      }), 'Cancel filter']
      )
    }
  },
  render (h) {
    if (!this.props) {
      return h('td', {
        'class': {
          'q-table-col-auto-width': this.autoWidth
        }
      }, this.$slots.default)
    }

    let col
    const
      name = this.$vnode.key,
      child = [].concat(this.$slots.default)

    if (name) {
      col = this.props.colsMap[name]
      if (!col) {
        return
      }
    }
    else {
      col = this.props.col
    }

    const action = col.align === 'right'
      ? 'unshift'
      : 'push'

    if (col.sortable) {
      child[action](
        h(QIcon, {
          props: {
            name: this.$q.icon.table.arrowUp
          },
          staticClass: col.__iconClass
        })
      )
    }

    let popoverContent = []
    if (col.filter) {
      if (col.sortable) {
        popoverContent.push(this.renderSort(h, col))
      }
      child[action](
        h(QIcon, {
          props: {
            name: 'filter_list'
          },
          staticClass: col.__filterIconClass
        })
      )
      child.push(this.renderFilterPopover(h, col))
    }

    return h('th', {
      'class': [col.__thClass, {
        'q-table-col-auto-width': this.autoWidth
      }],
      on: col.sortable && !col.filter ? {
        click: () => {
          this.props.sort(col)
        }
      } : null
    }, child)
  }
}
