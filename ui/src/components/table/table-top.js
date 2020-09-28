import { h } from 'vue'

export default {
  computed: {
    marginalsScope () {
      return {
        pagination: this.computedPagination,
        pagesNumber: this.pagesNumber,
        isFirstPage: this.isFirstPage,
        isLastPage: this.isLastPage,
        firstPage: this.firstPage,
        prevPage: this.prevPage,
        nextPage: this.nextPage,
        lastPage: this.lastPage,

        inFullscreen: this.inFullscreen,
        toggleFullscreen: this.toggleFullscreen
      }
    }
  },

  methods: {
    __getTopDiv () {
      const
        top = this.$slots.top,
        topLeft = this.$slots['top-left'],
        topRight = this.$slots['top-right'],
        topSelection = this.$slots['top-selection'],
        hasSelection = this.hasSelectionMode === true &&
          topSelection !== void 0 &&
          this.rowsSelectedNumber > 0,
        topClass = 'q-table__top relative-position row items-center'

      if (top !== void 0) {
        return h('div', { class: topClass }, [ top(this.marginalsScope) ])
      }

      let child

      if (hasSelection === true) {
        child = topSelection(this.marginalsScope).slice()
      }
      else {
        child = []

        if (topLeft !== void 0) {
          child.push(
            h('div', { class: 'q-table-control' }, [
              topLeft(this.marginalsScope)
            ])
          )
        }
        else if (this.title) {
          child.push(
            h('div', { class: 'q-table__control' }, [
              h('div', {
                class: [ 'q-table__title', this.titleClass ]
              }, this.title)
            ])
          )
        }
      }

      if (topRight !== void 0) {
        child.push(
          h('div', { class: 'q-table__separator col' })
        )
        child.push(
          h('div', { class: 'q-table__control' }, [
            topRight(this.marginalsScope)
          ])
        )
      }

      if (child.length === 0) {
        return
      }

      return h('div', { class: topClass }, child)
    }
  }
}
