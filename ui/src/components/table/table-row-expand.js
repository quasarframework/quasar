function getVal (val) {
  return Array.isArray(val)
    ? val.slice()
    : []
}

export default {
  props: {
    expanded: Array // sync
  },

  data () {
    return {
      innerExpanded: getVal(this.expanded)
    }
  },

  watch: {
    expanded (val) {
      this.innerExpanded = getVal(val)
    }
  },

  methods: {
    isRowExpanded (key) {
      return this.innerExpanded.includes(key)
    },

    setExpanded (val) {
      if (this.expanded !== void 0) {
        this.$emit('update:expanded', val)
      }
      else {
        this.innerExpanded = val
      }
    },

    __updateExpanded (key, add) {
      const target = this.innerExpanded.slice()
      const index = target.indexOf(key)

      if (add === true) {
        if (index === -1) {
          target.push(key)
          this.setExpanded(target)
        }
      }
      else if (index !== -1) {
        target.splice(index, 1)
        this.setExpanded(target)
      }
    }
  }
}
