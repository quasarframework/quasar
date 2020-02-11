export default {
  props: {
    name: String
  },

  computed: {
    formAttrs () {
      return {
        type: 'hidden',
        name: this.name,
        value: this.value
      }
    }
  },

  methods: {
    __injectFormInput (child, action, className) {
      child[action](
        this.$createElement('input', {
          staticClass: 'hidden',
          class: className,
          attrs: this.formAttrs
        })
      )
    }
  }
}

export const FormRadioMixin = {
  props: {
    name: String
  },

  computed: {
    formDomProps () {
      if (this.name !== void 0 && this.isTrue === true) {
        return {
          checked: true
        }
      }
    }
  },

  methods: {
    __injectFormInput (child, action, className) {
      child[action](
        this.$createElement('input', {
          staticClass: 'hidden',
          class: className,
          attrs: this.formAttrs,
          domProps: this.formDomProps
        })
      )
    }
  }
}

export const FormFieldMixin = {
  props: {
    name: String
  },

  computed: {
    nameProp () {
      return this.name || this.for
    }
  }
}
