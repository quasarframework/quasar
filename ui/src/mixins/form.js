import { h } from 'vue'

export default {
  props: {
    name: String
  },

  computed: {
    formAttrs () {
      return {
        type: 'hidden',
        name: this.name,
        value: this.modelValue
      }
    }
  },

  methods: {
    __injectFormInput (child, action, className) {
      child[action](
        h('input', {
          class: 'hidden' + (className || ''),
          ...this.formAttrs,
          ...this.formDomProps
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
