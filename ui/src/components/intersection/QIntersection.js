import { h, defineComponent, withDirectives, Transition } from 'vue'

import { onSSR } from '../../plugins/Platform.js'

import Intersection from '../../directives/Intersection.js'

import { slot } from '../../utils/slot.js'

export default defineComponent({
  name: 'QIntersection',

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

    disable: Boolean
  },

  emits: [ 'visibility' ],

  data () {
    return {
      showing: onSSR === true ? this.ssrPrerender : false
    }
  },

  computed: {
    value () {
      return this.margin !== void 0 || this.threshold !== void 0
        ? {
          handler: this.__trigger,
          cfg: {
            rootMargin: this.margin,
            threshold: this.threshold
          }
        }
        : this.__trigger
    },

    directives () {
      return this.disable !== true && (onSSR !== true || this.once !== true || this.ssrPrerender !== true)
        ? [[
          Intersection,
          this.value,
          void 0,
          { once: this.once }
        ]]
        : []
    }
  },

  methods: {
    __trigger (entry) {
      if (this.showing !== entry.isIntersecting) {
        this.showing = entry.isIntersecting
        this.$attrs.onVisibility !== void 0 && this.$emit('visibility', this.showing)
      }
    },

    __getContent () {
      return this.showing === true
        ? [ h('div', { key: 'content' }, slot(this, 'default')) ]
        : void 0
    }
  },

  render () {
    const node = h(this.tag, {
      class: 'q-intersection'
    }, this.transition
      ? [
        h(Transition, {
          name: 'q-transition--' + this.transition
        }, this.__getContent)
      ]
      : this.__getContent()
    )

    return withDirectives(node, this.directives)
  }
})
