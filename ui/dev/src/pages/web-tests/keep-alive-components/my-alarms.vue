<template>
  <q-btn :label="label" @click="onClick" />
</template>

<script>
export default {
  data () {
    return {
      index: 0
    }
  },

  computed: {
    label () {
      return 'Alarms ' + this.index
    }
  },

  methods: {
    onClick () {
      this.index++
    }
  }
}
</script>
