export default {
  props: {
    color: String,
    size: {
      type: [Number, String],
      default: '1em'
    }
  },
  computed: {
    classes () {
      if (this.color) {
        return `text-${this.color}`
      }
    }
  }
}
