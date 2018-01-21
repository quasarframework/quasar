const alignMap = {
  left: 'start',
  center: 'center',
  right: 'end',
  between: 'between',
  around: 'around'
}

export default {
  props: {
    align: {
      type: String,
      default: 'center',
      validator: v => ['left', 'right', 'center', 'between', 'around'].includes(v)
    }
  },
  computed: {
    alignClass () {
      return `justify-${alignMap[this.align]}`
    }
  }
}
