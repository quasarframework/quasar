import Vue from 'vue'

import mixin from './skeleton-mixin.js'

export default Vue.extend({
  name: 'QSkeletonFacebook',

  mixins: [
    mixin
  ],

  computed: {
    computedWidth () {
      return 400
    },
    computedHeight () {
      return 130
    }
  },

  methods: {
    __renderDefault (h) {
      const options = [
        { x: 0, y: 0, rx: 5, ry: 5, width: 70, height: 70 },
        { x: 80, y: 17, rx: 4, ry: 4, width: 300, height: 13 },
        { x: 80, y: 40, rx: 3, ry: 3, width: 250, height: 10 },
        { x: 0, y: 80, rx: 3, ry: 3, width: 350, height: 10 },
        { x: 0, y: 100, rx: 3, ry: 3, width: 400, height: 10 },
        { x: 0, y: 120, rx: 3, ry: 3, width: 360, height: 10 }
      ]
      return options.map(option => this.__renderDefaultItem(h, option))
    }
  }
})
