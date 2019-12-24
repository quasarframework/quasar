import Vue from 'vue'

import mixin from './skeleton-mixin.js'

export default Vue.extend({
  name: 'QSkeletonCode',

  mixins: [
    mixin
  ],

  computed: {
    computedWidth () {
      return 400
    },
    computedHeight () {
      return 90
    }
  },

  methods: {
    __renderDefault (h) {
      const options = [
        { x: 0, y: 0, rx: 3, ry: 3, width: 20, height: 10 },
        { x: 30, y: 0, rx: 3, ry: 3, width: 300, height: 10 },
        { x: 340, y: 0, rx: 3, ry: 3, width: 10, height: 10 },

        { x: 15, y: 20, rx: 3, ry: 3, width: 130, height: 10 },
        { x: 155, y: 20, rx: 3, ry: 3, width: 200, height: 10 },

        { x: 15, y: 40, rx: 3, ry: 3, width: 90, height: 10 },
        { x: 115, y: 40, rx: 3, ry: 3, width: 60, height: 10 },
        { x: 185, y: 40, rx: 3, ry: 3, width: 120, height: 10 },

        { x: 15, y: 60, rx: 3, ry: 3, width: 150, height: 10 },
        { x: 175, y: 60, rx: 3, ry: 3, width: 200, height: 10 },

        { x: 0, y: 80, rx: 3, ry: 3, width: 10, height: 10 }
      ]
      return options.map(option => this.__renderDefaultItem(h, option))
    }
  }
})
