import { sizes } from '../../mixins/size.js'
import ListenersMixin from '../../mixins/listeners.js'

export default {
  mixins: [ ListenersMixin ],

  props: {
    color: String,
    size: {
      type: [Number, String],
      default: '1em'
    }
  },

  computed: {
    cSize () {
      return this.size in sizes
        ? `${sizes[this.size]}px`
        : this.size
    },

    classes () {
      if (this.color) {
        return `text-${this.color}`
      }
    }
  }
}
