<template>
  <div
    class="q-if row no-wrap items-center relative-position"
    :class="{
      'q-if-has-label': label,
      'q-if-focused': focused,
      'q-if-error': hasError,
      'q-if-disabled': disable,
      'q-if-focusable': focusable && !disable
    }"
    :tabindex="focusable && !disable ? 0 : null"
  >
    <div
      class="q-if-inner col row no-wrap items-center relative-position"
      @click="__onClick"
    >
      <div
        v-if="label"
        class="q-if-label ellipsis full-width absolute self-start"
        :class="{'q-if-label-above': labelIsAbove}"
        v-html="label"
      ></div>

      <span
        v-if="prefix"
        class="q-if-addon q-if-addon-left"
        :class="addonClass"
        v-html="prefix"
      ></span>

      <slot></slot>

      <span
        v-if="suffix"
        class="q-if-addon q-if-addon-right"
        :class="addonClass"
        v-html="suffix"
      ></span>
    </div>

    <slot name="control"></slot>
  </div>
</template>

<script>
import Mixin from './input-frame-mixin'

export default {
  name: 'q-input-frame',
  mixins: [Mixin],
  props: {
    topAddons: Boolean,
    focused: Boolean,
    length: Number,
    focusable: Boolean
  },
  data () {
    return {
      field: {}
    }
  },
  inject: ['__field'],
  computed: {
    label () {
      return this.stackLabel || this.floatLabel
    },
    addonClass () {
      return {
        'q-if-addon-visible': this.labelIsAbove,
        'self-start': this.topAddons
      }
    },
    hasError () {
      return this.field.error || this.error
    }
  },
  methods: {
    __onClick (e) {
      this.$emit('click', e)
    }
  },
  created () {
    if (this.__field) {
      this.field = this.__field
      this.field.__registerInput(this)
    }
  },
  beforeDestroy () {
    if (this.__field) {
      this.field.__unregisterInput()
    }
  }
}
</script>
