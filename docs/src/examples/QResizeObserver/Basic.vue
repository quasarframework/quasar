<template>
  <div class="q-pa-md q-gutter-md">
    <q-btn color="primary" push @click="setRandomSize" label="Set Random Size" />

    <div :style="style" class="container bg-amber rounded-borders glossy">
      <!--
        we listen for size changes on this next
        <div>, so we place the observer as direct child:
      -->
      <q-resize-observer @resize="onResize" />
    </div>

    <div class="q-gutter-sm">
      Reported:
      <q-badge>width: {{ report.width }}</q-badge>
      <q-badge>height: {{ report.height }}</q-badge>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      style: { width: '200px', height: '200px' },
      report: ''
    }
  },

  methods: {
    onResize (size) {
      this.report = size
      // {
      //   width: 20 // width of container (in px)
      //   height: 50 // height of container (in px)
      // }
    },

    setRandomSize () {
      this.style = {
        width: Math.floor(100 + Math.random() * 200) + 'px',
        height: Math.floor(100 + Math.random() * 200) + 'px'
      }
    }
  }
}
</script>

<style lang="sass" scoped>
.container
  transition: width .3s, height .3s
</style>
