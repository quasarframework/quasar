import {
  computed,
  getCurrentInstance,
  h,
  onBeforeUnmount,
  onMounted,
  watch
} from 'vue'

import QBtn from '../btn/QBtn.js'

import useDark, {
  useDarkProps
} from '../../composables/private.use-dark/use-dark.js'
import usePanel, {
  usePanelEmits,
  usePanelProps
} from '../../composables/private.use-panel/use-panel.js'
import useFullscreen, {
  useFullscreenEmits,
  useFullscreenProps
} from '../../composables/private.use-fullscreen/use-fullscreen.js'

import { createComponent } from '../../utils/private.create/create.js'
import { isNumber } from '../../utils/is/is.js'
import { hDir, hMergeSlot } from '../../utils/private.render/render.js'
import { stopAndPrevent } from '../../utils/event/event.js'

const navigationPositionOptions = ['top', 'right', 'bottom', 'left']
const controlTypeOptions = ['regular', 'flat', 'outline', 'push', 'unelevated']

export default /*#__PURE__*/ createComponent({
  name: 'QCarousel',

  props: {
    ...useDarkProps,
    ...usePanelProps,
    ...useFullscreenProps,

    transitionPrev: {
      // usePanelParentProps override
      type: String,
      default: 'fade'
    },
    transitionNext: {
      // usePanelParentProps override
      type: String,
      default: 'fade'
    },

    height: String,
    padding: Boolean,

    controlColor: String,
    controlTextColor: String,
    controlType: {
      type: String,
      validator: v => controlTypeOptions.includes(v),
      default: 'flat'
    },

    autoplay: [Number, Boolean],

    arrows: Boolean,
    prevIcon: String,
    nextIcon: String,

    navigation: Boolean,
    navigationPosition: {
      type: String,
      validator: v => navigationPositionOptions.includes(v)
    },
    navigationIcon: String,
    navigationActiveIcon: String,

    thumbnails: Boolean
  },

  emits: [...useFullscreenEmits, ...usePanelEmits],

  setup(props, { slots }) {
    const {
      proxy: { $q }
    } = getCurrentInstance()

    const isDark = useDark(props, $q)

    let timer = null,
      panelsLen

    const {
      updatePanelsList,
      updatePanelIndex,
      getPanelContent,
      panelDirectives,
      goToPanel,
      previousPanel,
      nextPanel,
      getEnabledPanels,
      panelIndex
    } = usePanel()

    const { inFullscreen } = useFullscreen()

    const style = computed(() =>
      !inFullscreen.value && props.height !== void 0
        ? { height: props.height }
        : {}
    )

    const direction = computed(() =>
      props.vertical ? 'vertical' : 'horizontal'
    )

    const navigationPosition = computed(
      () => props.navigationPosition || (props.vertical ? 'right' : 'bottom')
    )

    const classes = computed(
      () =>
        `q-carousel q-panel-parent q-carousel--with${props.padding ? '' : 'out'}-padding` +
        (inFullscreen.value ? ' fullscreen' : '') +
        (isDark.value ? ' q-carousel--dark q-dark' : '') +
        (props.arrows ? ` q-carousel--arrows-${direction.value}` : '') +
        (props.navigation
          ? ` q-carousel--navigation-${navigationPosition.value}`
          : '')
    )

    const arrowIcons = computed(() => {
      const ico = [
        props.prevIcon || $q.iconSet.carousel[props.vertical ? 'up' : 'left'],
        props.nextIcon || $q.iconSet.carousel[props.vertical ? 'down' : 'right']
      ]

      return !props.vertical && $q.lang.rtl ? ico.reverse() : ico
    })

    const navIcon = computed(
      () => props.navigationIcon || $q.iconSet.carousel.navigationIcon
    )
    const navActiveIcon = computed(
      () => props.navigationActiveIcon || navIcon.value
    )

    const controlProps = computed(() => ({
      color: props.controlColor,
      textColor: props.controlTextColor,
      round: true,
      [props.controlType]: true,
      dense: true
    }))

    watch(
      () => props.modelValue,
      () => {
        if (props.autoplay) {
          startTimer()
        }
      }
    )

    watch(
      () => props.autoplay,
      val => {
        if (val) {
          startTimer()
        } else if (timer !== null) {
          clearTimeout(timer)
          timer = null
        }
      }
    )

    function startTimer() {
      // a negative value means "walk backwards",
      // so the sign picks the direction while its
      // absolute value is the interval
      const interval = isNumber(props.autoplay) ? props.autoplay : 5000

      if (timer !== null) clearTimeout(timer)
      timer = setTimeout(() => {
        timer = null

        if (interval >= 0) {
          nextPanel()
        } else {
          previousPanel()
        }
      }, Math.abs(interval))
    }

    onMounted(() => {
      if (props.autoplay) startTimer()
    })

    onBeforeUnmount(() => {
      if (timer !== null) clearTimeout(timer)
    })

    // WAI-ARIA tabbed carousel pattern: arrow keys move both focus and
    // selection inside the navigation tablist, wrapping around; Home/End
    // jump to the first/last slide
    function onNavigationKeydown(e) {
      if (e.altKey || e.metaKey) return

      const list = getEnabledPanels()
      const len = list.length
      if (len === 0) return

      let target

      if (e.keyCode === 36) {
        // Home
        target = 0
      } else if (e.keyCode === 35) {
        // End
        target = len - 1
      } else {
        const dirPrev =
          e.keyCode === (props.vertical ? 38 /* ArrowUp */ : 37) /* ArrowLeft */
        const dirNext =
          e.keyCode ===
          (props.vertical ? 40 /* ArrowDown */ : 39) /* ArrowRight */

        if (!dirPrev && !dirNext) return

        const dir =
          (dirNext ? 1 : -1) *
          (!props.vertical && $q.lang.rtl === true ? -1 : 1)
        const index = list.findIndex(
          panel => panel.props.name === props.modelValue
        )

        target =
          index === -1 ? (dir === 1 ? 0 : len - 1) : (index + dir + len) % len
      }

      stopAndPrevent(e)

      const { name } = list[target].props
      if (name !== props.modelValue) goToPanel(name)

      // selection follows focus
      e.currentTarget.children[target]?.focus()
    }

    function getNavigationContainer(type, mapping) {
      const panelList = getEnabledPanels()

      // the single Tab stop of the tablist (roving tabindex):
      // the active element, or the first one when none is active
      const activeIndex = panelList.findIndex(
        panel => panel.props.name === props.modelValue
      )
      const tabStopIndex = activeIndex === -1 ? 0 : activeIndex

      return h(
        'div',
        {
          class:
            'q-carousel__control q-carousel__navigation no-wrap absolute flex' +
            ` q-carousel__navigation--${type} q-carousel__navigation--${navigationPosition.value}` +
            (props.controlColor !== void 0 ? ` text-${props.controlColor}` : '')
        },
        [
          h(
            'div',
            {
              class: 'q-carousel__navigation-inner flex flex-center no-wrap',
              role: 'tablist',
              'aria-orientation': props.vertical ? 'vertical' : 'horizontal',
              onKeydown: onNavigationKeydown
            },
            panelList.map((panel, index) =>
              mapping(panel, index, index === tabStopIndex)
            )
          )
        ]
      )
    }

    function getContent() {
      const node = []

      if (props.navigation) {
        const fn =
          slots['navigation-icon'] !== void 0
            ? slots['navigation-icon']
            : opts =>
                h(QBtn, {
                  key: 'nav' + opts.name,
                  class: `q-carousel__navigation-icon q-carousel__navigation-icon--${opts.active === true ? '' : 'in'}active`,
                  ...opts.btnProps,
                  onClick: opts.onClick
                })

        const maxIndex = panelsLen - 1
        node.push(
          getNavigationContainer('buttons', (panel, index, isTabStop) => {
            const name = panel.props.name
            const active = name === props.modelValue

            return fn({
              index,
              maxIndex,
              name,
              active,
              btnProps: {
                icon: active ? navActiveIcon.value : navIcon.value,
                size: 'sm',
                ...controlProps.value,
                role: 'tab',
                'aria-selected': active ? 'true' : 'false',
                'aria-label': String(name),
                tabindex: isTabStop ? 0 : -1
              },
              onClick: () => {
                goToPanel(name)
              }
            })
          })
        )
      } else if (props.thumbnails) {
        const color =
          props.controlColor !== void 0 ? ` text-${props.controlColor}` : ''

        node.push(
          getNavigationContainer('thumbnails', (panel, _, isTabStop) => {
            const slide = panel.props
            const active = slide.name === props.modelValue

            return h('img', {
              key: 'tmb#' + slide.name,
              class:
                `q-carousel__thumbnail q-carousel__thumbnail--${active ? '' : 'in'}active` +
                color,
              src: slide.imgSrc || slide['img-src'],
              role: 'tab',
              'aria-selected': active ? 'true' : 'false',
              'aria-label': String(slide.name),
              tabindex: isTabStop ? 0 : -1,
              onClick: () => {
                goToPanel(slide.name)
              }
            })
          })
        )
      }

      if (props.arrows && panelIndex.value >= 0) {
        if (props.infinite || panelIndex.value > 0) {
          node.push(
            h(
              'div',
              {
                key: 'prev',
                class: `q-carousel__control q-carousel__arrow q-carousel__prev-arrow q-carousel__prev-arrow--${direction.value} absolute flex flex-center`
              },
              [
                h(QBtn, {
                  icon: arrowIcons.value[0],
                  ...controlProps.value,
                  onClick: previousPanel
                })
              ]
            )
          )
        }

        if (props.infinite || panelIndex.value < panelsLen - 1) {
          node.push(
            h(
              'div',
              {
                key: 'next',
                class:
                  'q-carousel__control q-carousel__arrow q-carousel__next-arrow' +
                  ` q-carousel__next-arrow--${direction.value} absolute flex flex-center`
              },
              [
                h(QBtn, {
                  icon: arrowIcons.value[1],
                  ...controlProps.value,
                  onClick: nextPanel
                })
              ]
            )
          )
        }
      }

      return hMergeSlot(slots.control, node)
    }

    return () => {
      panelsLen = updatePanelsList(slots)
      updatePanelIndex()

      return h(
        'div',
        {
          class: classes.value,
          style: style.value
        },
        [
          hDir(
            'div',
            { class: 'q-carousel__slides-container' },
            getPanelContent(),
            'sl-cont',
            props.swipeable,
            () => panelDirectives.value
          ),
          ...getContent()
        ]
      )
    }
  }
})
