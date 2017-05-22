<template>
  <div
    class="q-if row no-wrap items-center relative-position"
    :class="classes"
    :tabindex="focusable && !disable ? 0 : null"
  >
    <template v-if="before">
      <q-icon
        v-for="item in before"
        :key="item"
        class="q-if-control"
        :class="{hidden: item.content && !length}"
        :name="item.icon"
        @click="item.handler"
      ></q-icon>
    </template>

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
    <template v-if="after">
      <q-icon
        v-for="item in after"
        :key="item"
        class="q-if-control"
        :class="{hidden: (item.content && !length) || (!!item.error !== hasError)}"
        :name="item.icon"
        @click="item.handler"
      ></q-icon>
    </template>
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
    classes () {
      const cls = [{
        'q-if-has-label': this.label,
        'q-if-focused': this.focused,
        'q-if-error': this.hasError,
        'q-if-disabled': this.disable,
        'q-if-focusable': this.focusable && !this.disable,
        'q-if-inverted': this.inverted,
        'q-if-dark': this.dark || this.inverted
      }]

      const color = this.hasError ? 'negative' : this.color
      if (color) {
        if (this.inverted) {
          cls.push(`bg-${color}`)
          cls.push(`text-white`)
        }
        else {
          cls.push(`text-${color}`)
        }
      }
      return cls
    },
    hasError () {
      return !!(this.field.error || this.error)
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
