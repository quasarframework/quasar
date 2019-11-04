import Vue from 'vue'

import Intersection from '../../directives/Intersection.js'
import slot from '../../utils/slot.js'

export default Vue.extend({
  name: 'QIntersection',

  directives: {
    Intersection
  },

  props: {
    once: Boolean,
    margin: String,
    threshold: [ Number, Array ],
    transition: String
  },

  data () {
    return {
      showing: false
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
    }
  },

  methods: {
    __trigger (entry) {
      if (this.showing !== entry.isIntersecting) {
        this.showing = entry.isIntersecting
      }
    }
  },

  render (h) {
    const content = this.showing === true
      ? [ h('div', { key: 'content' }, slot(this, 'default')) ]
      : void 0

    return h('div', {
      staticClass: 'q-intersection',
      directives: [{
        name: 'intersection',
        value: this.value,
        modifiers: {
          once: this.once
        }
      }]
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
