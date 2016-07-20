<template>
  <div class="quasar-rating">
    <i
      v-for="index in maxGrade"
      :class="{active: (!mouseModel && model > index) || (mouseModel && mouseModel > index)}"
      @click="model = index + 1"
      @mouseover="mouseModel = index + 1"
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
    }
  },
  data () {
    return {
      mouseModel: 0
    }
  }
}
</script>
