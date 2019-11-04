import Vue from 'vue'

import QIcon from '../icon/QIcon.js'

import slot from '../../utils/slot.js'

export default Vue.extend({
  name: 'QTh',

  props: {
    props: Object,
    autoWidth: Boolean
  },

  mounted () {
    this.addResizeEvents()
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.resizeTable, false)
    document.querySelector('.q-table').removeEventListener('mousemove', this.startEvent, false)
    this.$el.querySelector('.resizable-elem').removeEventListener('mousedown', this.startDragging, false)
    document.addEventListener('mouseup', this.stopDragging, false)
  },
  methods: {
    startDragging (e) {
      this.$el.classList.add('block-click')
      this.dragStart = true
    },
    stopDragging () {
      this.$el.classList.remove('block-click')
      this.dragStart = false
    },
    addResizeEvents () {
      let tableElem = document.querySelector('.q-table--resizable-columns')
      tableElem.querySelector('table').style.tableLayout = 'fixed'
      tableElem.querySelector('table').style.width = '100%'
      let tableWidth = tableElem.querySelector('table').getBoundingClientRect().width
      let thList = tableElem.querySelectorAll('th')
      tableElem.classList.add('resizable-columns')
      thList.forEach(th => {
        th.style.width = tableWidth / thList.length + 'px'
      })
      window.addEventListener('resize', this.resizeTable, false)
      if (this.$el.querySelector('.resizable-elem')) {
        this.$el.querySelector('.resizable-elem').addEventListener('mousedown', this.startDragging, false)
      }
      document.querySelector('.q-table').addEventListener('mousemove', this.startEvent, false)
      document.addEventListener('mouseup', this.stopDragging, false)
    },
    resizeTable () {
      let tableElem = document.querySelector('.q-table--resizable-columns')
      let tableWidth = document.querySelector('.q-table--resizable-columns').getBoundingClientRect().width
      let thList = tableElem.querySelectorAll('th')
      tableElem.classList.add('resizable-columns')
      thList.forEach((th, index) => {
        th.style.width = tableWidth / thList.length + 'px'
      })
    },
    dragEvent () {
      if (this.dragStart) {
        this.oldMousePosition = this.mousePosition || parseFloat(window.event.clientX)
        this.mousePosition = parseFloat(window.event.clientX)
        let dragLeft = this.mousePosition < this.oldMousePosition
        let dragRight = this.mousePosition > this.oldMousePosition
        let getElemWidth = parseFloat(this.$el.style.width.split('px')[0])
        let minWidth = 100
        let diff = Math.abs(this.oldMousePosition - this.mousePosition)
        let nextSiblingMinWidth = this.$el.nextSibling.getBoundingClientRect().width > minWidth
        let elemMinWidth = this.$el.getBoundingClientRect().width > minWidth
        if (this.mousePosition) {
          nextSiblingMinWidth = this.$el.nextSibling.getBoundingClientRect().width + diff > minWidth
          elemMinWidth = this.$el.getBoundingClientRect().width + diff > minWidth
        }
        if (!this.mousePosition || !diff || diff > 20) {
          dragRight = ''
          dragLeft = ''
        }
        if (dragRight && nextSiblingMinWidth) {
          this.$el.style.width = getElemWidth + diff + 'px'
          dragLeft = ''
        }
        else if (dragLeft && elemMinWidth) {
          this.$el.style.width = getElemWidth - diff + 'px'
          dragRight = ''
        }
        if ((dragRight && nextSiblingMinWidth) || (dragLeft && elemMinWidth)) {
          let getSiblingWidth = parseFloat(this.$el.nextSibling.style.width.split('px')[0])
          if (dragRight) {
            this.$el.nextSibling.style.width = getSiblingWidth - diff + 'px'
          }
          else if (dragLeft) {
            this.$el.nextSibling.style.width = getSiblingWidth + diff + 'px'
          }
        }
      }
    },
    startEvent (event) {
      if (this.$el.querySelector('.resizable-elem')) {
        this.dragEvent()
      }
    }
  },
  render (h) {
    const on = this.$listeners

    if (this.props === void 0) {
      return h('th', {
        on,
        class: this.autoWidth === true ? 'q-table--col-auto-width' : null
      }, slot(this, 'default'))
    }

    let col
    const
      name = this.$vnode.key,
      child = [].concat(slot(this, 'default'))

    if (name) {
      col = this.props.colsMap[name]
      if (col === void 0) { return }
    }
    else {
      col = this.props.col
    }
    const colsLength = this.props.cols.length
    // check if resizableColumns prop exists and if column is not the last
    if (this.props.resizableColumns === true && this.props.col.field !== this.props.cols[colsLength - 1].field) {
      child['unshift'](
        h('div', {
          staticClass: 'resizable-elem'
        })
      )
    }

    if (col.sortable === true) {
      const action = col.align === 'right'
        ? 'unshift'
        : 'push'

      child[action](
        h(QIcon, {
          props: { name: this.$q.iconSet.table.arrowUp },
          staticClass: col.__iconClass
        })
      )
    }

    const evt = col.sortable === true
      ? {
        click: evt => {
          this.props.sort(col)
          this.$emit('click', evt)
        }
      }
      : {}

    return h('th', {
      on: { ...on, ...evt },
      style: col.__thStyle,
      class: col.__thClass +
        (this.autoWidth === true ? ' q-table--col-auto-width' : '')
    }, child)
  }
})
