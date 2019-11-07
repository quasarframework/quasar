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

    imgClass: [ Array, String, Object ],

    noDefaultSpinner: Boolean,
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
    },

    attrs () {
      const att = { role: 'img' }
      if (this.alt !== void 0) {
        att['aria-label'] = this.alt
      }
      return att
    }
  },

  methods: {
    __onLoad (img) {
      this.isLoading = false
      this.hasError = false
      this.__computeRatio(img)
      this.__updateSrc()
      this.__updateWatcher(this.srcset)
      this.$emit('load', this.currentSrc)
    },

    __onError (err) {
      clearTimeout(this.ratioTimer)
      this.isLoading = false
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
      clearTimeout(this.ratioTimer)
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
        if (this.image === img && this.destroyed !== true) {
          this.__onError(err)
        }
      }

      img.onload = () => {
        if (this.destroyed === true) {
          return
        }

        // if we are still rendering same image
        if (this.image === img) {
          if (img.decode !== void 0) {
            img
              .decode()
              .catch(err => {
                if (this.image === img && this.destroyed !== true) {
                  this.__onError(err)
                }
              })
              .then(() => {
                if (this.image === img && this.destroyed !== true) {
                  this.__onLoad(img)
                }
              })
          }
          else {
            this.__onLoad(img)
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
    },

    __computeRatio (img) {
      const { naturalHeight, naturalWidth } = img

      if (naturalHeight || naturalWidth) {
        this.naturalRatio = naturalHeight === 0
          ? 1
          : naturalWidth / naturalHeight
      }
      else {
        this.ratioTimer = setTimeout(() => {
          if (this.image === img && this.destroyed !== true) {
            this.__computeRatio(img)
          }
        }, 100)
      }
    },

    __getImage (h) {
      const content = this.url !== void 0 ? h('div', {
        key: this.url,
        staticClass: 'q-img__image absolute-full',
        class: this.imgClass,
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
        }, this.$scopedSlots.loading !== void 0
          ? this.$scopedSlots.loading()
          : (this.noDefaultSpinner === false
            ? [
              h(QSpinner, {
                props: {
                  color: this.spinnerColor,
                  size: this.spinnerSize
                }
              })
            ]
            : null
          )
        )
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
      attrs: this.attrs,
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
    this.destroyed = true
    clearTimeout(this.ratioTimer)
    this.unwatch !== void 0 && this.unwatch()
  }
})
