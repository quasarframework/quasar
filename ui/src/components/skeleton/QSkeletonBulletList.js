import Vue from 'vue'

import mixin from './skeleton-mixin.js'

export default Vue.extend({
  name: 'QSkeletonBulletList',

  mixins: [
    mixin
  ],

  props: {
    rows: {
      type: [Number, String],
      default: 5
    }
  },

  computed: {
    computedWidth () {
      return 400
    },
    computedHeight () {
      return this.rows * 21
    }
  },

  methods: {
    __yPos (row, shift) {
      return shift + ((row - 1) * 22)
    },

    __renderDefault (h) {
      if (parseInt(this.rows, 10) > 0) {
        return [...Array(parseInt(this.rows, 10))]
          .map((_, i) => {
            return [
              h('circle', {
                key: i + '_c',
                attrs: {
                  cx: 8,
                  cy: this.__yPos(i + 1, 8),
                  r: 8
                }
              }),
              h('rect', {
                key: i + '_r',
                attrs: {
                  x: 22,
                  y: this.__yPos(i + 1, 3),
                  rx: 3,
                  ry: 3,
                  width: 378,
                  height: 9
                }
              })
            ]
          })
      }
    }
  }
})
