<template lang="pug">
q-item(clickable v-ripple dense)
  q-item-section {{ variableName }}
    q-tooltip(v-if="variable.desc !== void 0") {{ variable.desc }}
  q-item-section(side)
    .color-indicator(:style="colorStyles")
  q-menu(
    fit
    touch-position
  )
    q-color(
      :value="value"
      @input="onInput"
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
  },

  computed: {
    colorStyles () {
      return {
        background: this.value
      }
    }
  }
}

</script>

<style lang="sass">

.color-indicator
  border-radius: 50%
  width: 20px
  height: 20px
  border: 1px solid #bdbdbd

</style>
