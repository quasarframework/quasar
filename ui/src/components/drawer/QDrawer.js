import { h, defineComponent, withDirectives, ref, computed, watch, onMounted, onBeforeUnmount, nextTick, inject, getCurrentInstance } from 'vue'

import useQuasar from '../../composables/use-quasar.js'
import useHistory from '../../composables/private/use-history.js'
import useModelToggle, { useModelToggleProps, useModelToggleEmits } from '../../composables/private/use-model-toggle.js'
import usePreventScroll from '../../composables/private/use-prevent-scroll.js'
import useTimeout from '../../composables/use-timeout.js'
import useDark, { useDarkProps } from '../../composables/private/use-dark.js'

import TouchPan from '../../directives/TouchPan.js'

import { between } from '../../utils/format.js'
import { hSlot, hDir } from '../../utils/composition-render.js'
import { layoutKey } from '../../utils/symbols.js'

const duration = 150

export default defineComponent({
  name: 'QDrawer',

  inheritAttrs: false,

  props: {
    ...useModelToggleProps,
    ...useDarkProps,

    side: {
      type: String,
      default: 'left',
      validator: v => [ 'left', 'right' ].includes(v)
    },

    width: {
      type: Number,
      default: 300
    },

    mini: Boolean,
    miniToOverlay: Boolean,
    miniWidth: {
      type: Number,
      default: 57
    },

    breakpoint: {
      type: Number,
      default: 1023
    },
    showIfAbove: Boolean,

    behavior: {
      type: String,
      validator: v => [ 'default', 'desktop', 'mobile' ].includes(v),
      default: 'default'
    },

    bordered: Boolean,
    elevated: Boolean,

    overlay: Boolean,
    persistent: Boolean,
    noSwipeOpen: Boolean,
    noSwipeClose: Boolean,
    noSwipeBackdrop: Boolean
  },

  emits: [
    ...useModelToggleEmits,
    'on-layout', 'mini-state'
  ],

  setup (props, { slots, emit, attrs }) {
    const $q = useQuasar()
    const vm = getCurrentInstance()

    const { isDark } = useDark(props, $q)
    const { preventBodyScroll } = usePreventScroll()
    const { registerTimeout } = useTimeout()

    const $layout = inject(layoutKey, () => {
      console.error('QDrawer needs to be child of QLayout')
    })

    let lastDesktopState, timerMini, layoutTotalWidthWatcher

    const belowBreakpoint = ref(
      props.behavior === 'mobile' ||
      (props.behavior !== 'desktop' && $layout.totalWidth.value <= props.breakpoint)
    )

    const isMini = computed(() =>
      props.mini === true && belowBreakpoint.value !== true
    )

    const size = computed(() =>
      isMini.value === true
        ? props.miniWidth
        : props.width
    )

    const showing = ref(
      props.showIfAbove === true && belowBreakpoint.value === false
        ? true
        : props.modelValue === true
    )

    const hideOnRouteChange = computed(() =>
      props.persistent !== true &&
      (belowBreakpoint.value === true || onScreenOverlay.value === true)
    )

    function handleShow (evt, noEvent) {
      addToHistory()

      evt !== false && $layout.animate()
      applyPosition(0)

      if (belowBreakpoint.value === true) {
        const otherInstance = $layout.instances[ otherSide.value ]
        if (otherInstance !== void 0 && otherInstance.belowBreakpoint === true) {
          otherInstance.hide(false)
        }

        applyBackdrop(1)
        $layout.container !== true && preventBodyScroll(true)
      }
      else {
        applyBackdrop(0)
        evt !== false && setScrollable(false)
      }

      registerTimeout(() => {
        evt !== false && setScrollable(true)
        noEvent !== true && emit('show', evt)
      }, duration)
    }

    function handleHide (evt, noEvent) {
      removeFromHistory()

      evt !== false && $layout.animate()

      applyBackdrop(0)
      applyPosition(stateDirection.value * size.value)

      cleanup()

      noEvent !== true && registerTimeout(() => {
        emit('hide', evt)
      }, duration)
    }

    const { show, hide } = useModelToggle({
      props,
      emit,
      vm,
      showing,
      hideOnRouteChange,
      handleShow,
      handleHide
    })

    const { addToHistory, removeFromHistory } = useHistory(showing, hide, hideOnRouteChange)

    const instance = {
      belowBreakpoint,
      hide
    }

    const rightSide = computed(() => props.side === 'right')

    const stateDirection = computed(() =>
      ($q.lang.rtl === true ? -1 : 1) * (rightSide.value === true ? 1 : -1)
    )

    const flagBackdropBg = ref(0)
    const flagPanning = ref(false)
    const flagMiniAnimate = ref(false)
    const flagContentPosition = ref( // starting with "hidden" for SSR
      size.value * stateDirection.value
    )

    const otherSide = computed(() => rightSide.value === true ? 'left' : 'right')
    const offset = computed(() =>
      showing.value === true && belowBreakpoint.value === false && props.overlay === false
        ? (props.miniToOverlay === true ? props.miniWidth : size.value)
        : 0
    )

    const fixed = computed(() =>
      props.overlay === true ||
      props.miniToOverlay === true ||
      $layout.view.indexOf(rightSide.value ? 'R' : 'L') > -1 ||
      ($q.platform.is.ios === true && $layout.container === true)
    )

    const onLayout = computed(() =>
      props.overlay === false &&
      showing.value === true &&
      belowBreakpoint.value === false
    )

    const onScreenOverlay = computed(() =>
      props.overlay === true &&
      showing.value === true &&
      belowBreakpoint.value === false
    )

    const backdropClass = computed(() =>
      'fullscreen q-drawer__backdrop' +
      (showing.value === false && flagPanning.value === false ? ' hidden' : '')
    )

    const backdropStyle = computed(() => ({
      backgroundColor: `rgba(0,0,0,${flagBackdropBg.value * 0.4})`
    }))

    const headerSlot = computed(() =>
      rightSide.value === true
        ? $layout.rows.value.top[ 2 ] === 'r'
        : $layout.rows.value.top[ 0 ] === 'l'
    )

    const footerSlot = computed(() =>
      rightSide.value === true
        ? $layout.rows.value.bottom[ 2 ] === 'r'
        : $layout.rows.value.bottom[ 0 ] === 'l'
    )

    const aboveStyle = computed(() => {
      const css = {}

      if ($layout.header.space === true && headerSlot.value === false) {
        if (fixed.value === true) {
          css.top = `${$layout.header.offset}px`
        }
        else if ($layout.header.space === true) {
          css.top = `${$layout.header.size}px`
        }
      }

      if ($layout.footer.space === true && footerSlot.value === false) {
        if (fixed.value === true) {
          css.bottom = `${$layout.footer.offset}px`
        }
        else if ($layout.footer.space === true) {
          css.bottom = `${$layout.footer.size}px`
        }
      }

      return css
    })

    const style = computed(() => {
      const style = {
        width: `${size.value}px`,
        transform: `translateX(${flagContentPosition.value}px)`
      }

      return belowBreakpoint.value === true
        ? style
        : Object.assign(style, aboveStyle.value)
    })

    const classes = computed(() =>
      `q-drawer q-drawer--${props.side}` +
      (flagMiniAnimate.value === true ? ' q-drawer--mini-animate' : '') +
      (props.bordered === true ? ' q-drawer--bordered' : '') +
      (isDark.value === true ? ' q-drawer--dark q-dark' : '') +
      (
        flagPanning.value === true
          ? ' no-transition'
          : (showing.value === true ? '' : ' q-layout--prevent-focus')
      ) +
      (
        belowBreakpoint.value === true
          ? ' fixed q-drawer--on-top q-drawer--mobile q-drawer--top-padding'
          : ` q-drawer--${isMini.value === true ? 'mini' : 'standard'}` +
          (fixed.value === true || onLayout.value !== true ? ' fixed' : '') +
          (props.overlay === true || props.miniToOverlay === true ? ' q-drawer--on-top' : '') +
          (headerSlot.value === true ? ' q-drawer--top-padding' : '')
      )
    )

    const openDirective = computed(() => {
      // if props.noSwipeOpen !== true
      const dir = $q.lang.rtl === true ? props.side : otherSide.value

      return [[
        TouchPan,
        onOpenPan,
        void 0,
        {
          [ dir ]: true,
          mouse: true
        }
      ]]
    })

    const contentCloseDirective = computed(() => {
      // if belowBreakpoint.value === true && props.noSwipeClose !== true
      const dir = $q.lang.rtl === true ? otherSide.value : props.side

      return [[
        TouchPan,
        onClosePan,
        void 0,
        {
          [ dir ]: true,
          mouse: true
        }
      ]]
    })

    const backdropCloseDirective = computed(() => {
      // if showing.value === true && props.noSwipeBackdrop !== true
      const dir = $q.lang.rtl === true ? otherSide.value : props.side

      return [[
        TouchPan,
        onClosePan,
        void 0,
        {
          [ dir ]: true,
          mouse: true,
          mouseAllDir: true
        }
      ]]
    })

    watch(belowBreakpoint, val => {
      if (val === true) { // from lg to xs
        lastDesktopState = showing.value
        showing.value === true && hide(false)
      }
      else if (
        props.overlay === false &&
        props.behavior !== 'mobile' &&
        lastDesktopState !== false
      ) { // from xs to lg
        if (showing.value === true) {
          applyPosition(0)
          applyBackdrop(0)
          cleanup()
        }
        else {
          show(false)
        }
      }
    })

    watch($layout.totalWidth, val => {
      updateLocal(belowBreakpoint, (
        props.behavior === 'mobile' ||
        (props.behavior !== 'desktop' && val <= props.breakpoint)
      ))
    })

    watch(() => props.side, (newSide, oldSide) => {
      if ($layout.instances[ oldSide ] === instance) {
        $layout.instances[ oldSide ] = void 0
        $layout[ oldSide ].space = false
        $layout[ oldSide ].offset = 0
      }

      $layout.instances[ newSide ] = instance
      $layout[ newSide ].size = size.value
      $layout[ newSide ].space = onLayout.value
      $layout[ newSide ].offset = offset.value
    })

    watch(() => props.behavior + props.breakpoint, updateBelowBreakpoint)

    watch(() => $layout.container, val => {
      showing.value === true && preventBodyScroll(val !== true)
    })

    watch($layout.scrollbarWidth, () => {
      applyPosition(showing.value === true ? 0 : void 0)
    })

    watch(offset, val => { updateLayout('offset', val) })

    watch(onLayout, val => {
      emit('on-layout', val)
      updateLayout('space', val)
    })

    watch(rightSide, () => { applyPosition() })

    watch(size, val => {
      applyPosition()
      updateSizeOnLayout(props.miniToOverlay, val)
    })

    watch(() => props.miniToOverlay, val => {
      updateSizeOnLayout(val, size.value)
    })

    watch(() => $q.lang.rtl, () => { applyPosition() })

    watch(() => props.mini, () => {
      if (props.modelValue === true) {
        animateMini()
        $layout.animate()
      }
    })

    watch(isMini, val => { emit('mini-state', val) })

    function applyPosition (position) {
      if (position === void 0) {
        nextTick(() => {
          position = showing.value === true ? 0 : size.value
          applyPosition(stateDirection.value * position)
        })
      }
      else {
        if (
          $layout.container === true &&
          rightSide.value === true &&
          (belowBreakpoint.value === true || Math.abs(position) === size.value)
        ) {
          position += stateDirection.value * $layout.scrollbarWidth.value
        }

        flagContentPosition.value = position
      }
    }

    function updateBelowBreakpoint () {
      updateLocal(belowBreakpoint, (
        props.behavior === 'mobile' ||
        (props.behavior !== 'desktop' && $layout.totalWidth.value <= props.breakpoint)
      ))
    }

    function applyBackdrop (x) {
      flagBackdropBg.value = x
    }

    function setScrollable (v) {
      const action = v === true
        ? 'remove'
        : ($layout.container !== true ? 'add' : '')

      action !== '' && document.body.classList[ action ]('q-body--drawer-toggle')
    }

    function animateMini () {
      clearTimeout(timerMini)
      flagMiniAnimate.value = true
      timerMini = setTimeout(() => {
        flagMiniAnimate.value = false
      }, 150)
    }

    function onOpenPan (evt) {
      if (showing.value !== false) {
        // some browsers might capture and trigger this
        // even if Drawer has just been opened (but animation is still pending)
        return
      }

      const
        width = size.value,
        position = between(evt.distance.x, 0, width)

      if (evt.isFinal === true) {
        const opened = position >= Math.min(75, width)

        if (opened === true) {
          show()
        }
        else {
          $layout.animate()
          applyBackdrop(0)
          applyPosition(stateDirection.value * width)
        }

        flagPanning.value = false
        return
      }

      applyPosition(
        ($q.lang.rtl === true ? rightSide.value !== true : rightSide.value)
          ? Math.max(width - position, 0)
          : Math.min(0, position - width)
      )
      applyBackdrop(
        between(position / width, 0, 1)
      )

      if (evt.isFirst === true) {
        flagPanning.value = true
      }
    }

    function onClosePan (evt) {
      if (showing.value !== true) {
        // some browsers might capture and trigger this
        // even if Drawer has just been closed (but animation is still pending)
        return
      }

      const
        width = size.value,
        dir = evt.direction === props.side,
        position = ($q.lang.rtl === true ? dir !== true : dir)
          ? between(evt.distance.x, 0, width)
          : 0

      if (evt.isFinal === true) {
        const opened = Math.abs(position) < Math.min(75, width)

        if (opened === true) {
          $layout.animate()
          applyBackdrop(1)
          applyPosition(0)
        }
        else {
          hide()
        }

        flagPanning.value = false
        return
      }

      applyPosition(stateDirection.value * position)
      applyBackdrop(between(1 - position / width, 0, 1))

      if (evt.isFirst === true) {
        flagPanning.value = true
      }
    }

    function cleanup () {
      preventBodyScroll(false)
      setScrollable(true)
    }

    function updateLayout (prop, val) {
      // ensure state update is caught correctly by Vue diffing
      // on all layout components, so nextTicking:
      nextTick(() => {
        if ($layout[ props.side ][ prop ] !== val) {
          $layout[ props.side ][ prop ] = val
        }
      })
    }

    function updateLocal (prop, val) {
      if (prop.value !== val) {
        prop.value = val
      }
    }

    function updateSizeOnLayout (miniToOverlay, size) {
      updateLayout('size', miniToOverlay === true ? props.miniWidth : size)
    }

    $layout.instances[ props.side ] = instance
    updateSizeOnLayout(props.miniToOverlay, size.value)
    updateLayout('space', onLayout.value)
    updateLayout('offset', offset.value)

    if (
      props.showIfAbove === true &&
      props.modelValue !== true &&
      showing.value === true &&
      vm.vnode.props[ 'onUpdate:modelValue' ] === true
    ) {
      emit('update:modelValue', true)
    }

    onMounted(() => {
      emit('on-layout', onLayout.value)
      emit('mini-state', isMini.value)

      lastDesktopState = props.showIfAbove === true

      const fn = () => {
        const action = showing.value === true ? handleShow : handleHide
        action(false, true)
      }

      if ($layout.totalWidth.value !== 0) {
        // make sure that all computed properties
        // have been updated before calling handleShow/handleHide()
        nextTick(fn)
        return
      }

      layoutTotalWidthWatcher = watch($layout.totalWidth, () => {
        layoutTotalWidthWatcher()
        layoutTotalWidthWatcher = void 0

        if (showing.value === false && props.showIfAbove === true && belowBreakpoint.value === false) {
          show(false)
        }
        else {
          fn()
        }
      })
    })

    onBeforeUnmount(() => {
      layoutTotalWidthWatcher !== void 0 && layoutTotalWidthWatcher()
      clearTimeout(timerMini)

      showing.value === true && cleanup()

      if ($layout.instances[ props.side ] === instance) {
        $layout.instances[ props.side ] = void 0
        updateLayout('size', 0)
        updateLayout('offset', 0)
        updateLayout('space', false)
      }
    })

    return () => {
      const child = []

      if (belowBreakpoint.value === true) {
        props.noSwipeOpen === false && child.push(
          withDirectives(
            h('div', {
              key: 'open',
              class: `q-drawer__opener fixed-${props.side}`,
              'aria-hidden': 'true'
            }),
            openDirective.value
          )
        )

        child.push(
          hDir(
            'div',
            {
              ref: 'backdrop',
              class: backdropClass.value,
              style: backdropStyle.value,
              'aria-hidden': 'true',
              onClick: hide
            },
            void 0,
            'backdrop',
            props.noSwipeBackdrop !== true && showing.value === true,
            () => backdropCloseDirective.value
          )
        )
      }

      const content = [
        h('div', {
          ...attrs,
          class: [
            'q-drawer__content fit ' + ($layout.container === true ? 'overflow-auto' : 'scroll'),
            attrs.class
          ]
        }, isMini.value === true && slots.mini !== void 0
          ? slots.mini()
          : hSlot(slots.default)
        )
      ]

      if (props.elevated === true && showing.value === true) {
        content.push(
          h('div', {
            class: 'q-layout__shadow absolute-full overflow-hidden no-pointer-events'
          })
        )
      }

      child.push(
        hDir(
          'aside',
          { ref: 'content', class: classes.value, style: style.value },
          content,
          'contentclose',
          props.noSwipeClose !== true && belowBreakpoint.value === true,
          () => contentCloseDirective.value
        )
      )

      return h('div', { class: 'q-drawer-container' }, child)
    }
  }
})
