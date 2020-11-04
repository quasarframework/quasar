import debounce from '../utils/debounce.js'

const aggBucketSize = 1000

const scrollToEdges = [
  'start',
  'center',
  'end',
  'start-force',
  'center-force',
  'end-force'
]

const slice = Array.prototype.slice

let buggyRTL = void 0

// mobile Chrome takes the crown for this
function detectBuggyRTL () {
  const scroller = document.createElement('div')
  const spacer = document.createElement('div')

  scroller.setAttribute('dir', 'rtl')
  scroller.style.width = '1px'
  scroller.style.height = '1px'
  scroller.style.overflow = 'auto'

  spacer.style.width = '1000px'
  spacer.style.height = '1px'

  document.body.appendChild(scroller)
  scroller.appendChild(spacer)
  scroller.scrollLeft = -1000

  buggyRTL = scroller.scrollLeft >= 0

  scroller.remove()
}

function sumFn (acc, h) {
  return acc + h
}

function getScrollDetails (
  parent,
  child,
  beforeRef,
  afterRef,
  horizontal,
  rtl,
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

    if (rtl === true) {
      details.scrollStart = (buggyRTL === true ? details.scrollMaxSize - details.scrollViewSize : 0) - details.scrollStart
    }
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

function setScroll (parent, scroll, horizontal, rtl) {
  if (parent === window) {
    if (horizontal === true) {
      if (rtl === true) {
        scroll = (buggyRTL === true ? document.body.scrollWidth - window.innerWidth : 0) - scroll
      }
      window.scrollTo(scroll, window.pageYOffset || window.scrollY || document.body.scrollTop || 0)
    }
    else {
      window.scrollTo(window.pageXOffset || window.scrollX || document.body.scrollLeft || 0, scroll)
    }
  }
  else if (horizontal === true) {
    if (rtl === true) {
      scroll = (buggyRTL === true ? parent.scrollWidth - parent.offsetWidth : 0) - scroll
    }
    parent.scrollLeft = scroll
  }
  else {
    parent.scrollTop = scroll
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
    default: null
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
  },

  tableColspan: [ Number, String ]
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
    },

    colspanAttr () {
      return this.tableColspan !== void 0
        ? { colspan: this.tableColspan }
        : { colspan: 100 }
    }
  },

  methods: {
    reset () {
      this.__resetVirtualScroll(this.prevToIndex, true)
    },

    refresh (toIndex) {
      this.__resetVirtualScroll(toIndex === void 0 ? this.prevToIndex : toIndex)
    },

    scrollTo (toIndex, edge) {
      const scrollEl = this.__getVirtualScrollTarget()

      if (scrollEl === void 0 || scrollEl === null || scrollEl.nodeType === 8) {
        return
      }

      const scrollDetails = getScrollDetails(
        scrollEl,
        this.__getVirtualScrollEl(),
        this.$refs.before,
        this.$refs.after,
        this.virtualScrollHorizontal,
        this.$q.lang.rtl,
        this.virtualScrollStickySizeStart,
        this.virtualScrollStickySizeEnd
      )

      this.__scrollViewSize !== scrollDetails.scrollViewSize && this.__setVirtualScrollSize(scrollDetails.scrollViewSize)

      this.__setVirtualScrollSliceRange(
        scrollEl,
        scrollDetails,
        Math.min(this.virtualScrollLength - 1, Math.max(0, parseInt(toIndex, 10) || 0)),
        0,
        scrollToEdges.indexOf(edge) > -1 ? edge : (this.prevToIndex > -1 && toIndex > this.prevToIndex ? 'end' : 'start')
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
          this.$q.lang.rtl,
          this.virtualScrollStickySizeStart,
          this.virtualScrollStickySizeEnd
        ),
        listLastIndex = this.virtualScrollLength - 1,
        listEndOffset = scrollDetails.scrollMaxSize - scrollDetails.offsetStart - scrollDetails.offsetEnd - this.virtualScrollPaddingAfter

      if (this.prevScrollStart === scrollDetails.scrollStart) {
        return
      }
      this.prevScrollStart = void 0

      if (scrollDetails.scrollMaxSize <= 0) {
        this.__setVirtualScrollSliceRange(scrollEl, scrollDetails, 0, 0)
        return
      }

      this.__scrollViewSize !== scrollDetails.scrollViewSize && this.__setVirtualScrollSize(scrollDetails.scrollViewSize)

      this.__updateVirtualScrollSizes(this.virtualScrollSliceRange.from)

      const scrollMaxStart = scrollDetails.scrollMaxSize - Math.max(scrollDetails.scrollViewSize, scrollDetails.offsetEnd) - this.virtualScrollSizes[listLastIndex]

      if (scrollMaxStart > 0 && scrollDetails.scrollStart >= scrollMaxStart) {
        this.__setVirtualScrollSliceRange(
          scrollEl,
          scrollDetails,
          listLastIndex,
          scrollDetails.scrollMaxSize - scrollDetails.offsetEnd - this.virtualScrollSizesAgg.reduce(sumFn, 0)
        )

        return
      }

      let
        toIndex = 0,
        listOffset = scrollDetails.scrollStart - scrollDetails.offsetStart,
        offset = listOffset

      if (listOffset <= listEndOffset && listOffset + scrollDetails.scrollViewSize >= this.virtualScrollPaddingBefore) {
        listOffset -= this.virtualScrollPaddingBefore
        toIndex = this.virtualScrollSliceRange.from
        offset = listOffset
      }
      else {
        for (let j = 0; listOffset >= this.virtualScrollSizesAgg[j] && toIndex < listLastIndex; j++) {
          listOffset -= this.virtualScrollSizesAgg[j]
          toIndex += aggBucketSize
        }
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
      const alignForce = typeof align === 'string' && align.indexOf('-force') > -1
      const alignEnd = alignForce === true ? align.replace('-force', '') : align

      let
        from = Math.max(0, Math.ceil(toIndex - this.virtualScrollSliceSizeComputed / (alignEnd === void 0 || alignEnd === 'center' ? 2 : (alignEnd === 'start' ? 3 : 1.5)))),
        to = from + this.virtualScrollSliceSizeComputed

      if (to > this.virtualScrollLength) {
        to = this.virtualScrollLength
        from = Math.max(0, to - this.virtualScrollSliceSizeComputed)
      }

      const rangeChanged = from !== this.virtualScrollSliceRange.from || to !== this.virtualScrollSliceRange.to

      if (rangeChanged === false && alignEnd === void 0) {
        this.__emitScroll(toIndex)

        return
      }

      const hadFocus = rangeChanged === true && typeof scrollEl.contains === 'function' && scrollEl.contains(document.activeElement)
      const sizeBefore = alignEnd !== void 0 ? this.virtualScrollSizes.slice(from, toIndex).reduce(sumFn, 0) : 0

      if (rangeChanged === true) {
        this.virtualScrollSliceRange = { from, to }
        this.virtualScrollPaddingBefore = sumSize(this.virtualScrollSizesAgg, this.virtualScrollSizes, 0, from)
        this.virtualScrollPaddingAfter = sumSize(this.virtualScrollSizesAgg, this.virtualScrollSizes, to, this.virtualScrollLength)
      }

      this.__activeScrollStart = scrollDetails.scrollStart

      requestAnimationFrame(() => {
        if (hadFocus === true && scrollEl.contains(document.activeElement) !== true) {
          scrollEl.focus()
        }

        if (this.__activeScrollStart !== scrollDetails.scrollStart) {
          return
        }

        if (rangeChanged === true) {
          this.__updateVirtualScrollSizes(from)
        }

        const
          sizeAfter = this.virtualScrollSizes.slice(from, toIndex).reduce(sumFn, 0),
          posStart = sizeAfter + scrollDetails.offsetStart + this.virtualScrollPaddingBefore,
          posEnd = posStart + this.virtualScrollSizes[toIndex],
          rtl = this.$q.lang.rtl === true

        let scrollPosition = posStart + offset

        if (alignEnd !== void 0) {
          const sizeDiff = sizeAfter - sizeBefore
          const scrollStart = scrollDetails.scrollStart + sizeDiff

          scrollPosition = alignForce !== true && scrollStart < posStart && posEnd < scrollStart + scrollDetails.scrollViewSize
            ? scrollStart
            : (
              alignEnd === 'end'
                ? posEnd - scrollDetails.scrollViewSize
                : posStart - (alignEnd === 'start' ? 0 : Math.round((scrollDetails.scrollViewSize - this.virtualScrollSizes[toIndex]) / 2))
            )
        }

        this.prevScrollStart = scrollPosition

        setScroll(
          scrollEl,
          scrollPosition,
          this.virtualScrollHorizontal,
          rtl
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
          sizeFn = this.virtualScrollHorizontal === true
            ? el => el.getBoundingClientRect().width
            : el => el.offsetHeight

        let
          index = from,
          size, diff

        for (let i = 0; i < childrenLength;) {
          size = sizeFn(children[i])
          i++

          while (i < childrenLength && children[i].classList.contains('q-virtual-scroll--with-prev') === true) {
            size += sizeFn(children[i])
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

    __setVirtualScrollSize (scrollViewSize) {
      if (this.virtualScrollSliceSize > 0) {
        this.virtualScrollSliceSizeComputed = this.virtualScrollSliceSize

        return
      }

      if (scrollViewSize === void 0 && typeof window !== 'undefined') {
        const scrollEl = this.__getVirtualScrollTarget()

        if (scrollEl !== void 0 && scrollEl !== null && scrollEl.nodeType !== 8) {
          scrollViewSize = getScrollDetails(
            scrollEl,
            this.__getVirtualScrollEl(),
            this.$refs.before,
            this.$refs.after,
            this.virtualScrollHorizontal,
            this.$q.lang.rtl,
            this.virtualScrollStickySizeStart,
            this.virtualScrollStickySizeEnd
          ).scrollViewSize
        }
      }

      this.__scrollViewSize = scrollViewSize

      this.virtualScrollSliceSizeComputed = scrollViewSize === void 0 || scrollViewSize <= 0
        ? 30
        : Math.ceil(scrollViewSize / this.virtualScrollItemSize * 3)
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
                attrs: this.colspanAttr
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
                attrs: this.colspanAttr
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
    buggyRTL === void 0 && detectBuggyRTL()
    this.__onVirtualScrollEvt = debounce(this.__onVirtualScrollEvt, this.$q.platform.is.ios === true ? 120 : 70)
    this.__setVirtualScrollSize()
  }
}
