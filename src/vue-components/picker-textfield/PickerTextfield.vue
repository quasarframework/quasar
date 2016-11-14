<template>
  <div
    class="quasar-picker-textfield cursor-pointer textfield caret"
    :class="{disabled: disable, readonly: readonly, active: active, 'with-label': label}"
  >
    <div class="quasar-picker-textfield-label ellipsis" v-html="label"></div>
    <div class="quasar-picker-textfield-value ellipsis">{{actualValue}}</div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    label: String,
    placeholder: String,
    value: String,
    disable: Boolean,
    readonly: Boolean
  },
  computed: {
    active () {
      return this.value.length > 0
    },
    actualValue () {
      return this.label ? this.value : this.value || this.placeholder
    }
  }
}
</script>
