// this file will eventually be removed
// and superseeded by use-form.js
// after all components use composition api

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
    },

    formDomProps () {}
  },

  methods: {
    __injectFormInput (child, action, className) {
      child[ action ](
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
