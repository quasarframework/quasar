export default {
  props: {
    ratio: [ String, Number ]
  },

  computed: {
    ratioStyle () {
      const ratio = this.ratio || this.$data.naturalRatio

      if (ratio !== void 0) {
        return { paddingBottom: `${100 / ratio}%` }
      }
    }
  }
}
