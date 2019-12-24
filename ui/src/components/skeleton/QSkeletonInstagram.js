import Vue from 'vue'

import mixin from './skeleton-mixin.js'

export default Vue.extend({
  name: 'QSkeletonInstagram',

  mixins: [
    mixin
  ],

  computed: {
    computedWidth () {
      return 400
    },
    computedHeight () {
      return 470
    }
  },

  methods: {
    __renderDefault (h) {
      const options = [
        { x: 75, y: 13, rx: 4, ry: 4, width: 100, height: 13 },
        { x: 75, y: 37, rx: 4, ry: 4, width: 50, height: 8 },
        { x: 0, y: 70, rx: 5, ry: 5, width: 400, height: 400 }
      ]
      return [
        h('circle', {
          attrs: {
            cx: 30,
            cy: 30,
            r: 30
          }
        }),
        ...options.map(option => this.__renderDefaultItem(h, option))
      ]
    }
  }
})
