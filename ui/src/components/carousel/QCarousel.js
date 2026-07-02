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

const navigationPositionOptions = ['top', 'right', 'bottom', 'left']
const controlTypeOptions = ['regular', 'flat', 'outline', 'push', 'unelevated']

/**
 * @api component
 * @docsUrl https://v2.quasar.dev/vue-components/carousel
 */
/**
 * Suggestion: QCarouselSlide
 *
 * @api slot default
 */

/**
 * Slot specific for QCarouselControl
 *
 * @api slot control
 */

/**
 * Slot for navigation icon/btn; Suggestion: QBtn
 *
 * @api slot navigation-icon
 * @scope index {Number} The 0-based index of corresponding slide
 * @scope maxIndex {Number} The available number of slides
 * @scope name {Any} The name of the corresponding slide
 * @scope active {Boolean} Is this the current slide?
 * @scope btnProps {Object} Default QBtn props that can be binded to your own QBtn
 * @scope onClick {Function} Default trigger when clicked/tapped on
 */
export default createComponent({
  name: 'QCarousel',

  props: {
    ...useDarkProps,
    ...usePanelProps,
    ...useFullscreenProps,

    /**
     * @api prop transition-prev
     * @default 'fade'
     */
    transitionPrev: {
      // usePanelParentProps override
      type: String,
      default: 'fade'
    },
    /**
     * @api prop transition-next
     * @default 'fade'
     */
    transitionNext: {
      // usePanelParentProps override
      type: String,
      default: 'fade'
    },

    /**
     * Height of Carousel in CSS units, including unit name
     *
     * @api prop height
     * @extends size
     */
    height: String,
    /**
     * Applies a default padding to each slide, according to the usage of 'arrows' and 'navigation' props
     *
     * @api prop padding
     * @type {Boolean}
     * @category content
     */
    padding: Boolean,

    /**
     * Color name for QCarousel button controls (arrows, navigation) from the Quasar Color Palette
     *
     * @api prop control-color
     * @extends color
     */
    controlColor: String,
    /**
     * Color name for text color of QCarousel button controls (arrows, navigation) from the Quasar Color Palette
     *
     * @api prop control-text-color
     * @extends color
     */
    controlTextColor: String,
    /**
     * Type of button to use for controls (arrows, navigation)
     *
     * @api prop control-type
     * @type {String}
     * @default 'flat'
     * @category style
     */
    controlType: {
      type: String,
      validator: v => controlTypeOptions.includes(v),
      default: 'flat'
    },

    /**
     * Jump to next slide (if 'true' or val > 0) or previous slide (if val < 0) at fixed time intervals (in milliseconds); 'false' disables autoplay, 'true' enables it for 5000ms intervals
     *
     * @api prop autoplay
     * @type {Number|Boolean}
     * @category behavior
     * @example true
     * @example false
     * @example 2500
     */
    autoplay: [Number, Boolean],

    /**
     * Show navigation arrow buttons
     *
     * @api prop arrows
     * @type {Boolean}
     * @category content
     */
    arrows: Boolean,
    /**
     * @api prop prev-icon
     * @extends icon
     */
    prevIcon: String,
    /**
     * @api prop next-icon
     * @extends icon
     */
    nextIcon: String,

    /**
     * Show navigation dots
     *
     * @api prop navigation
     * @type {Boolean}
     * @category content
     */
    navigation: Boolean,
    /**
     * Side to stick navigation to
     *
     * @api prop navigation-position
     * @type {String}
     * @default # 'bottom'/'right'
     * @category content
     */
    navigationPosition: {
      type: String,
      validator: v => navigationPositionOptions.includes(v)
    },
    /**
     * @api prop navigation-icon
     * @extends icon
     */
    navigationIcon: String,
    /**
     * Icon name following Quasar convention for the active (current slide) navigation icon; Make sure you have the icon library installed unless you are using 'img:' prefix
     *
     * @api prop navigation-active-icon
     * @extends icon
     */
    navigationActiveIcon: String,

    /**
     * Show thumbnails
     *
     * @api prop thumbnails
     * @type {Boolean}
     * @category content
     */
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
      const duration = isNumber(props.autoplay)
        ? Math.abs(props.autoplay)
        : 5000

      if (timer !== null) clearTimeout(timer)
      timer = setTimeout(() => {
        timer = null

        if (duration >= 0) {
          nextPanel()
        } else {
          previousPanel()
        }
      }, duration)
    }

    onMounted(() => {
      if (props.autoplay) startTimer()
    })

    onBeforeUnmount(() => {
      if (timer !== null) clearTimeout(timer)
    })

    function getNavigationContainer(type, mapping) {
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
              class: 'q-carousel__navigation-inner flex flex-center no-wrap'
            },
            getEnabledPanels().map(mapping)
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
          getNavigationContainer('buttons', (panel, index) => {
            const name = panel.props.name
            const active = panelIndex.value === index

            return fn({
              index,
              maxIndex,
              name,
              active,
              btnProps: {
                icon: active ? navActiveIcon.value : navIcon.value,
                size: 'sm',
                ...controlProps.value
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
          getNavigationContainer('thumbnails', panel => {
            const slide = panel.props

            return h('img', {
              key: 'tmb#' + slide.name,
              class:
                `q-carousel__thumbnail q-carousel__thumbnail--${slide.name === props.modelValue ? '' : 'in'}active` +
                color,
              src: slide.imgSrc || slide['img-src'],
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
