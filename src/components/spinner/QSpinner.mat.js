import mixin from './spinner-mixin'

export default {
  name: 'QSpinnerMat',
  mixins: [mixin],
  render (h) {
    return h('svg', {
      staticClass: 'q-spinner q-spinner-mat',
      class: this.classes,
      attrs: {
        'width': this.size,
        'height': this.size,
        'viewBox': '25 25 50 50'
      }
    }, [
      h('circle', {
        staticClass: 'path',
        attrs: {
          'cx': '50',
          'cy': '50',
          'r': '20',
          'fill': 'none',
          'stroke': 'currentColor',
          'stroke-width': '3',
          'stroke-miterlimit': '10'
        }
      })
    ])
  }
}
