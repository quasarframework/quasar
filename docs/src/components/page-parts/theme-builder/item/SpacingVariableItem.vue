<template lang="pug">
q-item(clickable v-ripple dense)
  q-item-section {{ variableName }}
    q-tooltip(v-if="variable.desc !== void 0") {{ variable.desc }}
  q-item-section(side) {{ variable.value }}
  q-menu(
    v-if="ready"
    fit
    touch-position
  )
    q-list
      template(v-for="edge in edges")
        q-item-label.text-uppercase(header) {{ edge }}
        q-item
          .row.items-center.q-gutter-md.q-mx-sm(style="min-width: 240px")
            q-slider.col(
              :min="-50"
              :max="50"
              v-model="edgeValue[edge].size"
              @input="onChange"
              label
            )
            q-select.col-auto(
              :options="units"
              v-model="edgeValue[edge].unit"
              @input="onChange"
              dense
              options-dense
            )
</template>

<script>

import { parseSize, sizeUnits } from './util'

export default {
  props: {
    value: String,
    variableName: String,
    variable: Object
  },

  data () {
    return {
      edges: ['top', 'right', 'bottom', 'left'],
      ready: false,
      units: sizeUnits,
      edgeValue: {
        left: null,
        top: null,
        right: null,
        bottom: null
      }
    }
  },

  mounted () {
    const values = this.variable.value.split(' ')
    let left, top, right, bottom, x, y, a = parseSize(values[0])
    if (values.length === 2) {
      x = a
      y = parseSize(values[1])
    }
    else if (values.length === 4) {
      top = a
      right = parseSize(values[1])
      bottom = parseSize(values[2])
      left = parseSize(values[3])
    }
    this.edgeValue.left = Object.assign({}, left || x || a)
    this.edgeValue.top = Object.assign({}, top || y || a)
    this.edgeValue.right = Object.assign({}, right || x || a)
    this.edgeValue.bottom = Object.assign({}, bottom || y || a)
    this.ready = true
  },

  methods: {
    onInput (val) {
      this.$emit('input', val)
    },
    onChange () {
      let val = ''
      for (const edge of this.edges) {
        const edgeModel = this.edgeValue[edge]
        val += `${edgeModel.size}${edgeModel.unit} `
      }
      this.$emit('input', val)
    }
  }
}

</script>
