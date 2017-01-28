<template>
  <div>
    <div class="layout-padding">
      <p class="caption">
        <span class="desktop-only">Click</span>
        <span class="mobile-only">Tap</span>
        on progress bars to change their binded value.
        <span class="desktop-only">
          On a real mobile device the Progress bars
          are much thinner by default.
        </span>
      </p>

      <h5>Determinate State</h5>
      <button class="primary" @click="randomize">Change Model</button>
      <p>
        <q-progress :percentage="progress"></q-progress>
        <q-progress :percentage="progress" class="stripe"></q-progress>
        <q-progress :percentage="progress" class="stripe positive"></q-progress>
        <q-progress :percentage="progress" class="stripe info"></q-progress>
        <q-progress :percentage="progress" class="stripe warning"></q-progress>
        <q-progress :percentage="progress" class="stripe secondary"></q-progress>
        <q-progress :percentage="progress" class="stripe tertiary"></q-progress>
        <q-progress :percentage="progress" class="stripe dark"></q-progress>
        <q-progress :percentage="progress" class="stripe negative"></q-progress>
        <q-progress :percentage="progress" class="stripe animate"></q-progress>
      </p>

      <h5>Buffering</h5>
      <button class="primary" @click="randomizeBuffer">Change Buffer Model</button>
      <q-progress :percentage="progressBuffer" :buffer="buffer" style="height: 4px"></q-progress>

      <h5>Indeterminate State</h5>
      <p>
        <q-progress class="indeterminate"></q-progress>
        <q-progress class="indeterminate positive"></q-progress>
        <q-progress class="indeterminate warning"></q-progress>
        <q-progress class="indeterminate negative"></q-progress>
        <q-progress class="indeterminate dark"></q-progress>
      </p>

      <h5>Specific Height</h5>
      <p>
        <q-progress :percentage="progress" class="stripe animate" style="height: 45px"></q-progress>
      </p>

      <h5>Striped</h5>
      <q-progress :percentage="progress" class="stripe"></q-progress>

      <h5>Striped and Animated</h5>
      <q-progress :percentage="progress" class="stripe animate"></q-progress>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      progress: 67,
      progressBuffer: 41,
      buffer: 17
    }
  },
  methods: {
    randomize () {
      this.progress = Math.round(Math.random() * 100)
    },
    randomizeBuffer () {
      this.progressBuffer = Math.round(Math.random() * 51)
      this.buffer = Math.round(Math.random() * 47)
    }
  }
}
</script>
