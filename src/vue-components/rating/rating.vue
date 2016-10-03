<template>
  <div class="quasar-rating" :class="{disabled: disable}">
    <i
      v-for="index in maxGrade"
      :class="{active: (!mouseModel && model > index) || (mouseModel && mouseModel > index)}"
      @click.native="set(index)"
      @mouseover="setHoverValue(index)"
      @mouseout="mouseModel = 0"
    >{{icon}}</i>
  </div>
</template>

<script>
export default {
  props: {
    model: {
      type: Number,
      default: 0,
      required: true
    },
    maxGrade: {
      type: Number,
      required: true
    },
    icon: {
      type: String,
      default: 'grade'
    },
    disable: {
      type: Boolean,
      default: false,
      coerce: Boolean
    }
  },
  data () {
    return {
      mouseModel: 0
    }
  },
  methods: {
    set (value) {
      if (!this.disable) {
        this.model = this.normalize(value)
      }
    },
    setHoverValue (value) {
      if (!this.disable) {
        this.mouseModel = value
      }
    },
    normalize (value) {
      return Math.min(this.maxGrade, Math.max(1, value))
    }
  }
}
</script>
