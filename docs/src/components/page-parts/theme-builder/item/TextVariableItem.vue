<template lang="pug">
q-item(clickable v-ripple dense)
  q-item-section {{ variableName }}
    q-tooltip(v-if="variable.desc !== void 0") {{ variable.desc }}
  q-item-section(side) {{ variable.value }}
  q-menu(
    fit
    touch-position
  )
    q-input(
      :value="value"
      @input="onInput"
      outlined
      dense
      autofocus
      :label="variableName"
    )
</template>

<script>

export default {
  props: {
    value: String,
    variableName: String,
    variable: Object
  },

  methods: {
    onInput (val) {
      this.$emit('input', val)
    }
  }
}

</script>
