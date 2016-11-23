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
      <p>
        <q-progress :percentage="progress" @click.native="randomize()"></q-progress>
        <q-progress :percentage="progress" class="stripe" @click.native="randomize()"></q-progress>
        <q-progress :percentage="progress" class="stripe positive" @click.native="randomize()"></q-progress>
        <q-progress :percentage="progress" class="stripe info" @click.native="randomize()"></q-progress>
        <q-progress :percentage="progress" class="stripe warning" @click.native="randomize()"></q-progress>
        <q-progress :percentage="progress" class="stripe secondary" @click.native="randomize()"></q-progress>
        <q-progress :percentage="progress" class="stripe tertiary" @click.native="randomize()"></q-progress>
        <q-progress :percentage="progress" class="stripe dark" @click.native="randomize()"></q-progress>
        <q-progress :percentage="progress" class="stripe negative" @click.native="randomize()"></q-progress>
        <q-progress :percentage="progress" class="stripe animate" @click.native="randomize()"></q-progress>
      </p>

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
        <q-progress class="indeterminate stripe" style="height: 45px"></q-progress>
      </p>

      <h5>Striped</h5>
      <q-progress :percentage="progress" class="stripe" @click.native="randomize()"></q-progress>

      <h5>Striped and Animated</h5>
      <q-progress :percentage="progress" class="stripe animate" @click.native="randomize()"></q-progress>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      progress: 81
    }
  },
  methods: {
    randomize () {
      this.progress = Math.round(Math.random() * 100)
    }
  }
}
</script>
