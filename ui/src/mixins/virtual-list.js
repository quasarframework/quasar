import debounce from '../utils/debounce.js'
import frameDebounce from '../utils/frame-debounce.js'

const aggBucketSize = 1000

function getScrollDetails (parent, child, horizontal) {
  const
    parentCalc = parent === window ? document.scrollingElement || document.documentElement : parent,
    details = {
      scrollStart: 0,
      scrollViewSize: 0,
      scrollMaxSize: 0
    }

  if (horizontal === true) {
    if (parent === window) {
      details.scrollStart = window.pageXOffset || window.scrollX || document.body.scrollLeft || 0
      details.scrollViewSize = window.innerWidth
    }
    else {
      details.scrollStart = parentCalc.scrollLeft
      details.scrollViewSize = parentCalc.clientWidth
    }
    details.scrollMaxSize = parentCalc.scrollWidth
  }
  else {
    if (parent === window) {
      details.scrollStart = window.pageYOffset || window.scrollY || document.body.scrollTop || 0
      details.scrollViewSize = window.innerHeight
    }
    else {
      details.scrollStart = parentCalc.scrollTop
      details.scrollViewSize = parentCalc.clientHeight
    }
    details.scrollMaxSize = parentCalc.scrollHeight
  }

  if (child === parent || child === void 0 || child === null || child.nodeType === 8) {
    details.offsetStart = 0
    details.offsetEnd = 0
  }
  else {
    const
      parentRect = parentCalc.getBoundingClientRect(),
      childRect = child.getBoundingClientRect()

    if (horizontal === true) {
      details.offsetStart = childRect.left - parentRect.left
      details.offsetEnd = -childRect.width
    }
    else {
      details.offsetStart = childRect.top - parentRect.top
      details.offsetEnd = -childRect.height
    }

    if (parent !== window) {
      details.offsetStart += details.scrollStart
    }
    details.offsetEnd += details.scrollMaxSize - details.offsetStart
  }

  return details
}

function setScroll (parent, scroll, horizontal) {
  if (parent === window) {
    if (horizontal === true) {
      window.scrollTo(scroll, window.pageYOffset || window.scrollY || document.body.scrollTop || 0)
    }
    else {
      window.scrollTo(window.pageXOffset || window.scrollX || document.body.scrollLeft || 0, scroll)
    }
  }
  else {
    parent[horizontal === true ? 'scrollLeft' : 'scrollTop'] = scroll
  }
}

function sumSize (sizeAgg, size, from, to) {
  if (from >= to) { return 0 }

  const
    fromAgg = Math.floor(from / aggBucketSize),
    toAgg = Math.floor((to - 1) / aggBucketSize)

  if (fromAgg === toAgg) {
    if (from % aggBucketSize === 0 && to % aggBucketSize === 0) {
      return sizeAgg[fromAgg]
    }

    return size.slice(from, to).reduce((acc, h) => acc + h, 0)
  }

  const
    before = from % aggBucketSize === 0 ? 0 : size
      .slice(from, (fromAgg + 1) * aggBucketSize)
      .reduce((acc, h) => acc + h, 0),
    after = to % aggBucketSize === 0 ? sizeAgg[toAgg] : size
      .slice(toAgg * aggBucketSize, to)
      .reduce((acc, h) => acc + h, 0),
    total = sizeAgg
      .slice(fromAgg, toAgg)
      .reduce((acc, h) => acc + h, before + after)

  return total
}

export default {
  props: {
    virtualListHorizontal: Boolean,

    virtualListSliceSize: {
      type: Number,
      default: 30
    },

    virtualListItemDefaultSize: {
      type: Number,
      default: 24
    }
  },

  data () {
    return {
      virtualListSliceRange: { from: 0, to: 0 }
    }
  },

  watch: {
    virtualListHorizontal () {
      this.__setVirtualListSize()
    }
  },

  methods: {
    scrollTo (toIndex, scrollTowardsEnd) {
      const scrollEl = this.__getVirtualListScrollTarget()

      if (scrollEl === void 0 || scrollEl === null || scrollEl.nodeType === 8) {
        return
      }

      clearTimeout(this.__preventNextScroll)
      this.__preventNextScroll = setTimeout(() => {
        this.__preventNextScroll = void 0
      }, 500)

      this.__setVirtualListSliceRange(
        scrollEl,
        getScrollDetails(scrollEl, this.__getVirtualListEl(), this.virtualListHorizontal),
        Math.min(this.virtualListLength - 1, Math.max(0, parseInt(toIndex, 10) || 0)),
        scrollTowardsEnd === true ? 'end' : 'start'
      )
    },

    __onVirtualListScroll () {
      const scrollEl = this.__getVirtualListScrollTarget()

      if (this.__preventNextScroll !== void 0 || scrollEl === void 0 || scrollEl === null || scrollEl.nodeType === 8) {
        clearTimeout(this.__preventNextScroll)
        this.__preventNextScroll = void 0

        return
      }

      const scrollDetails = getScrollDetails(scrollEl, this.__getVirtualListEl(), this.virtualListHorizontal)

      if (scrollDetails.scrollStart <= scrollDetails.offsetStart) {
        this.__setVirtualListSliceRange(scrollEl, scrollDetails, 0)
      }
      else if (scrollDetails.scrollStart >= scrollDetails.scrollMaxSize - scrollDetails.scrollViewSize - scrollDetails.offsetEnd) {
        this.__setVirtualListSliceRange(scrollEl, scrollDetails, this.virtualListLength - 1)
      }
      else {
        const listLastIndex = this.virtualListLength - 1

        let
          toIndex = -1,
          listOffset = Math.max(0, scrollDetails.scrollStart - scrollDetails.offsetStart + Math.floor(scrollDetails.scrollViewSize / 2))

        for (let j = 0; listOffset >= this.virtualListSizesAgg[j] && toIndex < listLastIndex; j++) {
          listOffset -= this.virtualListSizesAgg[j]
          toIndex += aggBucketSize
        }

        while (listOffset >= 0 && toIndex < listLastIndex) {
          toIndex++
          listOffset -= this.virtualListSizes[toIndex]
        }

        toIndex !== this.prevToIndex && this.__setVirtualListSliceRange(scrollEl, scrollDetails, toIndex, void 0, this.virtualListSizes[toIndex] + listOffset)
      }
    },

    __setVirtualListSliceRange (scrollEl, scrollDetails, toIndex, align, indexScrollOffset = 0) {
      let
        from = Math.max(0, Math.floor(toIndex - this.virtualListSliceSizeComputed / 2)),
        to = from + this.virtualListSliceSizeComputed

      if (to > this.virtualListLength) {
        to = this.virtualListLength
        from = Math.max(0, to - this.virtualListSliceSizeComputed)
      }

      const rangeChanged = from !== this.virtualListSliceRange.from || to !== this.virtualListSliceRange.to

      if (rangeChanged === false && align === void 0) {
        return
      }

      if (rangeChanged === true) {
        this.virtualListSliceRange = { from, to }
        this.virtualListPaddingBefore = sumSize(this.virtualListSizesAgg, this.virtualListSizes, 0, from)
        this.virtualListPaddingAfter = sumSize(this.virtualListSizesAgg, this.virtualListSizes, to, this.virtualListLength)
      }

      this.$nextTick(() => {
        if (rangeChanged === true) {
          const contentEl = this.$refs.content

          if (contentEl !== void 0) {
            const children = contentEl.children

            for (let i = children.length - 1; i >= 0; i--) {
              const
                index = from + i,
                diff = children[i][this.virtualListHorizontal === true ? 'offsetWidth' : 'offsetHeight'] - this.virtualListSizes[index]

              if (diff !== 0) {
                this.virtualListSizes[index] += diff
                this.virtualListSizesAgg[Math.floor(index / aggBucketSize)] += diff
              }
            }
          }
        }

        const
          posStart = this.virtualListSizes.slice(from, toIndex).reduce((acc, h) => acc + h, scrollDetails.offsetStart + this.virtualListPaddingBefore),
          posEnd = posStart + this.virtualListSizes[toIndex],
          keepScroll = scrollDetails.scrollStart < posStart && posEnd < scrollDetails.scrollStart + scrollDetails.scrollViewSize

        if (align !== void 0) {
          setScroll(
            scrollEl,
            keepScroll === true ? scrollDetails.scrollStart : (align === 'end' ? posEnd - scrollDetails.scrollViewSize : posStart),
            this.virtualListHorizontal
          )
        }
        else if (rangeChanged === true && this.virtualListScrollSafari !== true) {
          setScroll(
            scrollEl,
            posStart + indexScrollOffset - Math.floor(scrollDetails.scrollViewSize / 2),
            this.virtualListHorizontal
          )
        }

        this.__emitScroll(toIndex)
      })
    },

    __resetVirtualList (toIndex) {
      const defaultSize = this.virtualListItemDefaultSize

      if (Array.isArray(this.virtualListSizes) === false) {
        this.virtualListSizes = []
      }

      const oldVirtualListSizesLength = this.virtualListSizes.length

      this.virtualListSizes.length = this.virtualListLength

      for (let i = this.virtualListLength - 1; i >= oldVirtualListSizesLength; i--) {
        this.virtualListSizes[i] = defaultSize
      }

      const jMax = Math.floor((this.virtualListLength - 1) / aggBucketSize)
      this.virtualListSizesAgg = []
      for (let j = 0; j <= jMax; j++) {
        let size = 0
        const iMax = Math.min((j + 1) * aggBucketSize, this.virtualListLength)
        for (let i = j * aggBucketSize; i < iMax; i++) {
          size += this.virtualListSizes[i]
        }
        this.virtualListSizesAgg.push(size)
      }

      this.virtualListPaddingBefore = sumSize(this.virtualListSizesAgg, this.virtualListSizes, 0, this.virtualListSliceRange.from)
      this.virtualListPaddingAfter = sumSize(this.virtualListSizesAgg, this.virtualListSizes, this.virtualListSliceRange.to, this.virtualListLength)

      this.__onVirtualListScroll()

      if (toIndex >= 0) {
        this.$nextTick(() => {
          this.scrollTo(toIndex)
        })
      }
    },

    __setVirtualListSize () {
      if (this.virtualListHorizontal === true) {
        this.virtualListSliceSizeComputed = typeof window === 'undefined'
          ? this.virtualListSliceSize
          : Math.max(this.virtualListSliceSize, Math.ceil(window.innerWidth / this.virtualListItemDefaultSize * 1.5))
      }
      else {
        this.virtualListSliceSizeComputed = typeof window === 'undefined'
          ? this.virtualListSliceSize
          : Math.max(this.virtualListSliceSize, Math.ceil(window.innerHeight / this.virtualListItemDefaultSize * 1.5))
      }

      this.prevToIndex = -1
    },

    __padVirtualList (h, content) {
      const
        list = [],
        paddingSize = this.virtualListHorizontal === true ? 'width' : 'height'

      list.push(h('div', {
        staticClass: 'q-virtual-list__padding',
        style: { [paddingSize]: `${this.virtualListPaddingBefore}px` }
      }))

      list.push(h('div', {
        staticClass: 'q-virtual-list__content',
        ref: 'content'
      }, content))

      list.push(h('div', {
        staticClass: 'q-virtual-list__padding',
        style: { [paddingSize]: `${this.virtualListPaddingAfter}px` }
      }))

      return list
    },

    __emitScroll (index) {
      if (this.prevToIndex !== index) {
        this.$listeners['virtual-scroll'] !== void 0 && this.$emit('virtual-scroll', {
          index,
          from: this.virtualListSliceRange.from,
          to: this.virtualListSliceRange.to - 1,
          direction: index < this.prevToIndex ? 'decrease' : 'increase'
        })

        this.prevToIndex = index
      }
    }
  },

  created () {
    this.__setVirtualListSize()
  },

  beforeMount () {
    this.virtualListScrollSafari = this.$q.platform.is.ios === true || this.$q.platform.is.safari === true

    this.__onVirtualListScroll = this.virtualListScrollSafari === true
      ? frameDebounce(this.__onVirtualListScroll)
      : debounce(this.__onVirtualListScroll, 40)

    this.__setVirtualListSize()
  },

  beforeDestroy () {
    clearTimeout(this.__preventNextScroll)
  }
}
