export default {
  props: {
    color: String,
    size: {
      type: [Number, String],
      default: '1rem'
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
