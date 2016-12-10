<template>
  <div>
  <!--   class="q-range non-selectable"
    :class="{disabled: disable}"
    @mousedown.prevent="__setActive"
    @touchstart.prevent="__setActive"
    @touchend.prevent="__end"
    @touchmove.prevent="__update" -->


  </div>
</template>

<script>
// import Utils from '../../utils'
import Platform from '../../features/platform'

export default {
  props: {
    label: {
      type: Object,
      required: true,
      validator (value) {
        return typeof value.min !== 'undefined' && typeof value.max !== 'undefined'
      }
    }
  },
  data () {
    return {
      dragging: false
    }
  },
  computed: {
  },
  watch: {
  },
  methods: {
  },
  created () {
    this.__validateProps()
    if (Platform.is.desktop) {
      document.body.addEventListener('mousemove', this.__update)
      document.body.addEventListener('mouseup', this.__end)
    }
  },
  beforeDestroy () {
    if (Platform.is.dekstop) {
      document.body.removeEventListener('mousemove', this.__update)
      document.body.removeEventListener('mouseup', this.__end)
    }
  }
}
</script>
