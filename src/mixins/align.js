const
  alignMap = {
    left: 'start',
    center: 'center',
    right: 'end',
    between: 'between',
    around: 'around'
  },
  alignValues = Object.keys(alignMap)

export default {
  props: {
    align: {
      type: String,
      default: 'center',
      validator: v => alignValues.includes(v)
    }
  },
  computed: {
    alignClass () {
      return `justify-${alignMap[this.align]}`
    }
  }
}
