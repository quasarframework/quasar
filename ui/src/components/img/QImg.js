import { h, defineComponent, ref, computed, watch, onBeforeMount, onBeforeUnmount, Transition } from 'vue'

import QSpinner from '../spinner/QSpinner.js'

import useQuasar from '../../composables/use-quasar.js'
import useRatio, { useRatioProps } from '../../composables/use-ratio.js'

import { hSlot } from '../../utils/composition-render.js'

export default defineComponent({
  name: 'QImg',

  props: {
    ...useRatioProps,

    src: String,
    srcset: String,
    sizes: String,
    alt: String,
    width: String,
    height: String,

    placeholderSrc: String,

    basic: Boolean,
    contain: Boolean,
    position: {
      type: String,
      default: '50% 50%'
    },

    transition: {
      type: String,
      default: 'fade'
    },

    imgClass: [ Array, String, Object ],
    imgStyle: Object,

    nativeContextMenu: Boolean,

    noDefaultSpinner: Boolean,
    spinnerColor: String,
    spinnerSize: String
  },

  emits: [ 'load', 'error' ],

  setup (props, { slots, emit }) {
    const $q = useQuasar()

    const naturalRatio = ref(null)

    const { ratioStyle } = useRatio(props, naturalRatio)

    const currentSrc = ref('')
    const image = ref(null)
    const isLoading = ref(!!props.src)
    const hasError = ref(false)

    const url = computed(() => currentSrc.value || props.placeholderSrc || void 0)

    const imgContainerStyle = computed(() => Object.assign(
      {
        backgroundSize: props.contain === true ? 'contain' : 'cover',
        backgroundPosition: props.position
      },
      props.imgStyle,
      { backgroundImage: `url("${url.value}")` }
    ))

    const style = computed(() => ({
      width: props.width,
      height: props.height
    }))

    const classes = computed(() =>
      'q-img overflow-hidden' +
      (props.nativeContextMenu === true ? ' q-img--menu' : '')
    )

    let ratioTimer, destroyed = false, unwatch

    onBeforeUnmount(() => {
      destroyed = true
      clearTimeout(ratioTimer)
      unwatch !== void 0 && unwatch()
    })

    function updateWatcher (srcset) {
      if (srcset) {
        if (unwatch === void 0) {
          unwatch = watch(() => $q.screen.width, updateSrc)
        }
      }
      else if (unwatch !== void 0) {
        unwatch()
        unwatch = void 0
      }
    }

    onBeforeMount(() => {
      if (props.placeholderSrc !== void 0 && props.ratio === void 0) {
        const img = new Image()
        img.src = props.placeholderSrc
        computeRatio(img)
      }

      isLoading.value === true && load()
    })

    watch(() => props.src, load)
    watch(() => props.srcset, updateWatcher)

    function onLoad (img) {
      isLoading.value = false
      hasError.value = false
      computeRatio(img)
      updateSrc()
      updateWatcher(props.srcset)
      emit('load', currentSrc.value)
    }

    function onError (err) {
      clearTimeout(ratioTimer)
      isLoading.value = false
      hasError.value = true
      currentSrc.value = ''
      emit('error', err)
    }

    function updateSrc () {
      if (image.value !== void 0 && isLoading.value === false) {
        const src = image.value.currentSrc || image.value.src
        if (currentSrc.value !== src) {
          currentSrc.value = src
        }
      }
    }

    function computeRatio (img) {
      const { naturalHeight, naturalWidth } = img

      if (naturalHeight || naturalWidth) {
        naturalRatio.value = naturalHeight === 0
          ? 1
          : naturalWidth / naturalHeight
      }
      else {
        ratioTimer = setTimeout(() => {
          if (image.value === img && destroyed !== true) {
            computeRatio(img)
          }
        }, 100)
      }
    }

    function load () {
      clearTimeout(ratioTimer)
      hasError.value = false

      if (!props.src) {
        isLoading.value = false
        image.value = void 0
        currentSrc.value = ''
        return
      }

      isLoading.value = true

      const img = new Image()
      image.value = img

      img.onerror = err => {
        // if we are still rendering same image
        if (image.value === img && destroyed !== true) {
          onError(err)
        }
      }

      img.onload = () => {
        if (destroyed === true) {
          return
        }

        // if we are still rendering same image
        if (image.value === img) {
          if (img.decode !== void 0) {
            img
              .decode()
              .catch(err => {
                if (image.value === img && destroyed !== true) {
                  onError(err)
                }
              })
              .then(() => {
                if (image.value === img && destroyed !== true) {
                  onLoad(img)
                }
              })
          }
          else {
            onLoad(img)
          }
        }
      }

      img.src = props.src

      if (props.srcset) {
        img.srcset = props.srcset
      }

      if (props.sizes !== void 0) {
        img.sizes = props.sizes
      }
      else {
        Object.assign(img, {
          height: props.height,
          width: props.width
        })
      }
    }

    function getImage () {
      const nativeImg = props.nativeContextMenu === true
        ? [
            h('img', {
              class: 'absolute-full fit',
              src: url.value,
              'aria-hidden': 'true'
            })
          ]
        : void 0

      const content = url.value !== void 0
        ? h('div', {
            key: url.value,
            class: [ 'q-img__image absolute-full', props.imgClass ],
            style: imgContainerStyle.value
          }, nativeImg)
        : null

      return props.basic === true
        ? content
        : h(Transition, {
          name: 'q-transition--' + props.transition
        }, () => content)
    }

    function getContentSlot () {
      return hSlot(slots[hasError.value === true ? 'error' : 'default'])
    }

    function getContent () {
      if (props.basic === true) {
        return h('div', {
          key: 'content',
          class: 'q-img__content absolute-full'
        }, getContentSlot())
      }

      if (isLoading.value === true) {
        return h('div', {
          key: 'placeholder',
          class: 'q-img__loading absolute-full flex flex-center'
        }, slots.loading !== void 0
          ? slots.loading()
          : (
              props.noDefaultSpinner === false
                ? [
                    h(QSpinner, {
                      color: props.spinnerColor,
                      size: props.spinnerSize
                    })
                  ]
                : void 0
            )
        )
      }

      return h('div', {
        key: 'content',
        class: 'q-img__content absolute-full'
      }, getContentSlot())
    }

    return () => h('div', {
      class: classes.value,
      style: style.value,
      role: 'img',
      'aria-label': props.alt
    }, [
      h('div', { style: ratioStyle.value }),
      getImage(),
      h(Transition, { name: 'q-transition--fade' }, getContent)
    ])
  }
})
