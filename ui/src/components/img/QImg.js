import {
  Transition,
  computed,
  getCurrentInstance,
  h,
  onMounted,
  ref,
  shallowRef,
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

// This only gets assigned Boolean false as
// value, so we can re-use it
const defaultIsSsrImage = { value: false }

function getNaturalRatio(target) {
  return target.naturalHeight === 0
    ? 0.5
    : target.naturalWidth / target.naturalHeight
}

export default /*#__PURE__*/ createComponent({
  name: 'QImg',

  props: {
    ...useRatioProps,

    src: String,
    srcset: String,
    sizes: String,

    alt: String,
    crossorigin: String,
    decoding: String,
    referrerpolicy: String,

    draggable: Boolean,

    loading: {
      type: String,
      default: 'lazy'
    },
    loadingShowDelay: {
      type: [Number, String],
      default: 0
    },

    fetchpriority: {
      type: String,
      default: 'auto'
    },
    width: String,
    height: String,
    initialRatio: [Number, String],

    placeholderSrc: String,
    errorSrc: String,

    fit: {
      type: String,
      default: 'cover'
    },
    position: {
      type: String,
      default: '50% 50%'
    },

    imgClass: String,
    imgStyle: Object,

    noSpinner: Boolean,
    noNativeMenu: Boolean,
    noTransition: Boolean,
    ssrPrerender: Boolean,

    spinnerColor: String,
    spinnerSize: String
  },

  emits: ['load', 'error'],

  setup(props, { slots, emit }) {
    const naturalRatio = ref(props.initialRatio || defaultRatio)
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

    // the image is server-rendered when its box shape does not depend on
    // the (not yet known) natural ratio, or when the user opts in
    // accepting the box change at hydration; the pre-hydration client
    // must start from the same state as the server so both render the
    // same tree
    let ssrImgRef = null
    const isSsrImage =
      isRuntimeSsrPreHydration.value &&
      (props.ssrPrerender ||
        Boolean(props.ratio || props.height || props.initialRatio)) &&
      Boolean(props.src || props.srcset || props.sizes)
        ? ref(true)
        : defaultIsSsrImage

    if (isSsrImage.value) {
      // the server-rendered image element, for the hydration reconcile
      ssrImgRef = shallowRef(null)
      // on top of the placeholder (the containers stack in DOM order), so
      // the placeholder shows through only until the image paints
      position.value = 1
      images[0].value = placeholderImg.value
      images[1].value = getImgProps()
    }

    let ratioRafId = null

    const classes = computed(
      () => `q-img q-img--${props.noNativeMenu ? 'no-' : ''}menu`
    )

    const style = computed(() => ({
      width: props.width,
      height: props.height,
      ...ratioStyle.value
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

    function getImgProps() {
      return props.src || props.srcset || props.sizes
        ? {
            src: props.src,
            srcset: props.srcset,
            sizes: props.sizes
          }
        : null
    }

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
      naturalRatio.value = getNaturalRatio(target)

      // WebKit derives an SVG's naturalWidth/naturalHeight from the img's
      // current CSS box, so a load event racing layout can report the
      // initial-ratio box's shape instead of the file's; the getters
      // become intrinsic-consistent after a frame renders (#15652)
      if (ratioRafId !== null) {
        cancelAnimationFrame(ratioRafId)
      }
      ratioRafId = requestAnimationFrame(() => {
        ratioRafId = requestAnimationFrame(() => {
          ratioRafId = null
          if (vmIsDestroyed(vm)) return

          const ratio = getNaturalRatio(target)
          // the box-derived getters carry sub-pixel quantization noise,
          // so only a meaningful drift is a misreported ratio
          if (Math.abs(ratio - naturalRatio.value) > naturalRatio.value / 100) {
            naturalRatio.value = ratio
          }
        })
      })

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

      isSsrImage.value = false
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

      isSsrImage.value = false
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
        // always emit alt: an absent attribute makes the image unnamed,
        // whereas alt="" correctly marks it decorative
        alt: props.alt !== void 0 ? props.alt : '',
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

        if (isSsrImage.value) {
          // a server-rendered image is visible from the first paint, like
          // a native <img>, rather than faded in once loaded
          data.class += ' q-img__image--loaded'
          data.ref = ssrImgRef
        }
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
      const watchSrc = immediate => {
        watch(
          getImgProps,
          imgProps => {
            removeLoadTimeout()
            isSsrImage.value = false
            hasError.value = false

            if (imgProps === null) {
              clearLoading()
              images[position.value ^ 1].value = placeholderImg.value
            } else {
              setLoading()
            }

            images[position.value].value = imgProps
          },
          { immediate }
        )
      }

      if (isRuntimeSsrPreHydration.value) {
        onMounted(() => {
          const hasSsrImage = isSsrImage.value

          if (hasSsrImage) {
            // the image has been loading since the HTML was parsed, so its
            // load/error event may have fired before hydration attached
            // the listeners; the element's state is the source of truth
            // (a settled failure reports a zero natural size, a loaded
            // dimensionless SVG does not)
            const img = ssrImgRef.value

            if (img.complete) {
              if (img.naturalWidth === 0) {
                onError(new Event('error'))
              } else {
                onLoad({ target: img })
              }
            } else {
              setLoading()
            }
          }

          watchSrc(!hasSsrImage)
        })
      } else {
        watchSrc(true)
      }
    }

    return () => {
      const content = []

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
          // the img role requires an accessible name, so it is only claimed
          // when "alt" actually provides one; alt="" is the native way to
          // mark an image decorative, so it leaves the wrapper neutral too
          ...(props.alt ? { role: 'img', 'aria-label': props.alt } : {})
        },
        content
      )
    }
  }
})
