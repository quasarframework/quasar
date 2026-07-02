import { h, onBeforeUnmount, onMounted, ref, watch } from 'vue'

import { createComponent } from '../../utils/private.create/create.js'
import { height, offset } from '../../utils/dom/dom.js'
import frameDebounce from '../../utils/frame-debounce/frame-debounce.js'
import { getScrollTarget, scrollTargetProp } from '../../utils/scroll/scroll.js'
import { hSlot } from '../../utils/private.render/render.js'
import { listenOpts } from '../../utils/event/event.js'

const { passive } = listenOpts
const mediaEvents = ['load', 'loadstart', 'loadedmetadata']

/**
 * @api component
 * @docsUrl https://v2.quasar.dev/vue-components/parallax
 */
/**
 * Default slot can be used for content that gets displayed on top of the component
 *
 * @api slot default
 */

/**
 * Slot for describing <img> or <video> tags
 *
 * @api slot media
 */

/**
 * Scoped slot for describing content that gets displayed on top of the component; If specified, it overrides the default slot
 *
 * @api slot content
 * @scope percentScrolled {Number} Percentage (0.0 < x < 1.0) of scroll in regards to QParallax
 */
export default createComponent({
  name: 'QParallax',

  props: {
    /**
     * Path to image (unless a 'media' slot is used)
     *
     * @api prop src
     * @type {String}
     * @category model
     * @example # (public folder) src="img/something.png"
     * @example # (assets folder) src="~@/assets/my-img.png"
     * @example # (relative path format) :src="require('./my_img.jpg')"
     */
    src: String,
    /**
     * Height of component (in pixels)
     *
     * @api prop height
     * @type {Number}
     * @default 500
     * @category style
     */
    height: {
      type: Number,
      default: 500
    },
    /**
     * Speed of parallax effect (0.0 < x < 1.0)
     *
     * @api prop speed
     * @type {Number}
     * @default 1
     * @category behavior
     */
    speed: {
      type: Number,
      default: 1,
      validator: v => v >= 0 && v <= 1
    },

    /**
     * @api prop scroll-target
     * @extends scroll-target
     */
    scrollTarget: scrollTargetProp,

    onScroll: Function
  },

  setup(props, { slots, emit }) {
    const percentScrolled = ref(0)
    const rootRef = ref(null)
    const mediaParentRef = ref(null)
    const mediaRef = ref(null)

    let isWorking = false,
      mediaEl,
      mediaHeight,
      resizeHandler,
      observer,
      localScrollTarget

    watch(
      () => props.height,
      () => {
        if (isWorking) updatePos()
      }
    )

    watch(
      () => props.scrollTarget,
      () => {
        if (isWorking) {
          stop()
          start()
        }
      }
    )

    let update = percentage => {
      percentScrolled.value = percentage
      if (props.onScroll !== void 0) emit('scroll', percentage)
    }

    function updatePos() {
      let containerTop, containerHeight, containerBottom

      if (localScrollTarget === window) {
        containerTop = 0
        containerBottom = containerHeight = window.innerHeight
      } else {
        containerTop = offset(localScrollTarget).top
        containerHeight = height(localScrollTarget)
        containerBottom = containerTop + containerHeight
      }

      const top = offset(rootRef.value).top
      const bottom = top + props.height

      if (
        observer !== void 0 ||
        (bottom > containerTop && top < containerBottom)
      ) {
        const percent =
          (containerBottom - top) / (props.height + containerHeight)
        setPos((mediaHeight - props.height) * percent * props.speed)
        update(percent)
      }
    }

    let setPos = newOffset => {
      // apply it immediately without any delay
      mediaEl.style.transform = `translate3d(-50%,${Math.round(newOffset)}px,0)`
    }

    function onResize() {
      mediaHeight =
        mediaEl.naturalHeight || mediaEl.videoHeight || height(mediaEl)

      if (isWorking) updatePos()
    }

    function start() {
      isWorking = true
      localScrollTarget = getScrollTarget(rootRef.value, props.scrollTarget)
      localScrollTarget.addEventListener('scroll', updatePos, passive)
      window.addEventListener('resize', resizeHandler, passive)
      updatePos()
    }

    function stop() {
      if (isWorking) {
        isWorking = false
        localScrollTarget.removeEventListener('scroll', updatePos, passive)
        window.removeEventListener('resize', resizeHandler, passive)
        localScrollTarget = void 0
        setPos.cancel()
        update.cancel()
        resizeHandler.cancel()
      }
    }

    onMounted(() => {
      setPos = frameDebounce(setPos)
      update = frameDebounce(update)
      resizeHandler = frameDebounce(onResize)

      mediaEl =
        slots.media !== void 0
          ? mediaParentRef.value.children[0]
          : mediaRef.value

      mediaEvents.forEach(evtName => {
        mediaEl.addEventListener(evtName, onResize)
      })

      onResize()
      mediaEl.style.display = 'initial'

      if (window.IntersectionObserver !== void 0) {
        observer = new IntersectionObserver(entries => {
          const fn = entries[0].isIntersecting ? start : stop
          fn()
        })

        observer.observe(rootRef.value)
      } else {
        start()
      }
    })

    onBeforeUnmount(() => {
      stop()
      observer?.disconnect()
      mediaEvents.forEach(evtName => {
        mediaEl.removeEventListener(evtName, onResize)
      })
    })

    return () =>
      h(
        'div',
        {
          ref: rootRef,
          class: 'q-parallax',
          style: { height: `${props.height}px` }
        },
        [
          h(
            'div',
            {
              ref: mediaParentRef,
              class: 'q-parallax__media absolute-full'
            },
            slots.media !== void 0
              ? slots.media()
              : [
                  h('img', {
                    ref: mediaRef,
                    src: props.src
                  })
                ]
          ),

          h(
            'div',
            { class: 'q-parallax__content absolute-full column flex-center' },
            slots.content !== void 0
              ? slots.content({ percentScrolled: percentScrolled.value })
              : hSlot(slots.default)
          )
        ]
      )
  }
})
