<template lang="pug">
q-item(clickable v-ripple dense)
  q-item-section {{ variableName }}
   q-tooltip {{ variable.desc }}
  q-item-section(side) {{ variable.value }}
  q-menu(
    fit
    touch-position
  )
    .row.items-center.q-gutter-md.q-mx-sm(style="min-width: 240px")
      q-slider.col(
        :min="0"
        :max="100"
        v-model="model.size"
        @input="onChange"
        label
      )
      q-select.col-auto(
        :options="units"
        v-model="model.unit"
        @input="onChange"
        dense
        options-dense
      )
</template>

<script>

import { sizeUnits, parseSize } from './util'

export default {
  props: {
    value: String,
    variable: Object,
    variableName: String
  },

  data () {
    const model = parseSize(this.value)
    return {
      units: sizeUnits,
      model
    }
  },

  methods: {
    onChange () {
      this.$emit('input', `${this.model.size}${this.model.unit}`)
    }
  }
}

</script>
