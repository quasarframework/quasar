import {
  Transition,
  computed,
  getCurrentInstance,
  h,
  onMounted,
  ref,
  watch
} from 'vue'

import QSpinner from '../spinner/QSpinner.js'

import { isRuntimeSsrPreHydration } from '../../plugins/platform/Platform.js'
import useRatio, {
  useRatioProps
} from '../../composables/private.use-ratio/use-ratio.js'

import { createComponent } from '../../utils/private.create/create.js'
import { hSlot } from '../../utils/private.render/render.js'
import { vmIsDestroyed } from '../../utils/private.vm/vm.js'
import useTimeout from '../../composables/use-timeout/use-timeout.js'

const defaultRatio = 1.7778 /* 16/9 */

/**
 * @api component
 * @docsUrl https://v2.quasar.dev/vue-components/img
 */
/**
 * Default slot can be used for captions. See examples
 *
 * @api slot default
 */

/**
 * While image is loading, this slot is being displayed on top of the component; Suggestions: a spinner or text
 *
 * @api slot loading
 */

/**
 * Optional slot to be used when image could not be loaded; make sure you assign a min-height and min-width to the component through CSS
 *
 * @api slot error
 */
export default createComponent({
  name: 'QImg',

  props: {
    ...useRatioProps,

    /**
     * Path to image
     *
     * @api prop src
     * @type {String}
     * @category model
     * @example # (public folder) src="img/something.png"
     * @example # (assets folder) src="~@/assets/my-img.gif"
     * @example # (relative path format) :src="require('./my_img.jpg')"
     */
    src: String,
    /**
     * Same syntax as <img> srcset attribute
     *
     * @api prop srcset
     * @type {String}
     * @category model
     * @example 'elva-fairy-320w.jpg 320w, elva-fairy-480w.jpg 480w'
     */
    srcset: String,
    /**
     * Same syntax as <img> sizes attribute
     *
     * @api prop sizes
     * @type {String}
     * @category model
     * @example '(max-width: 320px) 280px, (max-width: 480px) 440px, 800px'
     */
    sizes: String,

    /**
     * Specifies an alternate text for the image, if the image cannot be displayed
     *
     * @api prop alt
     * @type {String}
     * @category miscellaneous
     * @example 'Two cats'
     */
    alt: String,
    /**
     * Same syntax as <img> crossorigin attribute
     *
     * @api prop crossorigin
     * @type {String}
     * @category behavior
     */
    crossorigin: String,
    /**
     * Same syntax as <img> decoding attribute
     *
     * @api prop decoding
     * @type {String}
     * @category behavior
     */
    decoding: String,
    /**
     * Same syntax as <img> referrerpolicy attribute
     *
     * @api prop referrerpolicy
     * @type {String}
     * @category behavior
     */
    referrerpolicy: String,

    /**
     * Adds the native 'draggable' attribute
     *
     * @api prop draggable
     * @type {Boolean}
     * @category miscellaneous
     */
    draggable: Boolean,

    /**
     * Lazy or immediate load; Same syntax as <img> loading attribute
     *
     * @api prop loading
     * @type {String}
     * @default 'lazy'
     * @category behavior
     */
    loading: {
      type: String,
      default: 'lazy'
    },
    /**
     * Delay showing the spinner when image changes; Gives time for the browser to load the image from cache to prevent flashing the spinner unnecessarily; Value should represent milliseconds
     *
     * @api prop loading-show-delay
     * @type {Number|String}
     * @default 0
     * @category behavior
     * @added-in v2.14.6
     * @example 500
     * @example '700'
     */
    loadingShowDelay: {
      type: [Number, String],
      default: 0
    },

    /**
     * Provides a hint of the relative priority to use when fetching the image
     *
     * @api prop fetchpriority
     * @type {String}
     * @default 'auto'
     * @category behavior
     * @added-in v2.6.6
     */
    fetchpriority: {
      type: String,
      default: 'auto'
    },
    /**
     * Forces image width; Must also include the unit (px or %)
     *
     * @api prop width
     * @type {String}
     * @category style
     * @example '280px'
     * @example '70%'
     */
    width: String,
    /**
     * Forces image height; Must also include the unit (px or %)
     *
     * @api prop height
     * @type {String}
     * @category style
     * @example '280px'
     * @example '70%'
     */
    height: String,
    /**
     * Use it when not specifying 'ratio' but still wanting an initial aspect ratio
     *
     * @api prop initial-ratio
     * @type {String|Number}
     * @default 1.7778
     * @category style
     * @example # (Number format) :initial-ratio="16/9"
     * @example # (String format) initial-ratio="1"
     */
    initialRatio: {
      type: [Number, String],
      default: defaultRatio
    },

    /**
     * While waiting for your image to load, you can use a placeholder image
     *
     * @api prop placeholder-src
     * @type {String}
     * @category model
     * @example # (public folder) placeholder-src="img/some-placeholder.png"
     * @example # (assets folder) placeholder-src="~@/assets/my-placeholder.gif"
     * @example # (relative path format) :placeholder-src="require('./placeholder.jpg')"
     */
    placeholderSrc: String,
    /**
     * In case your image fails to load, you can use an error image
     *
     * @api prop error-src
     * @type {String}
     * @category model
     * @added-in v2.15
     * @example # (public folder) error-src="img/some-placeholder.png"
     * @example # (assets folder) error-src="~@/assets/my-placeholder.gif"
     * @example # (relative path format) :error-src="require('./placeholder.jpg')"
     */
    errorSrc: String,

    /**
     * How the image will fit into the container; Equivalent of the object-fit prop; Can be coordinated with 'position' prop
     *
     * @api prop fit
     * @type {String}
     * @default 'cover'
     * @category style
     */
    fit: {
      type: String,
      default: 'cover'
    },
    /**
     * The alignment of the image into the container; Equivalent of the object-position CSS prop
     *
     * @api prop position
     * @type {String}
     * @default '50% 50%'
     * @category style
     * @example '0 0'
     * @example '20px 50px'
     */
    position: {
      type: String,
      default: '50% 50%'
    },

    /**
     * CSS classes to be attributed to the native img element
     *
     * @api prop img-class
     * @type {String}
     * @category style
     * @example 'my-special-class'
     */
    imgClass: String,
    /**
     * Apply CSS to the native img element
     *
     * @api prop img-style
     * @type {Object}
     * @ts-type VueStyleObjectProp
     * @category style
     * @example { transform: 'rotate(45deg)' }
     */
    imgStyle: Object,

    /**
     * Do not display the default spinner while waiting for the image to be loaded; It is overriden by the 'loading' slot when one is present
     *
     * @api prop no-spinner
     * @type {Boolean}
     * @category behavior
     */
    noSpinner: Boolean,
    /**
     * Disables the native context menu for the image
     *
     * @api prop no-native-menu
     * @type {Boolean}
     * @category behavior
     */
    noNativeMenu: Boolean,
    /**
     * Disable default transition when switching between old and new image
     *
     * @api prop no-transition
     * @type {Boolean}
     * @category behavior
     */
    noTransition: Boolean,

    /**
     * Color name for default Spinner (unless using a 'loading' slot)
     *
     * @api prop spinner-color
     * @extends color
     * @category style
     */
    spinnerColor: String,
    /**
     * Size in CSS units, including unit name, for default Spinner (unless using a 'loading' slot)
     *
     * @api prop spinner-size
     * @extends size
     * @category style
     */
    spinnerSize: String
  },

  emits: ['load', 'error'],

  setup(props, { slots, emit }) {
    const naturalRatio = ref(props.initialRatio)
    const ratioStyle = useRatio(props, naturalRatio)
    const vm = getCurrentInstance()

    const {
      registerTimeout: registerLoadTimeout,
      removeTimeout: removeLoadTimeout
    } = useTimeout()
    const {
      registerTimeout: registerLoadShowTimeout,
      removeTimeout: removeLoadShowTimeout
    } = useTimeout()

    const placeholderImg = computed(() =>
      props.placeholderSrc !== void 0 ? { src: props.placeholderSrc } : null
    )

    const errorImg = computed(() =>
      props.errorSrc !== void 0 ? { src: props.errorSrc, __qerror: true } : null
    )

    const images = [ref(null), ref(placeholderImg.value)]

    const position = ref(0)

    const isLoading = ref(false)
    const hasError = ref(false)

    const classes = computed(
      () => `q-img q-img--${props.noNativeMenu ? 'no-' : ''}menu`
    )

    const style = computed(() => ({
      width: props.width,
      height: props.height
    }))

    const imgClass = computed(
      () =>
        `q-img__image ${props.imgClass !== void 0 ? props.imgClass + ' ' : ''}` +
        `q-img__image--with${props.noTransition ? 'out' : ''}-transition` +
        ' q-img__image--'
    )

    const imgStyle = computed(() => ({
      ...props.imgStyle,
      objectFit: props.fit,
      objectPosition: props.position
    }))

    function setLoading() {
      removeLoadShowTimeout()

      if (props.loadingShowDelay === 0) {
        isLoading.value = true
        return
      }

      registerLoadShowTimeout(() => {
        isLoading.value = true
      }, props.loadingShowDelay)
    }

    function clearLoading() {
      removeLoadShowTimeout()
      isLoading.value = false
    }

    function onLoad({ target }) {
      if (vmIsDestroyed(vm)) return

      removeLoadTimeout()

      naturalRatio.value =
        target.naturalHeight === 0
          ? 0.5
          : target.naturalWidth / target.naturalHeight

      waitForCompleteness(target, 1)
    }

    function waitForCompleteness(target, count) {
      // protect against running forever
      if (count === 1000 || vmIsDestroyed(vm)) return

      if (target.complete) {
        onReady(target)
      } else {
        registerLoadTimeout(() => {
          waitForCompleteness(target, count + 1)
        }, 50)
      }
    }

    function onReady(target) {
      if (vmIsDestroyed(vm)) return

      position.value = position.value ^ 1
      images[position.value].value = null

      clearLoading()

      if (target.getAttribute('__qerror') !== 'true') {
        hasError.value = false
      }

      emit('load', target.currentSrc || target.src)
    }

    function onError(err) {
      removeLoadTimeout()
      clearLoading()

      hasError.value = true
      images[position.value].value = errorImg.value
      images[position.value ^ 1].value = placeholderImg.value

      emit('error', err)
    }

    function getImage(index) {
      const img = images[index].value

      const data = {
        key: 'img_' + index,
        class: imgClass.value,
        style: imgStyle.value,
        alt: props.alt,
        crossorigin: props.crossorigin,
        decoding: props.decoding,
        referrerpolicy: props.referrerpolicy,
        height: props.height,
        width: props.width,
        loading: props.loading,
        fetchpriority: props.fetchpriority,
        'aria-hidden': 'true',
        draggable: props.draggable,
        ...img
      }

      if (position.value === index) {
        Object.assign(data, {
          class: data.class + 'current',
          onLoad,
          onError
        })
      } else {
        data.class += 'loaded'
      }

      return h(
        'div',
        { class: 'q-img__container absolute-full', key: 'img' + index },
        h('img', data)
      )
    }

    function getContent() {
      if (!isLoading.value) {
        return h(
          'div',
          {
            key: 'content',
            class: 'q-img__content absolute-full q-anchor--skip'
          },
          hSlot(slots[hasError.value ? 'error' : 'default'])
        )
      }

      return h(
        'div',
        {
          key: 'loading',
          class: 'q-img__loading absolute-full flex flex-center'
        },
        slots.loading !== void 0
          ? slots.loading()
          : props.noSpinner
            ? void 0
            : [
                h(QSpinner, {
                  color: props.spinnerColor,
                  size: props.spinnerSize
                })
              ]
      )
    }

    if (!__QUASAR_SSR_SERVER__) {
      const watchSrc = () => {
        watch(
          () =>
            props.src || props.srcset || props.sizes
              ? {
                  src: props.src,
                  srcset: props.srcset,
                  sizes: props.sizes
                }
              : null,
          imgProps => {
            removeLoadTimeout()
            hasError.value = false

            if (imgProps === null) {
              clearLoading()
              images[position.value ^ 1].value = placeholderImg.value
            } else {
              setLoading()
            }

            images[position.value].value = imgProps
          },
          { immediate: true }
        )
      }

      if (isRuntimeSsrPreHydration.value) {
        onMounted(watchSrc)
      } else {
        watchSrc()
      }
    }

    return () => {
      const content = []

      if (ratioStyle.value !== null) {
        content.push(h('div', { key: 'filler', style: ratioStyle.value }))
      }

      if (images[0].value !== null) {
        content.push(getImage(0))
      }

      if (images[1].value !== null) {
        content.push(getImage(1))
      }

      content.push(h(Transition, { name: 'q-transition--fade' }, getContent))

      return h(
        'div',
        {
          key: 'main',
          class: classes.value,
          style: style.value,
          role: 'img',
          'aria-label': props.alt
        },
        content
      )
    }
  }
})
