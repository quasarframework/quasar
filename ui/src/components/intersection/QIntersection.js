import { h, defineComponent, withDirectives, Transition } from 'vue'

import { onSSR } from '../../plugins/Platform.js'

import Intersection from '../../directives/Intersection.js'

import TagMixin from '../../mixins/tag.js'

import { slot } from '../../utils/slot.js'

export default defineComponent({
  name: 'QIntersection',

  mixins: [ TagMixin ],

  props: {
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
      if (this.disable !== true && (onSSR !== true || this.once !== true || this.ssrPrerender !== true)) {
        return [[
          Intersection,
          this.value,
          void 0,
          { once: this.once }
        ]]
      }
    }
  },

  methods: {
    __trigger (entry) {
      if (this.showing !== entry.isIntersecting) {
        this.showing = entry.isIntersecting

        if (this.qListeners.visibility !== void 0) {
          this.$emit('visibility', this.showing)
        }
      }
    }
  },

  render () {
    const content = this.showing === true
      ? [ h('div', { key: 'content' }, slot(this, 'default')) ]
      : void 0

    const node = h(this.tag, {
      class: 'q-intersection'
    }, this.transition
      ? [
        h(Transition, {
          name: 'q-transition--' + this.transition
        }, content)
      ]
      : content
    )

    return this.directives !== void 0
      ? withDirectives(node, this.directives)
      : node
  }
})
