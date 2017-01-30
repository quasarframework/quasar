<template>
  <div class="q-rating" :class="{disabled: disable, editable: editable}">
    <i
      v-for="index in max"
      :class="{
        active: (!mouseModel && model >= index) || (mouseModel && mouseModel >= index),
        exselected: mouseModel && model >= index && mouseModel < index,
        hovered: mouseModel === index
      }"
      @click="set(index)"
      @mouseover="__setHoverValue(index)"
      @mouseout="mouseModel = 0"
    >{{ icon }}</i>
  </div>
</template>

<script>
import Utils from '../../utils'

export default {
  props: {
    value: {
      type: Number,
      default: 0,
      required: true
    },
    max: {
      type: Number,
      required: true
    },
    icon: {
      type: String,
      default: 'grade'
    },
    readonly: Boolean,
    disable: Boolean
  },
  data () {
    return {
      mouseModel: 0
    }
  },
  computed: {
    model: {
      get () {
        return this.value
      },
      set (value) {
        if (this.value !== value) {
          this.$emit('input', value)
        }
      }
    },
    editable () {
      return !this.readonly && !this.disable
    }
  },
  methods: {
    set (value) {
      if (this.editable) {
        this.model = Utils.format.between(parseInt(value, 10), 1, this.max)
        this.mouseModel = 0
      }
    },
    __setHoverValue (value) {
      if (this.editable) {
        this.mouseModel = value
      }
    }
  }
}
</script>
