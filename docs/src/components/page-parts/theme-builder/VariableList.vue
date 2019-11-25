<template lang="pug">
q-list
  template(v-for="(categoryVariables, category) in parsedVariables")
    q-item-label.text-uppercase(
      v-if="showHeader"
      header
    ) {{ category }}
    component.col-12(
      v-for="(variable, name) in categoryVariables"
      :key="name"
      :is="variableComponent(variable)"
      :variable-name="`$${name}`"
      :variable="variable"
      :value="variable.value"
      @input="val => $emit('input', variable, val)"
    )
</template>

<script>

import { groupBy } from 'assets/page-utils'
import SizeVariableItem from './item/SizeVariableItem'
import TextVariableItem from './item/TextVariableItem'
import ColorVariableItem from './item/ColorVariableItem'
import SpacingVariableItem from './item/SpacingVariableItem'

export default {
  props: {
    variables: {
      type: Object,
      required: true
    }
  },

  computed: {
    parsedVariables () {
      return groupBy(this.variables, 'category', 'general')
    },
    showHeader () {
      return Object.keys(this.parsedVariables).length > 1
    }
  },

  methods: {
    variableComponent (variable) {
      switch (variable.type) {
        case 'Size':
          return SizeVariableItem
        case 'Color':
          return ColorVariableItem
        case 'Spacing':
          return SpacingVariableItem
        default:
          return TextVariableItem
      }
    }
  }
}

</script>

<style lang="sass">
</style>
