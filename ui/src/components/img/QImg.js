import { h, ref, computed, watch, onMounted, onBeforeUnmount, Transition } from 'vue'

import QSpinner from '../spinner/QSpinner.js'

import useRatio, { useRatioProps } from '../../composables/private/use-ratio.js'

import { createComponent } from '../../utils/private/create.js'
import { hSlot } from '../../utils/private/render.js'

const defaultRatio = 16 / 9

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

    let loadTimer = null, isDestroyed = false

    const images = [
      ref(null),
      ref(getPlaceholderSrc())
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
    )

    const imgStyle = computed(() => ({
      ...props.imgStyle,
      objectFit: props.fit,
      objectPosition: props.position
    }))

    watch(() => getCurrentSrc(), addImage)

    function getCurrentSrc () {
      return props.src || props.srcset || props.sizes
        ? {
            src: props.src,
            srcset: props.srcset,
            sizes: props.sizes
          }
        : null
    }

    function getPlaceholderSrc () {
      return props.placeholderSrc !== void 0
        ? { src: props.placeholderSrc }
        : null
    }

    function addImage (imgProps) {
      if (loadTimer !== null) {
        clearTimeout(loadTimer)
        loadTimer = null
      }

      hasError.value = false

      if (imgProps === null) {
        isLoading.value = false
        images[ position.value ^ 1 ].value = getPlaceholderSrc()
      }
      else {
        isLoading.value = true
      }

      images[ position.value ].value = imgProps
    }

    function onLoad ({ target }) {
      if (isDestroyed === true) { return }

      if (loadTimer !== null) {
        clearTimeout(loadTimer)
        loadTimer = null
      }

      naturalRatio.value = target.naturalHeight === 0
        ? 0.5
        : target.naturalWidth / target.naturalHeight

      waitForCompleteness(target, 1)
    }

    function waitForCompleteness (target, count) {
      // protect against running forever
      if (isDestroyed === true || count === 1000) { return }

      if (target.complete === true) {
        onReady(target)
      }
      else {
        loadTimer = setTimeout(() => {
          loadTimer = null
          waitForCompleteness(target, count + 1)
        }, 50)
      }
    }

    function onReady (img) {
      if (isDestroyed === true) { return }

      position.value = position.value ^ 1
      images[ position.value ].value = null
      isLoading.value = false
      hasError.value = false
      emit('load', img.currentSrc || img.src)
    }

    function onError (err) {
      if (loadTimer !== null) {
        clearTimeout(loadTimer)
        loadTimer = null
      }

      isLoading.value = false
      hasError.value = true
      images[ position.value ].value = null
      images[ position.value ^ 1 ].value = getPlaceholderSrc()
      emit('error', err)
    }

    function getImage (index) {
      const img = images[ index ].value

      const data = {
        key: 'img_' + index,
        class: imgClass.value,
        style: imgStyle.value,
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
        data.class += ' q-img__image--waiting'
        Object.assign(data, { onLoad, onError })
      }
      else {
        data.class += ' q-img__image--loaded'
      }

      return h(
        'div',
        { class: 'q-img__container absolute-full', key: 'img' + index },
        h('img', data)
      )
    }

    function getContent () {
      if (isLoading.value !== true) {
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
      if (__QUASAR_SSR_CLIENT__) {
        onMounted(() => {
          addImage(getCurrentSrc())
        })
      }
      else {
        addImage(getCurrentSrc())
      }

      onBeforeUnmount(() => {
        isDestroyed = true

        if (loadTimer !== null) {
          clearTimeout(loadTimer)
          loadTimer = null
        }
      })
    }

    return () => {
      const content = []

      if (ratioStyle.value !== null) {
        content.push(
          h('div', { key: 'filler', style: ratioStyle.value })
        )
      }

      if (hasError.value !== true) {
        if (images[ 0 ].value !== null) {
          content.push(getImage(0))
        }

        if (images[ 1 ].value !== null) {
          content.push(getImage(1))
        }
      }

      content.push(
        h(Transition, { name: 'q-transition--fade' }, getContent)
      )

      return h('div', {
        class: classes.value,
        style: style.value,
        role: 'img',
        'aria-label': props.alt
      }, content)
    }
  }
})
