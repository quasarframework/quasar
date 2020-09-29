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
        ? 'left' // TODO vue3 (this.vertical === true ? 'stretch' : 'left')
        : this.align

      return /* ${TODO vue3 this.vertical === true ? 'items' : 'justify'} */ `justify-${alignMap[align]}`
    }
  }
}
