export const sizes = {
  xs: 18,
  sm: 24,
  md: 32,
  lg: 38,
  xl: 46
}

export default {
  props: {
    size: String
  },

  computed: {
    sizeStyle () {
      if (this.size !== void 0) {
        return { fontSize: this.size in sizes ? `${sizes[this.size]}px` : this.size }
      }
    }
  }
}
