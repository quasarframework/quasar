<template>
  <div
    class="q-rating row inline items-center no-wrap"
    :class="{
      disabled: disable,
      editable: editable,
      [`text-${color}`]: color
    }"
    :style="size ? `font-size: ${size}` : ''"
  >
    <q-icon
      v-for="index in max"
      :key="index"
      :name="icon"
      :class="{
        active: (!mouseModel && model >= index) || (mouseModel && mouseModel >= index),
        exselected: mouseModel && model >= index && mouseModel < index,
        hovered: mouseModel === index
      }"
      @click="set(index)"
      @mouseover="__setHoverValue(index)"
      @mouseout="mouseModel = 0"
    ></q-icon>
  </div>
</template>

<script>
import { between } from '../../utils/format'
import { QIcon } from '../icon'

export default {
  name: 'q-rating',
  components: {
    QIcon
  },
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
    color: String,
    size: String,
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
        this.model = between(parseInt(value, 10), 1, this.max)
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
