<template>
  <div>
    <div class="q-layout-padding" :class="dark ? 'bg-black text-white' : null">
      <q-toggle v-model="dark" :dark="dark" label="Dark" />

      <div class="caption">
        <span class="desktop-only">Click</span>
        <span class="mobile-only">Tap</span>
        on progress bars to change their binded value.
        <span class="desktop-only">
          On a real mobile device the Progress bars
          are much thinner by default.
        </span>
      </div>

      <h5>Determinate State</h5>
      <div class="group">
        <q-btn size="sm" color="primary" @click="randomize">
          Change Model
        </q-btn>
        <q-linear-progress :dark="dark" class="q-my-sm" rounded :value="progress" />
        <q-linear-progress :dark="dark" style="height: 10px" class="q-my-sm" :value="progress" color="positive" fill-color="yellow" />
        <q-linear-progress :dark="dark" style="height: 20px" rounded class="q-my-sm" :value="progress" color="info" />
        <q-linear-progress :dark="dark" class="q-my-sm" :value="progress" color="warning" />
        <q-linear-progress :dark="dark" class="q-my-sm" :value="progress" color="secondary" />
        <q-linear-progress :dark="dark" class="q-my-sm" :value="progress" color="accent" />
        <q-linear-progress :dark="dark" track-color="orange" class="q-my-sm" :value="progress" color="purple" />
        <q-linear-progress :dark="dark" class="q-my-sm" :value="progress" color="negative" />
      </div>

      <h5>Determinate State - Reverse</h5>
      <div class="group">
        <q-linear-progress :dark="dark" reverse class="q-my-sm" :value="progress" />
        <q-linear-progress :dark="dark" reverse style="height: 10px" class="q-my-sm" :value="progress" color="positive" fill-color="yellow" />
      </div>

      <h5>Stripe</h5>
      <div class="group">
        <q-linear-progress :dark="dark" class="q-my-sm" :value="progress" stripe />
        <q-linear-progress :dark="dark" class="q-my-sm" :value="progress" stripe color="positive" />
        <q-linear-progress :dark="dark" class="q-my-sm" :value="progress" stripe color="info" />
        <q-linear-progress :dark="dark" class="q-my-sm" :value="progress" stripe color="warning" />
      </div>

      <h5>Stripe and Animate</h5>
      <q-linear-progress :dark="dark" class="q-my-sm" :value="progress" stripe animate color="secondary" />

      <h5>Buffering</h5>
      <div class="group">
        <q-btn size="sm" color="primary" @click="randomizeBuffer">
          Change Buffer Model
        </q-btn>
        <q-linear-progress :dark="dark" class="q-my-sm" :value="progressBuffer" :buffer="buffer" />
        <q-linear-progress :dark="dark" class="q-my-sm" :value="progressBuffer" stripe :buffer="buffer" />
        <q-linear-progress :dark="dark" class="q-my-sm" :value="progressBuffer" stripe animate color="secondary" :buffer="buffer" />

        <q-linear-progress :dark="dark" class="q-my-sm" :value="progressBuffer" :buffer="buffer" fill-color="yellow" />
        <q-linear-progress :dark="dark" class="q-my-sm" :value="progressBuffer" stripe :buffer="buffer" fill-color="yellow" />
        <q-linear-progress :dark="dark" class="q-my-sm" :value="progressBuffer" stripe animate color="secondary" :buffer="buffer" fill-color="yellow" buffer-color="primary" />
      </div>

      <h5>Indeterminate State</h5>
      <div class="group">
        <q-linear-progress :dark="dark" class="q-my-sm" indeterminate />
        <q-linear-progress :dark="dark" class="q-my-sm" indeterminate color="positive" />
        <q-linear-progress :dark="dark" class="q-my-sm" indeterminate color="warning" />
        <q-linear-progress :dark="dark" class="q-my-sm" indeterminate color="negative" />
        <q-linear-progress :dark="dark" class="q-my-sm" indeterminate color="dark" />
      </div>

      <h5>Query State</h5>
      <div class="group">
        <q-linear-progress :dark="dark" class="q-my-sm" query />
        <q-linear-progress :dark="dark" class="q-my-sm" query color="positive" />
        <q-linear-progress :dark="dark" class="q-my-sm" query color="warning" />
        <q-linear-progress :dark="dark" class="q-my-sm" query color="negative" />
        <q-linear-progress :dark="dark" class="q-my-sm" query color="dark" />
      </div>

      <h5>Specific Height</h5>
      <div>
        <q-linear-progress :dark="dark" class="q-my-sm" :value="progress" stripe animate style="height: 45px" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      dark: false,
      progress: 0.67,
      progressBuffer: 0.41,
      buffer: 0.67
    }
  },
  methods: {
    randomize () {
      this.progress = Math.random()
    },
    randomizeBuffer () {
      this.progressBuffer = Math.random() * 0.51
      this.buffer = this.progressBuffer + Math.random() * 0.47
    }
  }
}
</script>
