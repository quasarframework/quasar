import Vue from 'vue'

import mixin from './skeleton-mixin.js'

export default Vue.extend({
  name: 'QSkeletonTwitch',

  mixins: [
    mixin
  ],

  computed: {
    computedWidth () {
      return 400
    },
    computedHeight () {
      return 225
    }
  },

  methods: {
    __renderDefault (h) {
      const options = [
        { x: 0, y: 0, rx: 3, ry: 3, width: 400, height: 170 },
        { x: 0, y: 180, rx: 3, ry: 3, width: 35, height: 45 },
        { x: 45, y: 180, rx: 3, ry: 3, width: 150, height: 15 },
        { x: 45, y: 200, rx: 3, ry: 3, width: 100, height: 10 }
      ]
      return options.map(option => this.__renderDefaultItem(h, option))
    }
  }
})
