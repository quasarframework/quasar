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
      <p class="group">
        <q-btn size="sm" color="primary" @click="randomize">Change Model</q-btn>
        <q-progress :percentage="progress"></q-progress>
        <q-progress :percentage="progress" color="positive"></q-progress>
        <q-progress :percentage="progress" color="info"></q-progress>
        <q-progress :percentage="progress" color="warning"></q-progress>
        <q-progress :percentage="progress" color="secondary"></q-progress>
        <q-progress :percentage="progress" color="tertiary"></q-progress>
        <q-progress :percentage="progress" color="dark"></q-progress>
        <q-progress :percentage="progress" color="negative"></q-progress>
      </p>

      <h5>Stripe</h5>
      <p class="group">
        <q-progress :percentage="progress" stripe></q-progress>
        <q-progress :percentage="progress" stripe color="positive"></q-progress>
        <q-progress :percentage="progress" stripe color="info"></q-progress>
        <q-progress :percentage="progress" stripe color="warning"></q-progress>
      </p>

      <h5>Stripe and Animate</h5>
        <q-progress :percentage="progress" stripe animate color="secondary"></q-progress>
      </p>

      <h5>Buffering</h5>
      <p class="group">
        <q-btn size="sm" color="primary" @click="randomizeBuffer">Change Buffer Model</q-btn>
        <q-progress :percentage="progressBuffer" :buffer="buffer"></q-progress>
        <q-progress :percentage="progressBuffer" stripe :buffer="buffer"></q-progress>
        <q-progress :percentage="progressBuffer" stripe animate color="secondary" :buffer="buffer"></q-progress>
      </p>

      <h5>Indeterminate State</h5>
      <p class="group">
        <q-progress indeterminate></q-progress>
        <q-progress indeterminate color="positive"></q-progress>
        <q-progress indeterminate color="warning"></q-progress>
        <q-progress indeterminate color="negative"></q-progress>
        <q-progress indeterminate color="dark"></q-progress>
      </p>

      <h5>Specific Height</h5>
      <p>
        <q-progress :percentage="progress" stripe animate height="45px"></q-progress>
      </p>
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
