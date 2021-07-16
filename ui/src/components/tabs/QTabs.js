import { h, defineComponent, ref, computed, watch, nextTick, onBeforeUnmount, onActivated, getCurrentInstance, provide } from 'vue'

import QIcon from '../icon/QIcon.js'
import QResizeObserver from '../resize-observer/QResizeObserver.js'

import useTick from '../../composables/private/use-tick.js'
import useTimeout from '../../composables/private/use-timeout.js'

import { noop } from '../../utils/event.js'
import { hSlot } from '../../utils/private/render.js'
import { tabsKey } from '../../utils/private/symbols.js'

function getIndicatorClass (color, top, vertical) {
  const pos = vertical === true
    ? [ 'left', 'right' ]
    : [ 'top', 'bottom' ]

  return `absolute-${ top === true ? pos[ 0 ] : pos[ 1 ] }${ color ? ` text-${ color }` : '' }`
}

const alignValues = [ 'left', 'center', 'right', 'justify' ]

export default defineComponent({
  name: 'QTabs',

  props: {
    modelValue: [ Number, String ],

    align: {
      type: String,
      default: 'center',
      validator: v => alignValues.includes(v)
    },
    breakpoint: {
      type: [ String, Number ],
      default: 600
    },

    vertical: Boolean,
    shrink: Boolean,
    stretch: Boolean,

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

    contentClass: String,

    'onUpdate:modelValue': Function
  },

  setup (props, { slots, emit }) {
    const vm = getCurrentInstance()
    const { proxy: { $q } } = vm

    const { registerTick, prepareTick } = useTick()
    const { registerTimeout } = useTimeout()

    const rootRef = ref(null)
    const contentRef = ref(null)

    const currentModel = ref(props.modelValue)
    const scrollable = ref(false)
    const leftArrow = ref(true)
    const rightArrow = ref(false)
    const justify = ref(false)

    const arrowsEnabled = computed(() =>
      $q.platform.is.desktop === true || props.mobileArrows === true
    )

    const tabList = []

    let localFromRoute = false, animateTimer, scrollTimer, unwatchRoute
    let localUpdateArrows = arrowsEnabled.value === true
      ? updateArrowsFn
      : noop

    const tabProps = computed(() => ({
      activeColor: props.activeColor,
      activeBgColor: props.activeBgColor,
      indicatorClass: getIndicatorClass(
        props.indicatorColor,
        props.switchIndicator,
        props.vertical
      ),
      narrowIndicator: props.narrowIndicator,
      inlineLabel: props.inlineLabel,
      noCaps: props.noCaps
    }))

    const alignClass = computed(() => {
      const align = scrollable.value === true
        ? 'left'
        : (justify.value === true ? 'justify' : props.align)

      return `q-tabs__content--align-${ align }`
    })

    const classes = computed(() =>
      'q-tabs row no-wrap items-center'
      + ` q-tabs--${ scrollable.value === true ? '' : 'not-' }scrollable`
      + ` q-tabs--${ props.vertical === true ? 'vertical' : 'horizontal' }`
      + ` q-tabs__arrows--${ arrowsEnabled.value === true && props.outsideArrows === true ? 'outside' : 'inside' }`
      + (props.dense === true ? ' q-tabs--dense' : '')
      + (props.shrink === true ? ' col-shrink' : '')
      + (props.stretch === true ? ' self-stretch' : '')
    )

    const innerClass = computed(() =>
      'q-tabs__content row no-wrap items-center self-stretch hide-scrollbar '
      + alignClass.value
      + (props.contentClass !== void 0 ? ` ${ props.contentClass }` : '')
      + ($q.platform.is.mobile === true ? ' scroll' : '')
    )

    const domProps = computed(() => (
      props.vertical === true
        ? { container: 'height', content: 'offsetHeight', scroll: 'scrollHeight' }
        : { container: 'width', content: 'offsetWidth', scroll: 'scrollWidth' }
    ))

    watch(() => props.modelValue, name => {
      updateModel({ name, setCurrent: true, skipEmit: true })
    })

    watch(() => props.outsideArrows, () => {
      nextTick(recalculateScroll())
    })

    watch(arrowsEnabled, v => {
      localUpdateArrows = v === true
        ? updateArrowsFn
        : noop

      nextTick(recalculateScroll())
    })

    function updateModel ({ name, setCurrent, skipEmit, fromRoute }) {
      if (currentModel.value !== name) {
        skipEmit !== true && emit('update:modelValue', name)
        if (
          setCurrent === true
          || props[ 'onUpdate:modelValue' ] === void 0
        ) {
          animate(currentModel.value, name)
          currentModel.value = name
        }
      }

      if (fromRoute !== void 0) {
        localFromRoute = fromRoute
      }
    }

    function recalculateScroll () {
      registerTick(() => {
        if (vm.isDeactivated !== true && vm.isUnmounted !== true) {
          updateContainer({
            width: rootRef.value.offsetWidth,
            height: rootRef.value.offsetHeight
          })
        }
      })

      prepareTick()
    }

    function updateContainer (domSize) {
      // it can be called faster than component being initialized
      // so we need to protect against that case
      // (one example of such case is the docs release notes page)
      if (domProps.value === void 0 || contentRef.value === null) { return }

      const
        size = domSize[ domProps.value.container ],
        scrollSize = Math.min(
          contentRef.value[ domProps.value.scroll ],
          Array.prototype.reduce.call(
            contentRef.value.children,
            (acc, el) => acc + el[ domProps.value.content ],
            0
          )
        ),
        scroll = size > 0 && scrollSize > size // when there is no tab, in Chrome, size === 0 and scrollSize === 1

      if (scrollable.value !== scroll) {
        scrollable.value = scroll
      }

      // Arrows need to be updated even if the scroll status was already true
      scroll === true && nextTick(localUpdateArrows)

      const localJustify = size < parseInt(props.breakpoint, 10)

      if (justify.value !== localJustify) {
        justify.value = localJustify
      }
    }

    function animate (oldName, newName) {
      const
        oldTab = oldName !== void 0 && oldName !== null && oldName !== ''
          ? tabList.find(tab => tab.name.value === oldName)
          : null,
        newTab = newName !== void 0 && newName !== null && newName !== ''
          ? tabList.find(tab => tab.name.value === newName)
          : null

      if (oldTab && newTab) {
        const
          oldEl = oldTab.tabIndicatorRef.value,
          newEl = newTab.tabIndicatorRef.value

        clearTimeout(animateTimer)

        oldEl.style.transition = 'none'
        oldEl.style.transform = 'none'
        newEl.style.transition = 'none'
        newEl.style.transform = 'none'

        const
          oldPos = oldEl.getBoundingClientRect(),
          newPos = newEl.getBoundingClientRect()

        newEl.style.transform = props.vertical === true
          ? `translate3d(0,${ oldPos.top - newPos.top }px,0) scale3d(1,${ newPos.height ? oldPos.height / newPos.height : 1 },1)`
          : `translate3d(${ oldPos.left - newPos.left }px,0,0) scale3d(${ newPos.width ? oldPos.width / newPos.width : 1 },1,1)`

        // allow scope updates to kick in (QRouteTab needs more time)
        nextTick(() => {
          animateTimer = setTimeout(() => {
            newEl.style.transition = 'transform .25s cubic-bezier(.4, 0, .2, 1)'
            newEl.style.transform = 'none'
          }, 70)
        })
      }

      if (newTab && scrollable.value === true) {
        const
          { left, width, top, height } = contentRef.value.getBoundingClientRect(),
          newPos = newTab.rootRef.value.getBoundingClientRect()

        let offset = props.vertical === true ? newPos.top - top : newPos.left - left

        if (offset < 0) {
          contentRef.value[ props.vertical === true ? 'scrollTop' : 'scrollLeft' ] += Math.floor(offset)
          localUpdateArrows()
          return
        }

        offset += props.vertical === true ? newPos.height - height : newPos.width - width
        if (offset > 0) {
          contentRef.value[ props.vertical === true ? 'scrollTop' : 'scrollLeft' ] += Math.ceil(offset)
          localUpdateArrows()
        }
      }
    }

    function updateArrowsFn () {
      const content = contentRef.value
      if (content !== null) {
        const
          rect = content.getBoundingClientRect(),
          pos = props.vertical === true ? content.scrollTop : content.scrollLeft

        leftArrow.value = pos > 0
        rightArrow.value = props.vertical === true
          ? Math.ceil(pos + rect.height) < content.scrollHeight
          : Math.ceil(pos + rect.width) < content.scrollWidth
      }
    }

    function animScrollTo (value) {
      stopAnimScroll()
      scrollTowards(value)

      scrollTimer = setInterval(() => {
        if (scrollTowards(value)) {
          stopAnimScroll()
        }
      }, 5)
    }

    function scrollToStart () {
      animScrollTo(0)
    }

    function scrollToEnd () {
      animScrollTo(9999)
    }

    function stopAnimScroll () {
      clearInterval(scrollTimer)
    }

    function scrollTowards (value) {
      const content = contentRef.value
      let
        pos = props.vertical === true ? content.scrollTop : content.scrollLeft,
        done = false

      const direction = value < pos ? -1 : 1

      pos += direction * 5
      if (pos < 0) {
        done = true
        pos = 0
      }
      else if (
        (direction === -1 && pos <= value)
        || (direction === 1 && pos >= value)
      ) {
        done = true
        pos = value
      }

      content[ props.vertical === true ? 'scrollTop' : 'scrollLeft' ] = pos
      localUpdateArrows()

      return done
    }

    function getRouteList () {
      return tabList.filter(tab => tab.routerProps !== void 0 && tab.routerProps.hasLink.value === true)
    }

    // do not use directly; use verifyRouteModel() instead
    function updateActiveRoute () {
      let href = '', name = null, wasActive = localFromRoute

      getRouteList().forEach(tab => {
        if (
          tab.routerProps !== void 0
          && tab.routerProps[ tab.routerProps.exact.value === true ? 'linkIsExactActive' : 'linkIsActive' ].value === true
          && tab.routerProps.linkRoute.value.href.length > href.length
        ) {
          href = tab.routerProps.linkRoute.value.href
          name = tab.name.value
        }
        else if (currentModel.value === tab.name.value) {
          wasActive = true
        }
      })

      if (wasActive === true || name !== null) {
        updateModel({ name, setCurrent: true, fromRoute: true })
      }
    }

    function verifyRouteModel () {
      registerTimeout(updateActiveRoute)
    }

    function registerTab (getTab) {
      tabList.push(getTab)

      const routeList = getRouteList()

      if (routeList.length > 0) {
        if (unwatchRoute === void 0) {
          unwatchRoute = watch(() => vm.proxy.$route, verifyRouteModel)
        }

        verifyRouteModel()
      }
    }

    /*
     * Vue has an aggressive diff (in-place replacement) so we cannot
     * ensure that the instance getting destroyed is the actual tab
     * reported here. As a result, we cannot use its name or check
     * if it's a route one to make the necessary updates. We need to
     * always check the existing list again and infer the changes.
     */
    function unregisterTab (tabData) {
      tabList.splice(tabList.indexOf(tabData), 1)

      if (unwatchRoute !== void 0) {
        const routeList = getRouteList()

        if (routeList.length === 0) {
          unwatchRoute()
          unwatchRoute = void 0
        }

        verifyRouteModel()
      }
    }

    provide(tabsKey, {
      currentModel,
      tabProps,

      registerTab,
      unregisterTab,

      verifyRouteModel,
      updateModel,
      recalculateScroll
    })

    onBeforeUnmount(() => {
      clearTimeout(animateTimer)
      unwatchRoute !== void 0 && unwatchRoute()
    })

    onActivated(recalculateScroll)

    return () => {
      const child = [
        h(QResizeObserver, { onResize: updateContainer }),

        h('div', {
          ref: contentRef,
          class: innerClass.value,
          onScroll: localUpdateArrows
        }, hSlot(slots.default))
      ]

      arrowsEnabled.value === true && child.push(
        h(QIcon, {
          class: 'q-tabs__arrow q-tabs__arrow--left absolute q-tab__icon'
            + (leftArrow.value === true ? '' : ' q-tabs__arrow--faded'),
          name: props.leftIcon || $q.iconSet.tabs[ props.vertical === true ? 'up' : 'left' ],
          onMousedown: scrollToStart,
          onTouchstartPassive: scrollToStart,
          onMouseup: stopAnimScroll,
          onMouseleave: stopAnimScroll,
          onTouchend: stopAnimScroll
        }),

        h(QIcon, {
          class: 'q-tabs__arrow q-tabs__arrow--right absolute q-tab__icon'
            + (rightArrow.value === true ? '' : ' q-tabs__arrow--faded'),
          name: props.rightIcon || $q.iconSet.tabs[ props.vertical === true ? 'down' : 'right' ],
          onMousedown: scrollToEnd,
          onTouchstartPassive: scrollToEnd,
          onMouseup: stopAnimScroll,
          onMouseleave: stopAnimScroll,
          onTouchend: stopAnimScroll
        })
      )

      return h('div', {
        ref: rootRef,
        class: classes.value,
        role: 'tablist'
      }, child)
    }
  }
})
