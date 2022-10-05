import Vue from 'vue'

import QIcon from '../icon/QIcon.js'
import QResizeObserver from '../resize-observer/QResizeObserver.js'

import TimeoutMixin from '../../mixins/timeout.js'
import ListenersMixin from '../../mixins/listeners.js'

import { stop, noop } from '../../utils/event.js'
import { slot } from '../../utils/private/slot.js'
import cache from '../../utils/private/cache.js'
import { rtlHasScrollBug } from '../../utils/scroll.js'
import { injectProp } from '../../utils/private/inject-obj-prop.js'

function getIndicatorClass (color, top, vertical) {
  const pos = vertical === true
    ? ['left', 'right']
    : ['top', 'bottom']

  return `absolute-${top === true ? pos[0] : pos[1]}${color ? ` text-${color}` : ''}`
}

const alignValues = [ 'left', 'center', 'right', 'justify' ]
const getDefaultBestScore = () => ({ matchedLen: 0, queryDiff: 9999, hrefLen: 0, exact: false, redirected: true })

function hasQueryIncluded (targetQuery, matchingQuery) {
  for (const key in targetQuery) {
    if (targetQuery[ key ] !== matchingQuery[ key ]) {
      return false
    }
  }

  return true
}

export default Vue.extend({
  name: 'QTabs',

  mixins: [ TimeoutMixin, ListenersMixin ],

  provide () {
    return { $tabs: this }
  },

  props: {
    value: [Number, String],

    align: {
      type: String,
      default: 'center',
      validator: v => alignValues.includes(v)
    },
    breakpoint: {
      type: [String, Number],
      default: 600
    },

    vertical: Boolean,
    shrink: Boolean,
    stretch: Boolean,

    activeClass: String,
    activeColor: String,
    activeBgColor: String,
    indicatorColor: String,
    leftIcon: String,
    rightIcon: String,

    outsideArrows: Boolean,
    mobileArrows: Boolean,

    switchIndicator: Boolean,

    narrowIndicator: Boolean,
    inlineLabel: Boolean,
    noCaps: Boolean,

    dense: Boolean,

    contentClass: String
  },

  data () {
    return {
      scrollable: false,
      leftArrow: true,
      rightArrow: false,
      justify: false,

      tabNameList: [],

      // used by children
      currentModel: this.value,
      hasFocus: false,
      avoidRouteWatcher: false // false | string (uid)
    }
  },

  watch: {
    isRTL () {
      this.__localUpdateArrows()
    },

    value (name) {
      this.__updateModel({ name, setCurrent: true, skipEmit: true })
    },

    outsideArrows () {
      this.__recalculateScroll()
    },

    arrowsEnabled (v) {
      this.__localUpdateArrows = v === true
        ? this.__updateArrowsFn
        : noop

      this.__recalculateScroll()
    }
  },

  computed: {
    // used by children
    tabProps () {
      return {
        activeClass: this.activeClass,
        activeColor: this.activeColor,
        activeBgColor: this.activeBgColor,
        indicatorClass: getIndicatorClass(
          this.indicatorColor,
          this.switchIndicator,
          this.vertical
        ),
        narrowIndicator: this.narrowIndicator,
        inlineLabel: this.inlineLabel,
        noCaps: this.noCaps
      }
    },

    // used by children
    hasActiveTab () {
      return this.tabNameList.some(entry => entry.name === this.currentModel)
    },

    arrowsEnabled () {
      return this.$q.platform.is.desktop === true || this.mobileArrows === true
    },

    alignClass () {
      const align = this.scrollable === true
        ? 'left'
        : (this.justify === true ? 'justify' : this.align)

      return `q-tabs__content--align-${align}`
    },

    classes () {
      return 'q-tabs row no-wrap items-center' +
        ` q-tabs--${this.scrollable === true ? '' : 'not-'}scrollable` +
        ` q-tabs--${this.vertical === true ? 'vertical' : 'horizontal'}` +
        ` q-tabs__arrows--${this.arrowsEnabled === true && this.outsideArrows === true ? 'outside' : 'inside'}` +
        (this.dense === true ? ' q-tabs--dense' : '') +
        (this.shrink === true ? ' col-shrink' : '') +
        (this.stretch === true ? ' self-stretch' : '')
    },

    innerClass () {
      return 'q-tabs__content row no-wrap items-center self-stretch hide-scrollbar relative-position ' +
        this.alignClass +
        (this.contentClass !== void 0 ? ` ${this.contentClass}` : '') +
        (this.$q.platform.is.mobile === true ? ' scroll' : '')
    },

    domProps () {
      return this.vertical === true
        ? { container: 'height', content: 'offsetHeight', scroll: 'scrollHeight' }
        : { container: 'width', content: 'offsetWidth', scroll: 'scrollWidth' }
    },

    isRTL () {
      return this.vertical !== true && this.$q.lang.rtl === true
    },

    rtlPosCorrection () {
      return rtlHasScrollBug() === false && this.isRTL === true
    },

    // let's speed up execution of time-sensitive scrollTowards()
    // with a computed variable by directly applying the minimal
    // number of instructions on get/set functions
    posFn () {
      return this.rtlPosCorrection === true
        ? { get: content => Math.abs(content.scrollLeft), set: (content, pos) => { content.scrollLeft = -pos } }
        : (
          this.vertical === true
            ? { get: content => content.scrollTop, set: (content, pos) => { content.scrollTop = pos } }
            : { get: content => content.scrollLeft, set: (content, pos) => { content.scrollLeft = pos } }
        )
    },

    onEvents () {
      return {
        input: stop,
        ...this.qListeners,
        focusin: this.__onFocusin,
        focusout: this.__onFocusout
      }
    }
  },

  methods: {
    // used by children too
    __updateModel ({ name, setCurrent, skipEmit }) {
      if (this.currentModel !== name) {
        if (skipEmit !== true && this.qListeners.input !== void 0) {
          this.$emit('input', name)
        }

        if (setCurrent === true || this.qListeners.input === void 0) {
          this.__animate(this.currentModel, name)
          this.currentModel = name
        }
      }
    },

    __recalculateScroll () {
      this.__registerScrollTick(() => {
        this.__updateContainer({
          width: this.$el.offsetWidth,
          height: this.$el.offsetHeight
        })
      })
    },

    __updateContainer (domSize) {
      // it can be called faster than component being initialized
      // so we need to protect against that case
      // (one example of such case is the docs release notes page)
      if (this.domProps === void 0 || !this.$refs.content) { return }

      const
        size = domSize[ this.domProps.container ],
        scrollSize = Math.min(
          this.$refs.content[this.domProps.scroll],
          Array.prototype.reduce.call(
            this.$refs.content.children,
            (acc, el) => acc + (el[ this.domProps.content ] || 0),
            0
          )
        ),
        scroll = size > 0 && scrollSize > size // when there is no tab, in Chrome, size === 0 and scrollSize === 1

      if (this.scrollable !== scroll) {
        this.scrollable = scroll
      }

      // Arrows need to be updated even if the scroll status was already true
      scroll === true && this.__registerUpdateArrowsTick(this.__localUpdateArrows)

      const localJustify = size < parseInt(this.breakpoint, 10)

      if (this.justify !== localJustify) {
        this.justify = localJustify
      }
    },

    __animate (oldName, newName) {
      const
        oldTab = oldName !== void 0 && oldName !== null && oldName !== ''
          ? this.tabVmList.find(tab => tab.name === oldName)
          : null,
        newTab = newName !== void 0 && newName !== null && newName !== ''
          ? this.tabVmList.find(tab => tab.name === newName)
          : null

      if (oldTab && newTab) {
        const
          oldEl = oldTab.$refs.tabIndicator,
          newEl = newTab.$refs.tabIndicator

        clearTimeout(this.animateTimer)

        oldEl.style.transition = 'none'
        oldEl.style.transform = 'none'
        newEl.style.transition = 'none'
        newEl.style.transform = 'none'

        const
          oldPos = oldEl.getBoundingClientRect(),
          newPos = newEl.getBoundingClientRect()

        newEl.style.transform = this.vertical === true
          ? `translate3d(0,${oldPos.top - newPos.top}px,0) scale3d(1,${newPos.height ? oldPos.height / newPos.height : 1},1)`
          : `translate3d(${oldPos.left - newPos.left}px,0,0) scale3d(${newPos.width ? oldPos.width / newPos.width : 1},1,1)`

        // allow scope updates to kick in (QRouteTab needs more time)
        this.__registerAnimateTick(() => {
          this.animateTimer = setTimeout(() => {
            newEl.style.transition = 'transform .25s cubic-bezier(.4, 0, .2, 1)'
            newEl.style.transform = 'none'
          }, 70)
        })
      }

      if (newTab && this.scrollable === true) {
        this.__scrollToTabEl(newTab.$el)
      }
    },

    __scrollToTabEl (el) {
      const
        contentRef = this.$refs.content,
        { left, width, top, height } = contentRef.getBoundingClientRect(),
        newPos = el.getBoundingClientRect()

      let offset = this.vertical === true ? newPos.top - top : newPos.left - left

      if (offset < 0) {
        contentRef[ this.vertical === true ? 'scrollTop' : 'scrollLeft' ] += Math.floor(offset)
        this.__localUpdateArrows()
        return
      }

      offset += this.vertical === true ? newPos.height - height : newPos.width - width
      if (offset > 0) {
        contentRef[ this.vertical === true ? 'scrollTop' : 'scrollLeft' ] += Math.ceil(offset)
        this.__localUpdateArrows()
      }
    },

    __updateArrowsFn () {
      const content = this.$refs.content
      if (content !== null) {
        const
          rect = content.getBoundingClientRect(),
          pos = this.vertical === true ? content.scrollTop : Math.abs(content.scrollLeft)

        if (this.isRTL === true) {
          this.leftArrow = Math.ceil(pos + rect.width) < content.scrollWidth - 1
          this.rightArrow = pos > 0
        }
        else {
          this.leftArrow = pos > 0
          this.rightArrow = this.vertical === true
            ? Math.ceil(pos + rect.height) < content.scrollHeight
            : Math.ceil(pos + rect.width) < content.scrollWidth
        }
      }
    },

    __animScrollTo (value) {
      this.__stopAnimScroll()
      this.scrollTimer = setInterval(() => {
        if (this.__scrollTowards(value) === true) {
          this.__stopAnimScroll()
        }
      }, 5)
    },

    __scrollToStart () {
      this.__animScrollTo(this.rtlPosCorrection === true ? Number.MAX_SAFE_INTEGER : 0)
    },

    __scrollToEnd () {
      this.__animScrollTo(this.rtlPosCorrection === true ? 0 : Number.MAX_SAFE_INTEGER)
    },

    __stopAnimScroll () {
      clearInterval(this.scrollTimer)
    },

    // used by children
    __onKbdNavigate (keyCode, fromEl) {
      const tabs = Array.prototype.filter.call(
        this.$refs.content.children,
        el => el === fromEl || (el.matches && el.matches('.q-tab.q-focusable') === true)
      )

      const len = tabs.length
      if (len === 0) { return }

      if (keyCode === 36) { // Home
        this.__scrollToTabEl(tabs[ 0 ])
        tabs[ 0 ].focus()
        return true
      }
      if (keyCode === 35) { // End
        this.__scrollToTabEl(tabs[ len - 1 ])
        tabs[ len - 1 ].focus()
        return true
      }

      const dirPrev = keyCode === (this.vertical === true ? 38 /* ArrowUp */ : 37 /* ArrowLeft */)
      const dirNext = keyCode === (this.vertical === true ? 40 /* ArrowDown */ : 39 /* ArrowRight */)

      const dir = dirPrev === true ? -1 : (dirNext === true ? 1 : void 0)

      if (dir !== void 0) {
        const rtlDir = this.isRTL === true ? -1 : 1
        const index = tabs.indexOf(fromEl) + dir * rtlDir

        if (index >= 0 && index < len) {
          this.__scrollToTabEl(tabs[ index ])
          tabs[ index ].focus({ preventScroll: true })
        }

        return true
      }
    },

    __scrollTowards (value) {
      const
        content = this.$refs.content,
        { get, set } = this.posFn

      let
        done = false,
        pos = get(content)

      const direction = value < pos ? -1 : 1

      pos += direction * 5

      if (pos < 0) {
        done = true
        pos = 0
      }
      else if (
        (direction === -1 && pos <= value) ||
        (direction === 1 && pos >= value)
      ) {
        done = true
        pos = value
      }

      set(content, pos)
      this.__localUpdateArrows()

      return done
    },

    // do not use directly; use __verifyRouteModel() instead
    __updateActiveRoute () {
      let name = null, bestScore = getDefaultBestScore()

      const vmList = this.tabVmList.filter(tab => tab.hasRouterLink === true)
      const vmLen = vmList.length

      const { query: currentQuery } = this.$route
      const currentQueryLen = Object.keys(currentQuery).length

      for (let tabIndex = 0; tabIndex < vmLen; tabIndex++) {
        const tab = vmList[tabIndex]
        const exact = tab.exact === true

        // if a) it doesn't respect the active/exact active status
        // or b) we already found an exact match and this one isn't set as exact
        // then we don't deal with it
        if (
          tab[ exact === true ? 'linkIsExactActive' : 'linkIsActive' ] !== true ||
          (bestScore.exact === true && exact !== true)
        ) {
          continue
        }

        const { route, href } = tab.resolvedLink
        const { matched, query, hash } = route
        const redirected = route.redirectedFrom !== void 0

        if (exact === true) {
          // hey, we found the perfect match; no more searching!
          if (redirected === false) {
            name = tab.name
            break
          }

          if (bestScore.exact === false) {
            // we reset values so we can discard previous non-exact matches
            // and so we can register this exact one below
            bestScore = getDefaultBestScore()
          }
        }

        // if best is non-redirected and this one is redirected
        // then this one is inferior so we don't care about it
        if (bestScore.redirected === false && redirected === true) {
          continue
        }

        const queryLen = Object.keys(query).length

        if (
          // if it's exact it already perfectly includes current query
          // so no point in computing it
          exact === false &&
          queryLen !== 0 &&
          hasQueryIncluded(query, currentQuery) === false
        ) {
          // it has query and it doesn't includes the current one
          continue
        }

        const newScore = {
          exact,
          redirected,
          matchedLen: matched.length,
          queryDiff: exact === true
            ? 0 // avoid computing as it's 0 anyway
            : currentQueryLen - queryLen,
          hrefLen: href.length - hash.length
        }

        if (newScore.matchedLen > bestScore.matchedLen) {
          // it matches more routes so it's more specific so we set it as current champion
          name = tab.name
          bestScore = newScore
          continue
        }
        else if (newScore.matchedLen !== bestScore.matchedLen) {
          // it matches less routes than the current champion so we discard it
          continue
        }

        if (newScore.queryDiff < bestScore.queryDiff) {
          // query is closer to the current one so we set it as current champion
          name = tab.name
          bestScore = newScore
          continue
        }
        else if (newScore.queryDiff !== bestScore.queryDiff) {
          continue
        }

        if (newScore.hrefLen > bestScore.hrefLen) {
          // href is lengthier so it's more specific so we set it as current champion
          name = tab.name
          bestScore = newScore
        }
      }

      if (
        name === null &&
        this.tabVmList.some(tab => tab.hasRouterLink === void 0 && tab.name === this.currentModel) === true
      ) {
        // we shouldn't interfere if non-route tab is active
        return
      }

      this.__updateModel({ name, setCurrent: true })
    },

    __onFocusin (e) {
      this.__removeFocusTimeout()

      if (
        this.hasFocus !== true &&
        this.$el &&
        e.target &&
        typeof e.target.closest === 'function'
      ) {
        const tab = e.target.closest('.q-tab')

        // if the target is contained by a QTab/QRouteTab
        // (it might be other elements focused, like additional QBtn)
        if (tab && this.$el.contains(tab) === true) {
          this.hasFocus = true

          if (this.scrollable === true) {
            this.__scrollToTabEl(tab)
          }
        }
      }

      this.qListeners.focusin !== void 0 && this.$emit('focusin', e)
    },

    __onFocusout (e) {
      this.__registerFocusTimeout(() => { this.hasFocus = false }, 30)
      this.qListeners.focusout !== void 0 && this.$emit('focusout', e)
    },

    // used by children
    __verifyRouteModel () {
      if (this.avoidRouteWatcher === false) {
        this.__registerScrollToTabTimeout(this.__updateActiveRoute)
      }
      else {
        this.__removeScrollToTabTimeout()
      }
    },

    __watchRoute () {
      if (this.unwatchRoute === void 0) {
        const unwatch = this.$watch(() => this.$route.fullPath, this.__verifyRouteModel)
        this.unwatchRoute = () => {
          unwatch()
          this.unwatchRoute = void 0
        }
      }
    },

    // used by children
    __registerTab (tabVm) {
      // we avoid setting tabVmList in data() as this would
      // make the whole vm reactive
      this.tabVmList.push(tabVm)
      // ...so we extract only the needed stuff out of it
      // into data() defined tabNameList
      this.tabNameList.push(
        injectProp({}, 'name', () => tabVm.name)
      )

      this.__recalculateScroll()

      // if it's a QTab
      if (tabVm.hasRouterLink === void 0 || this.$route === void 0) {
        // we should position to the currently active tab (if any)
        this.__registerScrollToTabTimeout(() => {
          if (this.scrollable === true) {
            const value = this.currentModel
            const newTab = value !== void 0 && value !== null && value !== ''
              ? this.tabVmList.find(tab => tab.name === value)
              : null

            newTab && this.__scrollToTabEl(newTab.$el)
          }
        })
      }
      // else if it's a QRouteTab with a valid link
      else {
        this.__watchRoute()

        if (tabVm.hasRouterLink === true) {
          this.__verifyRouteModel()
        }
      }
    },

    // used by children
    __unregisterTab (tabVm) {
      const index = this.tabVmList.indexOf(tabVm)

      this.tabVmList.splice(index, 1)
      this.tabNameList.splice(index, 1)

      this.__recalculateScroll()

      // if we're watching route and this tab is a QRouteTab
      if (this.unwatchRoute !== void 0 && tabVm.hasRouterLink !== void 0) {
        // unwatch route if we don't have any QRouteTabs left
        if (this.tabVmList.every(tab => tab.hasRouterLink === void 0) === true) {
          this.unwatchRoute()
        }

        // then update model
        this.__verifyRouteModel()
      }
    },

    __cleanup () {
      clearTimeout(this.animateTimer)
      this.__stopAnimScroll()
      this.unwatchRoute !== void 0 && this.unwatchRoute()
    }
  },

  created () {
    this.__useTick('__registerScrollTick')
    this.__useTick('__registerUpdateArrowsTick')
    this.__useTick('__registerAnimateTick')

    this.__useTimeout('__registerFocusTimeout', '__removeFocusTimeout')
    this.__useTimeout('__registerScrollToTabTimeout', '__removeScrollToTabTimeout')

    Object.assign(this, {
      tabVmList: [],
      __localUpdateArrows: this.arrowsEnabled === true
        ? this.__updateArrowsFn
        : noop
    })
  },

  activated () {
    this.hadRouteWatcher === true && this.__watchRoute()
    this.__recalculateScroll()
  },

  deactivated () {
    this.hadRouteWatcher = this.unwatchRoute !== void 0
    this.__cleanup()
  },

  beforeDestroy () {
    this.__cleanup()
  },

  render (h) {
    const child = [
      h(QResizeObserver, {
        on: cache(this, 'resize', { resize: this.__updateContainer })
      }),

      h('div', {
        ref: 'content',
        class: this.innerClass,
        on: this.arrowsEnabled === true ? cache(this, 'scroll', { scroll: this.__updateArrowsFn }) : void 0
      }, slot(this, 'default'))
    ]

    this.arrowsEnabled === true && child.push(
      h(QIcon, {
        class: 'q-tabs__arrow q-tabs__arrow--start absolute q-tab__icon' +
            (this.leftArrow === true ? '' : ' q-tabs__arrow--faded'),
        props: { name: this.leftIcon || this.$q.iconSet.tabs[ this.vertical === true ? 'up' : 'left' ] },
        on: cache(this, 'onS', {
          '&mousedown': this.__scrollToStart,
          '&touchstart': this.__scrollToStart,
          '&mouseup': this.__stopAnimScroll,
          '&mouseleave': this.__stopAnimScroll,
          '&touchend': this.__stopAnimScroll
        })
      }),

      h(QIcon, {
        class: 'q-tabs__arrow q-tabs__arrow--end absolute q-tab__icon' +
            (this.rightArrow === true ? '' : ' q-tabs__arrow--faded'),
        props: { name: this.rightIcon || this.$q.iconSet.tabs[ this.vertical === true ? 'down' : 'right' ] },
        on: cache(this, 'onE', {
          '&mousedown': this.__scrollToEnd,
          '&touchstart': this.__scrollToEnd,
          '&mouseup': this.__stopAnimScroll,
          '&mouseleave': this.__stopAnimScroll,
          '&touchend': this.__stopAnimScroll
        })
      })
    )

    return h('div', {
      class: this.classes,
      on: this.onEvents,
      attrs: { role: 'tablist' }
    }, child)
  }
})
