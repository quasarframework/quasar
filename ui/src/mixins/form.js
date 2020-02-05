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
    __injectFormInput (h, child, action, staticClass) {
      child[action](
        h('input', {
          staticClass,
          attrs: this.formAttrs
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
