<template>
  <button
    v-ripple.mat="!isDisabled"
    @click="click"
    class="q-btn q-btn-toggle row inline flex-center q-focusable q-hoverable relative-position"
    :class="classes"
  >
    <div class="desktop-only q-focus-helper"></div>
    <span class="q-btn-inner row col flex-center">
      <q-icon v-if="icon" :name="icon" :class="{'on-left': !round}"></q-icon>
      <slot></slot>
      <q-icon v-if="!round && iconRight" :name="iconRight" class="on-right"></q-icon>
    </span>
  </button>
</template>

<script>
import BtnMixin from './btn-mixin'

export default {
  name: 'q-btn-toggle',
  mixins: [BtnMixin],
  model: {
    prop: 'toggled',
    event: 'change'
  },
  props: {
    toggled: {
      type: Boolean,
      required: true
    },
    toggleColor: {
      type: String,
      required: true
    }
  },
  methods: {
    click (e) {
      this.$el.blur()

      if (this.isDisabled) {
        return
      }

      const state = !this.toggled
      this.$emit('change', state)
      this.$emit('click', e, state)
    }
  }
}
</script>
