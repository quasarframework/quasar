import Vue from 'vue'

import { onSSR } from '../../plugins/Platform.js'

import Intersection from '../../directives/Intersection.js'

import TagMixin from '../../mixins/tag.js'
import ListenersMixin from '../../mixins/listeners.js'

import { slot } from '../../utils/slot.js'

export default Vue.extend({
  name: 'QIntersection',

  mixins: [ TagMixin, ListenersMixin ],

  directives: {
    Intersection
  },

  props: {
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
            root: this.root,
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

        if (this.qListeners.visibility !== void 0) {
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
      on: { ...this.qListeners },
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
