<template>
  <div
    class="q-if row no-wrap items-center relative-position"
    :class="classes"
    :tabindex="focusable && !disable ? 0 : null"
    @click="__onClick"
  >
    <template v-if="before">
      <q-icon
        v-for="item in before"
        :key="item.icon"
        class="q-if-control q-if-control-before"
        :class="{hidden: __additionalHidden(item, hasError, hasWarning, length)}"
        :name="item.icon"
        @mousedown="__onMouseDown"
        @touchstart="__onMouseDown"
        @click="__baHandler($event, item)"
      ></q-icon>
    </template>

    <div class="q-if-inner col row no-wrap items-center relative-position">
      <div
        v-if="hasLabel"
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

    <slot name="after"></slot>
    <template v-if="after">
      <q-icon
        v-for="item in after"
        :key="item.icon"
        class="q-if-control"
        :class="{hidden: __additionalHidden(item, hasError, hasWarning, length)}"
        :name="item.icon"
        @mousedown="__onMouseDown"
        @touchstart="__onMouseDown"
        @click="__baHandler($event, item)"
      ></q-icon>
    </template>
  </div>
</template>

<script>
import Mixin from '../../mixins/input-frame'

export default {
  name: 'q-input-frame',
  mixins: [Mixin],
  props: {
    topAddons: Boolean,
    focused: Boolean,
    length: Number,
    focusable: Boolean,
    additionalLength: Boolean
  },
  data () {
    return {
      field: {}
    }
  },
  inject: {
    __field: { default: null }
  },
  computed: {
    hasStackLabel () {
      return typeof this.stackLabel === 'string' && this.stackLabel.length > 0
    },
    hasLabel () {
      return this.hasStackLabel || (typeof this.floatLabel === 'string' && this.floatLabel.length > 0)
    },
    label () {
      return this.hasStackLabel ? this.stackLabel : this.floatLabel
    },
    addonClass () {
      return {
        'q-if-addon-visible': !this.hasLabel || this.labelIsAbove,
        'self-start': this.topAddons
      }
    },
    classes () {
      const cls = [{
        'q-if-has-label': this.label,
        'q-if-focused': this.focused,
        'q-if-error': this.hasError,
        'q-if-warning': this.hasWarning,
        'q-if-disabled': this.disable,
        'q-if-focusable': this.focusable && !this.disable,
        'q-if-inverted': this.inverted,
        'q-if-dark': this.dark || this.inverted
      }]

      const color = this.hasError ? 'negative' : this.hasWarning ? 'warning' : this.color
      if (this.inverted) {
        cls.push(`bg-${color}`)
        cls.push(`text-white`)
      }
      else {
        cls.push(`text-${color}`)
      }
      return cls
    },
    hasError () {
      return !!(this.field.error || this.error)
    },
    hasWarning () {
      // error is the higher priority
      return !!(!this.hasError && (this.field.warning || this.warning))
    }
  },
  methods: {
    __onClick (e) {
      this.$emit('click', e)
    },
    __onMouseDown (e) {
      this.$nextTick(() => this.$emit('focus', e))
    },
    __additionalHidden (item, hasError, hasWarning, length) {
      if (item.condition !== void 0) {
        return item.condition === false
      }
      return (
        (item.content !== void 0 && !item.content === (length > 0)) ||
        (item.error !== void 0 && !item.error === hasError) ||
        (item.warning !== void 0 && !item.warning === hasWarning)
      )
    },
    __baHandler (evt, item) {
      if (!item.allowPropagation) {
        evt.stopPropagation()
      }
      if (item.handler) {
        item.handler(evt)
      }
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
