import Vue from 'vue'

import QSpinner from '../spinner/QSpinner.js'

import slot from '../../utils/slot.js'

export default Vue.extend({
  name: 'QImg',

  props: {
    src: String,
    srcset: String,
    sizes: String,
    alt: String,

    placeholderSrc: String,

    basic: Boolean,
    contain: Boolean,
    position: {
      type: String,
      default: '50% 50%'
    },
    ratio: [String, Number],
    transition: {
      type: String,
      default: 'fade'
    },

    spinnerColor: String,
    spinnerSize: String
  },

  data () {
    return {
      currentSrc: '',
      image: null,
      isLoading: !!this.src,
      hasError: false,
      naturalRatio: void 0
    }
  },

  watch: {
    src () {
      this.__load()
    },

    srcset (val) {
      this.__updateWatcher(val)
    }
  },

  computed: {
    aspectRatio () {
      return this.ratio || this.naturalRatio
    },

    padding () {
      return this.aspectRatio !== void 0
        ? (1 / this.aspectRatio) * 100 + '%'
        : void 0
    },

    url () {
      return this.currentSrc || this.placeholderSrc || void 0
    }
  },

  methods: {
    __onLoad () {
      this.__updateSrc()
      this.__updateWatcher(this.srcset)
      this.$emit('load', this.currentSrc)
    },

    __onError (err) {
      this.hasError = true
      this.currentSrc = ''
      this.$emit('error', err)
    },

    __updateSrc () {
      if (this.image !== void 0 && this.isLoading === false) {
        const src = this.image.currentSrc || this.image.src
        if (this.currentSrc !== src) {
          this.currentSrc = src
        }
      }
    },

    __updateWatcher (srcset) {
      if (srcset) {
        if (this.unwatch === void 0) {
          this.unwatch = this.$watch('$q.screen.width', this.__updateSrc)
        }
      }
      else if (this.unwatch !== void 0) {
        this.unwatch()
        this.unwatch = void 0
      }
    },

    __load () {
      clearTimeout(this.timer)
      this.hasError = false

      if (!this.src) {
        this.isLoading = false
        this.image = void 0
        this.currentSrc = ''
        return
      }

      this.isLoading = true

      const img = new Image()
      this.image = img

      img.onerror = err => {
        // if we are still rendering same image
        if (this.image === img) {
          this.isLoading = false
          this.__onError(err)
        }
      }

      img.onload = () => {
        // if we are still rendering same image
        if (this.image === img) {
          this.isLoading = false

          if (this.image.decode) {
            this.image
              .decode()
              .catch(this.__onError)
              .then(this.__onLoad)
          }
          else {
            this.__onLoad()
          }
        }
      }

      img.src = this.src

      if (this.srcset) {
        img.srcset = this.srcset
      }
      if (this.sizes) {
        img.sizes = this.sizes
      }

      this.__computeRatio(img)
    },

    __computeRatio (img) {
      const { naturalHeight, naturalWidth } = img

      if (naturalHeight || naturalWidth) {
        this.naturalRatio = naturalWidth / naturalHeight
      }
      else {
        this.timer = setTimeout(() => {
          this.__computeRatio(img)
        }, 100)
      }
    },

    __getImage (h) {
      const content = this.url !== void 0 ? h('div', {
        key: this.url,
        staticClass: 'q-img__image absolute-full',
        style: {
          backgroundImage: `url("${this.url}")`,
          backgroundSize: this.contain ? 'contain' : 'cover',
          backgroundPosition: this.position
        }
      }) : null

      return this.basic === true
        ? content
        : h('transition', {
          props: { name: 'q-transition--' + this.transition }
        }, [ content ])
    },

    __getContent (h) {
      const slotVm = slot(this, this.hasError === true ? 'error' : 'default')

      if (this.basic === true) {
        return h('div', {
          key: 'content',
          staticClass: 'q-img__content absolute-full'
        }, slotVm)
      }

      const content = this.isLoading === true
        ? h('div', {
          key: 'placeholder',
          staticClass: 'q-img__loading absolute-full flex flex-center'
        }, this.$scopedSlots.loading !== void 0 ? this.$scopedSlots.loading() : [
          h(QSpinner, {
            props: {
              color: this.spinnerColor,
              size: this.spinnerSize
            }
          })
        ])
        : h('div', {
          key: 'content',
          staticClass: 'q-img__content absolute-full'
        }, slotVm)

      return h('transition', {
        props: { name: 'q-transition--fade' }
      }, [ content ])
    }
  },

  render (h) {
    return h('div', {
      staticClass: 'q-img overflow-hidden',
      attrs: this.alt !== void 0 ? {
        role: 'img',
        'aria-label': this.alt
      } : null,
      on: this.$listeners
    }, [
      h('div', {
        style: { paddingBottom: this.padding }
      }),
      this.__getImage(h),
      this.__getContent(h)
    ])
  },

  beforeMount () {
    if (this.placeholderSrc !== void 0 && this.ratio === void 0) {
      const img = new Image()
      img.src = this.placeholderSrc
      this.__computeRatio(img)
    }
    this.isLoading === true && this.__load()
  },

  beforeDestroy () {
    clearTimeout(this.timer)
    this.unwatch !== void 0 && this.unwatch()
  }
})
