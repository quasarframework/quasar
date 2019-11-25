<template lang="pug">
q-item(clickable v-ripple dense)
  q-item-section {{ variableName }}
   q-tooltip {{ variable.desc }}
  q-item-section(side) {{ variable.value.size }}{{ variable.value.unit }}
  q-menu(
    fit
    touch-position
  )
    .row.items-center.q-gutter-md.q-mx-sm(style="min-width: 240px")
      q-slider.col(
        :min="0"
        :max="100"
        :value="value.size"
        @input="onSizeChange"
      )
      q-select.col-auto(
        :options="units"
        :value="value.unit"
        @input="onUnitChange"
        dense
      )
</template>

<script>

import { clone } from 'quasar'

export default {
  props: {
    value: Object,
    variable: Object,
    variableName: String
  },

  data () {
    return {
      units: [
        'px',
        '%',
        'em',
        'rem',
        'ex',
        'ch',
        'vw',
        'vh',
        'vmin',
        'vmax',
        'fr'
      ]
    }
  },

  methods: {
    onChange (prop, value) {
      const model = clone(this.value)
      model[prop] = value
      this.$emit('input', model)
    },
    onSizeChange (value) {
      this.onChange('size', value)
    },
    onUnitChange (value) {
      this.onChange('unit', value)
    }
  }
}

</script>
