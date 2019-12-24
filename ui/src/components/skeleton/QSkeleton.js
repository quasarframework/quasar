import Vue from 'vue'

import mixin from './skeleton-mixin.js'

export default Vue.extend({
  name: 'QSkeleton',

  mixins: [
    mixin
  ],

  computed: {
    computedWidth () {
      return this.width
    },

    computedHeight () {
      return this.height
    }
  },

  methods: {
    __renderDefaultItem (h, option) {
      return h('rect', {
        attrs: {
          x: option.x,
          y: option.y,
          rx: option.rx,
          ry: option.ry,
          width: option.width,
          height: option.height
        }
      })
    },

    __renderDefault (h) {
      const options = [
        { x: 0, y: 0, rx: 3, ry: 3, width: 350, height: 10 },
        { x: 20, y: 20, rx: 3, ry: 3, width: 320, height: 10 },
        { x: 20, y: 40, rx: 3, ry: 3, width: 270, height: 10 },
        { x: 0, y: 60, rx: 3, ry: 3, width: 350, height: 10 },
        { x: 20, y: 80, rx: 3, ry: 3, width: 300, height: 10 },
        { x: 20, y: 100, rx: 3, ry: 3, width: 180, height: 10 }
      ]
      return options.map(option => this.__renderDefaultItem(h, option))
    }
  }
})
