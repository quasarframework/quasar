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

export default createComponent({
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
