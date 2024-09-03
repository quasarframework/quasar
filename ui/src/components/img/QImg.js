import { h, ref, computed, watch, onMounted, Transition, getCurrentInstance } from 'vue'

import QSpinner from '../spinner/QSpinner.js'

import { isRuntimeSsrPreHydration } from '../../plugins/platform/Platform.js'
import useRatio, { useRatioProps } from '../../composables/private.use-ratio/use-ratio.js'

import { createComponent } from '../../utils/private.create/create.js'
import { hSlot } from '../../utils/private.render/render.js'
import { vmIsDestroyed } from '../../utils/private.vm/vm.js'
import useTimeout from '../../composables/use-timeout/use-timeout.js'

const defaultRatio = 1.7778 /* 16/9 */

export default createComponent({
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
      type: [ Number, String ],
      default: 0
    },

    fetchpriority: {
      type: String,
      default: 'auto'
    },
    width: String,
    height: String,
    initialRatio: {
      type: [ Number, String ],
      default: defaultRatio
    },

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

    spinnerColor: String,
    spinnerSize: String
  },

  emits: [ 'load', 'error' ],

  setup (props, { slots, emit }) {
    const naturalRatio = ref(props.initialRatio)
    const ratioStyle = useRatio(props, naturalRatio)
    const vm = getCurrentInstance()

    const { registerTimeout: registerLoadTimeout, removeTimeout: removeLoadTimeout } = useTimeout()
    const { registerTimeout: registerLoadShowTimeout, removeTimeout: removeLoadShowTimeout } = useTimeout()

    const placeholderImg = computed(() => (
      props.placeholderSrc !== void 0
        ? { src: props.placeholderSrc }
        : null
    ))

    const errorImg = computed(() => (
      props.errorSrc !== void 0
        ? { src: props.errorSrc, __qerror: true }
        : null
    ))

    const images = [
      ref(null),
      ref(placeholderImg.value)
    ]

    const position = ref(0)

    const isLoading = ref(false)
    const hasError = ref(false)

    const classes = computed(() =>
      `q-img q-img--${ props.noNativeMenu === true ? 'no-' : '' }menu`
    )

    const style = computed(() => ({
      width: props.width,
      height: props.height
    }))

    const imgClass = computed(() =>
      `q-img__image ${ props.imgClass !== void 0 ? props.imgClass + ' ' : '' }`
      + `q-img__image--with${ props.noTransition === true ? 'out' : '' }-transition`
      + ' q-img__image--'
    )

    const imgStyle = computed(() => ({
      ...props.imgStyle,
      objectFit: props.fit,
      objectPosition: props.position
    }))

    function setLoading () {
      removeLoadShowTimeout()

      if (props.loadingShowDelay === 0) {
        isLoading.value = true
        return
      }

      registerLoadShowTimeout(() => {
        isLoading.value = true
      }, props.loadingShowDelay)
    }

    function clearLoading () {
      removeLoadShowTimeout()
      isLoading.value = false
    }

    function onLoad ({ target }) {
      if (vmIsDestroyed(vm) === false) {
        removeLoadTimeout()

        naturalRatio.value = target.naturalHeight === 0
          ? 0.5
          : target.naturalWidth / target.naturalHeight

        waitForCompleteness(target, 1)
      }
    }

    function waitForCompleteness (target, count) {
      // protect against running forever
      if (count === 1000 || vmIsDestroyed(vm) === true) return

      if (target.complete === true) {
        onReady(target)
      }
      else {
        registerLoadTimeout(() => {
          waitForCompleteness(target, count + 1)
        }, 50)
      }
    }

    function onReady (target) {
      if (vmIsDestroyed(vm) === true) return

      position.value = position.value ^ 1
      images[ position.value ].value = null

      clearLoading()

      if (target.getAttribute('__qerror') !== 'true') {
        hasError.value = false
      }

      emit('load', target.currentSrc || target.src)
    }

    function onError (err) {
      removeLoadTimeout()
      clearLoading()

      hasError.value = true
      images[ position.value ].value = errorImg.value
      images[ position.value ^ 1 ].value = placeholderImg.value

      emit('error', err)
    }

    function getImage (index) {
      const img = images[ index ].value

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
      }
      else {
        data.class += 'loaded'
      }

      return h(
        'div',
        { class: 'q-img__container absolute-full', key: 'img' + index },
        h('img', data)
      )
    }

    function getContent () {
      if (isLoading.value === false) {
        return h('div', {
          key: 'content',
          class: 'q-img__content absolute-full q-anchor--skip'
        }, hSlot(slots[ hasError.value === true ? 'error' : 'default' ]))
      }

      return h('div', {
        key: 'loading',
        class: 'q-img__loading absolute-full flex flex-center'
      }, (
        slots.loading !== void 0
          ? slots.loading()
          : (
              props.noSpinner === true
                ? void 0
                : [
                    h(QSpinner, {
                      color: props.spinnerColor,
                      size: props.spinnerSize
                    })
                  ]
            )
      ))
    }

    if (__QUASAR_SSR_SERVER__ !== true) {
      function watchSrc () {
        watch(
          () => (
            props.src || props.srcset || props.sizes
              ? {
                  src: props.src,
                  srcset: props.srcset,
                  sizes: props.sizes
                }
              : null
          ),
          imgProps => {
            removeLoadTimeout()
            hasError.value = false

            if (imgProps === null) {
              clearLoading()
              images[ position.value ^ 1 ].value = placeholderImg.value
            }
            else {
              setLoading()
            }

            images[ position.value ].value = imgProps
          },
          { immediate: true }
        )
      }

      if (isRuntimeSsrPreHydration.value === true) {
        onMounted(watchSrc)
      }
      else {
        watchSrc()
      }
    }

    return () => {
      const content = []

      if (ratioStyle.value !== null) {
        content.push(
          h('div', { key: 'filler', style: ratioStyle.value })
        )
      }

      if (images[ 0 ].value !== null) {
        content.push(
          getImage(0)
        )
      }

      if (images[ 1 ].value !== null) {
        content.push(
          getImage(1)
        )
      }

      content.push(
        h(Transition, { name: 'q-transition--fade' }, getContent)
      )

      return h('div', {
        key: 'main',
        class: classes.value,
        style: style.value,
        role: 'img',
        'aria-label': props.alt
      }, content)
    }
  }
})
