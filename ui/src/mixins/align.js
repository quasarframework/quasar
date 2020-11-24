const
  alignMap = {
    left: 'start',
    center: 'center',
    right: 'end',
    between: 'between',
    around: 'around',
    evenly: 'evenly',
    stretch: 'stretch'
  },
  alignValues = Object.keys(alignMap)

export default {
  props: {
    align: {
      type: String,
      validator: v => alignValues.includes(v)
    }
  },

  computed: {
    alignClass () {
      const align = this.align === void 0
        ? this.$props.vertical === true ? 'stretch' : 'left'
        : this.align

      return `${this.$props.vertical === true ? 'items' : 'justify'}-${alignMap[ align ]}`
    }
  }
}
