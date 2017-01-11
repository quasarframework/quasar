<template>
  <div
    class="q-picker-textfield cursor-pointer textfield caret"
    :class="{disabled: disable, readonly: readonly, active: active, 'with-label': label}"
    tabindex="0"
  >
    <div class="q-picker-textfield-label ellipsis" v-html="label"></div>
    <div class="q-picker-textfield-value ellipsis" v-html="actualValue"></div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    label: String,
    placeholder: String,
    staticLabel: String,
    value: String,
    disable: Boolean,
    readonly: Boolean
  },
  computed: {
    active () {
      return this.value.length > 0
    },
    actualValue () {
      return this.staticLabel || (this.label ? this.value : this.value || this.placeholder)
    }
  }
}
</script>
