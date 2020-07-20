import debounce from '../utils/debounce.js'
import frameDebounce from '../utils/frame-debounce.js'

const aggBucketSize = 1000

const slice = Array.prototype.slice

function sumFn (acc, h) {
  return acc + h
}

function getScrollDetails (
  parent,
  child,
  beforeRef,
  afterRef,
  horizontal,
  stickyStart,
  stickyEnd
) {
  const
    parentCalc = parent === window ? document.scrollingElement || document.documentElement : parent,
    propElSize = horizontal === true ? 'offsetWidth' : 'offsetHeight',
    details = {
      scrollStart: 0,
      scrollViewSize: -stickyStart - stickyEnd,
      scrollMaxSize: 0,
      offsetStart: -stickyStart,
      offsetEnd: -stickyEnd
    }

  if (horizontal === true) {
    if (parent === window) {
      details.scrollStart = window.pageXOffset || window.scrollX || document.body.scrollLeft || 0
      details.scrollViewSize += window.innerWidth
    }
    else {
      details.scrollStart = parentCalc.scrollLeft
      details.scrollViewSize += parentCalc.clientWidth
    }
    details.scrollMaxSize = parentCalc.scrollWidth
  }
  else {
    if (parent === window) {
      details.scrollStart = window.pageYOffset || window.scrollY || document.body.scrollTop || 0
      details.scrollViewSize += window.innerHeight
    }
    else {
      details.scrollStart = parentCalc.scrollTop
      details.scrollViewSize += parentCalc.clientHeight
    }
    details.scrollMaxSize = parentCalc.scrollHeight
  }

  if (beforeRef !== void 0) {
    for (let el = beforeRef.previousElementSibling; el !== null; el = el.previousElementSibling) {
      if (el.classList.contains('q-virtual-scroll--skip') === false) {
        details.offsetStart += el[propElSize]
      }
    }
  }
  if (afterRef !== void 0) {
    for (let el = afterRef.nextElementSibling; el !== null; el = el.nextElementSibling) {
      if (el.classList.contains('q-virtual-scroll--skip') === false) {
        details.offsetEnd += el[propElSize]
      }
    }
  }

  if (child !== parent) {
    const
      parentRect = parentCalc.getBoundingClientRect(),
      childRect = child.getBoundingClientRect()

    if (horizontal === true) {
      details.offsetStart += childRect.left - parentRect.left
      details.offsetEnd -= childRect.width
    }
    else {
      details.offsetStart += childRect.top - parentRect.top
      details.offsetEnd -= childRect.height
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
    lastTo = size.length,
    fromAgg = Math.floor(from / aggBucketSize),
    toAgg = Math.floor((to - 1) / aggBucketSize) + 1

  let total = sizeAgg.slice(fromAgg, toAgg).reduce(sumFn, 0)

  if (from % aggBucketSize !== 0) {
    total -= size.slice(fromAgg * aggBucketSize, from).reduce(sumFn, 0)
  }
  if (to % aggBucketSize !== 0 && to !== lastTo) {
    total -= size.slice(to, toAgg * aggBucketSize).reduce(sumFn, 0)
  }

  return total
}

const commonVirtScrollProps = {
  virtualScrollSliceSize: {
    type: Number,
    default: 30
  },

  virtualScrollItemSize: {
    type: Number,
    default: 24
  },

  virtualScrollStickySizeStart: {
    type: Number,
    default: 0
  },

  virtualScrollStickySizeEnd: {
    type: Number,
    default: 0
  }
}

export const commonVirtPropsList = Object.keys(commonVirtScrollProps)

export default {
  props: {
    virtualScrollHorizontal: Boolean,
    ...commonVirtScrollProps
  },

  data () {
    return {
      virtualScrollSliceRange: { from: 0, to: 0 }
    }
  },

  watch: {
    virtualScrollHorizontal () {
      this.__setVirtualScrollSize()
    },

    needsReset () {
      this.reset()
    }
  },

  computed: {
    needsReset () {
      return ['virtualScrollItemSize', 'virtualScrollHorizontal']
        .map(p => this[p]).join(';')
    }
  },

  methods: {
    reset () {
      this.__resetVirtualScroll(this.prevToIndex, true)
    },

    refresh (toIndex) {
      this.__resetVirtualScroll(toIndex === void 0 ? this.prevToIndex : toIndex)
    },

    scrollTo (toIndex) {
      const scrollEl = this.__getVirtualScrollTarget()

      if (scrollEl === void 0 || scrollEl === null || scrollEl.nodeType === 8) {
        return
      }

      this.__setVirtualScrollSliceRange(
        scrollEl,
        getScrollDetails(
          scrollEl,
          this.__getVirtualScrollEl(),
          this.$refs.before,
          this.$refs.after,
          this.virtualScrollHorizontal,
          this.virtualScrollStickySizeStart,
          this.virtualScrollStickySizeEnd
        ),
        Math.min(this.virtualScrollLength - 1, Math.max(0, parseInt(toIndex, 10) || 0)),
        0,
        this.prevToIndex > -1 && toIndex > this.prevToIndex ? 'end' : 'start'
      )
    },

    __onVirtualScrollEvt () {
      const scrollEl = this.__getVirtualScrollTarget()

      if (scrollEl === void 0 || scrollEl === null || scrollEl.nodeType === 8) {
        return
      }

      const
        scrollDetails = getScrollDetails(
          scrollEl,
          this.__getVirtualScrollEl(),
          this.$refs.before,
          this.$refs.after,
          this.virtualScrollHorizontal,
          this.virtualScrollStickySizeStart,
          this.virtualScrollStickySizeEnd
        ),
        scrollMaxStart = scrollDetails.scrollMaxSize - Math.max(scrollDetails.scrollViewSize, scrollDetails.offsetEnd) - this.virtualScrollSizes[this.virtualScrollLength - 1],
        listLastIndex = this.virtualScrollLength - 1

      if (this.prevScrollStart === scrollDetails.scrollStart) {
        return
      }
      this.prevScrollStart = void 0

      this.__updateVirtualScrollSizes(this.virtualScrollSliceRange.from)

      if (scrollMaxStart > 0 && scrollDetails.scrollStart >= scrollMaxStart) {
        this.__setVirtualScrollSliceRange(
          scrollEl,
          scrollDetails,
          this.virtualScrollLength - 1,
          scrollDetails.scrollMaxSize - scrollDetails.offsetEnd - this.virtualScrollSizesAgg.reduce(sumFn, 0)
        )

        return
      }

      let
        toIndex = 0,
        listOffset = scrollDetails.scrollStart - scrollDetails.offsetStart,
        offset = listOffset

      for (let j = 0; listOffset >= this.virtualScrollSizesAgg[j] && toIndex < listLastIndex; j++) {
        listOffset -= this.virtualScrollSizesAgg[j]
        toIndex += aggBucketSize
      }

      while (listOffset > 0 && toIndex < listLastIndex) {
        listOffset -= this.virtualScrollSizes[toIndex]
        if (listOffset > -scrollDetails.scrollViewSize) {
          toIndex++
          offset = listOffset
        }
        else {
          offset = this.virtualScrollSizes[toIndex] + listOffset
        }
      }

      this.__setVirtualScrollSliceRange(
        scrollEl,
        scrollDetails,
        toIndex,
        offset
      )
    },

    __setVirtualScrollSliceRange (scrollEl, scrollDetails, toIndex, offset, align) {
      let
        from = Math.max(0, Math.ceil(toIndex - (align === void 0 ? 3 : 2) * this.virtualScrollSliceSizeComputed / 6)),
        to = from + this.virtualScrollSliceSizeComputed

      if (to > this.virtualScrollLength) {
        to = this.virtualScrollLength
        from = Math.max(0, to - this.virtualScrollSliceSizeComputed)
      }

      const rangeChanged = from !== this.virtualScrollSliceRange.from || to !== this.virtualScrollSliceRange.to

      if (rangeChanged === false && align === void 0) {
        this.__emitScroll(toIndex)

        return
      }

      if (rangeChanged === true) {
        this.virtualScrollSliceRange = { from, to }
        this.virtualScrollPaddingBefore = sumSize(this.virtualScrollSizesAgg, this.virtualScrollSizes, 0, from)
        this.virtualScrollPaddingAfter = sumSize(this.virtualScrollSizesAgg, this.virtualScrollSizes, to, this.virtualScrollLength)
      }

      this.$nextTick(() => {
        if (rangeChanged === true) {
          this.__updateVirtualScrollSizes(from)
        }

        const
          posStart = this.virtualScrollSizes.slice(from, toIndex).reduce(sumFn, scrollDetails.offsetStart + this.virtualScrollPaddingBefore),
          posEnd = posStart + this.virtualScrollSizes[toIndex]

        let scrollPosition = posStart + offset

        if (align !== void 0) {
          scrollPosition = scrollDetails.scrollStart < posStart && posEnd < scrollDetails.scrollStart + scrollDetails.scrollViewSize
            ? scrollDetails.scrollStart
            : (align === 'end' ? posEnd - scrollDetails.scrollViewSize : posStart)
        }

        this.prevScrollStart = scrollPosition

        this.__setScroll(
          scrollEl,
          scrollPosition,
          this.virtualScrollHorizontal
        )

        this.__emitScroll(toIndex)
      })
    },

    __updateVirtualScrollSizes (from) {
      const contentEl = this.$refs.content

      if (contentEl !== void 0) {
        const
          children = slice.call(contentEl.children).filter(el => el.classList.contains('q-virtual-scroll--skip') === false),
          childrenLength = children.length,
          sizeProp = this.virtualScrollHorizontal === true ? 'offsetWidth' : 'offsetHeight'

        let
          index = from,
          size, diff

        for (let i = 0; i < childrenLength;) {
          size = children[i][sizeProp]
          i++

          while (i < childrenLength && children[i].classList.contains('q-virtual-scroll--with-prev') === true) {
            size += children[i][sizeProp]
            i++
          }

          diff = size - this.virtualScrollSizes[index]

          if (diff !== 0) {
            this.virtualScrollSizes[index] += diff
            this.virtualScrollSizesAgg[Math.floor(index / aggBucketSize)] += diff
          }

          index++
        }
      }
    },

    __resetVirtualScroll (toIndex, fullReset) {
      const defaultSize = this.virtualScrollItemSize

      if (fullReset === true || Array.isArray(this.virtualScrollSizes) === false) {
        this.virtualScrollSizes = []
      }

      const oldVirtualScrollSizesLength = this.virtualScrollSizes.length

      this.virtualScrollSizes.length = this.virtualScrollLength

      for (let i = this.virtualScrollLength - 1; i >= oldVirtualScrollSizesLength; i--) {
        this.virtualScrollSizes[i] = defaultSize
      }

      const jMax = Math.floor((this.virtualScrollLength - 1) / aggBucketSize)
      this.virtualScrollSizesAgg = []
      for (let j = 0; j <= jMax; j++) {
        let size = 0
        const iMax = Math.min((j + 1) * aggBucketSize, this.virtualScrollLength)
        for (let i = j * aggBucketSize; i < iMax; i++) {
          size += this.virtualScrollSizes[i]
        }
        this.virtualScrollSizesAgg.push(size)
      }

      this.prevToIndex = -1
      this.prevScrollStart = void 0

      if (toIndex >= 0) {
        this.__updateVirtualScrollSizes(this.virtualScrollSliceRange.from)

        this.$nextTick(() => {
          this.scrollTo(toIndex)
        })
      }
      else {
        this.virtualScrollPaddingBefore = sumSize(this.virtualScrollSizesAgg, this.virtualScrollSizes, 0, this.virtualScrollSliceRange.from)
        this.virtualScrollPaddingAfter = sumSize(this.virtualScrollSizesAgg, this.virtualScrollSizes, this.virtualScrollSliceRange.to, this.virtualScrollLength)

        this.__onVirtualScrollEvt()
      }
    },

    __setVirtualScrollSize () {
      if (this.virtualScrollHorizontal === true) {
        this.virtualScrollSliceSizeComputed = typeof window === 'undefined'
          ? this.virtualScrollSliceSize
          : Math.max(this.virtualScrollSliceSize, Math.ceil(window.innerWidth / this.virtualScrollItemSize * 2))
      }
      else {
        this.virtualScrollSliceSizeComputed = typeof window === 'undefined'
          ? this.virtualScrollSliceSize
          : Math.max(this.virtualScrollSliceSize, Math.ceil(window.innerHeight / this.virtualScrollItemSize * 2))
      }
    },

    __padVirtualScroll (h, tag, content) {
      const paddingSize = this.virtualScrollHorizontal === true ? 'width' : 'height'

      return [
        tag === 'tbody'
          ? h(tag, {
            staticClass: 'q-virtual-scroll__padding',
            key: 'before',
            ref: 'before'
          }, [
            h('tr', [
              h('td', {
                style: { [paddingSize]: `${this.virtualScrollPaddingBefore}px` },
                attrs: { colspan: '100%' }
              })
            ])
          ])
          : h(tag, {
            staticClass: 'q-virtual-scroll__padding',
            key: 'before',
            ref: 'before',
            style: { [paddingSize]: `${this.virtualScrollPaddingBefore}px` }
          }),

        h(tag, {
          staticClass: 'q-virtual-scroll__content',
          key: 'content',
          ref: 'content'
        }, content),

        tag === 'tbody'
          ? h(tag, {
            staticClass: 'q-virtual-scroll__padding',
            key: 'after',
            ref: 'after'
          }, [
            h('tr', [
              h('td', {
                style: { [paddingSize]: `${this.virtualScrollPaddingAfter}px` },
                attrs: { colspan: '100%' }
              })
            ])
          ])
          : h(tag, {
            staticClass: 'q-virtual-scroll__padding',
            key: 'after',
            ref: 'after',
            style: { [paddingSize]: `${this.virtualScrollPaddingAfter}px` }
          })
      ]
    },

    __emitScroll (index) {
      if (this.prevToIndex !== index) {
        this.qListeners['virtual-scroll'] !== void 0 && this.$emit('virtual-scroll', {
          index,
          from: this.virtualScrollSliceRange.from,
          to: this.virtualScrollSliceRange.to - 1,
          direction: index < this.prevToIndex ? 'decrease' : 'increase',
          ref: this
        })

        this.prevToIndex = index
      }
    }
  },

  created () {
    this.__setVirtualScrollSize()
  },

  beforeMount () {
    this.__onVirtualScrollEvt = debounce(this.__onVirtualScrollEvt, 70)
    this.__setScroll = frameDebounce(setScroll)
    this.__setVirtualScrollSize()
  }
}
