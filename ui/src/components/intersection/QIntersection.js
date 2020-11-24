import { h, defineComponent, Transition } from 'vue'

import { isRuntimeSsrPreHydration } from '../../plugins/Platform.js'

import EmitListenersMixin from '../../mixins/emit-listeners.js'

import Intersection from '../../directives/Intersection.js'

import { hSlot, hDir } from '../../utils/render.js'

export default defineComponent({
  name: 'QIntersection',

  mixins: [ EmitListenersMixin ],

  props: {
    tag: {
      type: String,
      default: 'div'
    },

    once: Boolean,
    transition: String,

    ssrPrerender: Boolean,

    margin: String,
    threshold: [ Number, Array ],
    root: {
      default: null
    },

    disable: Boolean
  },

  emits: [ 'visibility' ],

  data () {
    return {
      showing: isRuntimeSsrPreHydration === true ? this.ssrPrerender : false
    }
  },

  computed: {
    value () {
      return this.margin !== void 0 || this.threshold !== void 0
        ? {
            handler: this.__trigger,
            cfg: {
              root: this.root,
              rootMargin: this.margin,
              threshold: this.threshold
            }
          }
        : this.__trigger
    },

    hasDirective () {
      return this.disable !== true && (isRuntimeSsrPreHydration !== true || this.once !== true || this.ssrPrerender !== true)
    },

    directives () {
      // if this.hasDirective === true
      return [ [
        Intersection,
        this.value,
        void 0,
        { once: this.once }
      ] ]
    }
  },

  methods: {
    __trigger (entry) {
      if (this.showing !== entry.isIntersecting) {
        this.showing = entry.isIntersecting
        this.emitListeners.onVisibility === true && this.$emit('visibility', this.showing)
      }
    },

    __getContent () {
      return this.showing === true
        ? [ h('div', { key: 'content' }, hSlot(this, 'default')) ]
        : void 0
    }
  },

  render () {
    const child = this.transition
      ? [
          h(Transition, {
            name: 'q-transition--' + this.transition
          }, this.__getContent)
        ]
      : this.__getContent()

    return hDir(
      this.tag,
      { class: 'q-intersection' },
      child,
      'main',
      this.hasDirective,
      () => this.directives
    )
  }
})
