import Vue from 'vue'

import mixin from './skeleton-mixin.js'

export default Vue.extend({
  name: 'QSkeletonTable',

  mixins: [
    mixin
  ],

  props: {
    rows: {
      type: [Number, String],
      default: 5
    },
    columns: {
      type: [Number, String],
      default: 5
    }
  },

  computed: {
    computedWidth () {
      return ((this.columns - 1) * 20) + 10 + (this.columns * 100)
    },
    computedHeight () {
      return (this.rows * 30) - 20
    }
  },

  methods: {
    __xPos (column) {
      return 5 + ((column - 1) * 100) + ((column - 1) * 20)
    },
    __yPos (row) {
      return (row - 1) * 30
    },
    __renderDefault (h) {
      if (parseInt(this.rows, 10) > 0 && parseInt(this.columns, 10) > 0) {
        return [...Array(parseInt(this.rows, 10))]
          .map((_, r) => {
            return [...Array(parseInt(this.columns, 10))]
              .map((_, c) => {
                return [
                  h('rect', {
                    id: r + '_' + c,
                    attrs: {
                      x: this.__xPos(c + 1),
                      y: this.__yPos(r + 1),
                      rx: 3,
                      ry: 3,
                      width: 100,
                      height: 10
                    }
                  }),
                  c === this.columns - 1 && r < this.rows && h('rect', {
                    id: r + '_sep',
                    attrs: {
                      x: 0,
                      y: this.__yPos(r + 1) + 20,
                      rx: 3,
                      ry: 3,
                      width: this.computedWidth,
                      height: 1
                    }
                  })
                ]
              })
          })
      }
    }
  }
})
