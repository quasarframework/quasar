<template lang="pug">
q-list
  q-item-label.row.text-uppercase.q-gutter-md.items-center(header)
    div {{ name }}
    q-icon.edit__icon.cursor-pointer(name="edit" v-if="hasVariables")
      q-menu
        variable-list(:variables="computedVariables" @input="onVariableChange")
  q-item
    q-item-section
      slot
</template>

<script>

import VariableList from './VariableList'

export default {
  components: {
    VariableList
  },

  props: {
    name: String,
    variables: [Array, Object]
  },

  computed: {
    computedVariables () {
      if (Array.isArray(this.variables)) {
        return Object.assign({}, ...this.variables)
      }
      return this.variables || {}
    },
    hasVariables () {
      return Object.keys(this.computedVariables).length > 0
    }
  },

  methods: {
    onVariableChange (variable, value) {
      this.$emit('input', variable, value)
    }
  }
}

</script>

<style lang="sass">

.edit__icon
  font-size: 1.2rem

</style>
