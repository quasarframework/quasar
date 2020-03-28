import Vue from 'vue'

import Intersection from '../../directives/Intersection.js'
import TagMixin from '../../mixins/tag.js'
import { slot } from '../../utils/slot.js'
import { onSSR } from '../../plugins/Platform.js'

export default Vue.extend({
  name: 'QIntersection',

  mixins: [ TagMixin ],

  directives: {
    Intersection
  },

  props: {
    once: Boolean,
    transition: String,

    ssrPrerender: Boolean,

    margin: String,
    threshold: [ Number, Array ],

    disable: Boolean
  },

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
        return [{
          name: 'intersection',
          value: this.value,
          modifiers: {
            once: this.once
          }
        }]
      }
    }
  },

  methods: {
    __trigger (entry) {
      if (this.showing !== entry.isIntersecting) {
        this.showing = entry.isIntersecting

        if (this.$listeners.visibility !== void 0) {
          this.$emit('visibility', this.showing)
        }
      }
    }
  },

  render (h) {
    const content = this.showing === true
      ? [ h('div', { key: 'content' }, slot(this, 'default')) ]
      : void 0

    return h(this.tag, {
      staticClass: 'q-intersection',
      on: this.$listeners,
      directives: this.directives
    }, this.transition
      ? [
        h('transition', {
          props: { name: 'q-transition--' + this.transition }
        }, content)
      ]
      : content
    )
  }
})
