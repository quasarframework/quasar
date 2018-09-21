<template>
  <div>
    <div class="layout-padding">
      <q-toggle label="Alternative Labels" v-model="alt" />
      <q-toggle label="Contractable" v-model="contractable" />
      <q-toggle label="Header Step Navigation (Back)" v-model="backnav" />
      <br><br>

      <q-stepper :no-header-navigation="!backnav" :color="color" flat ref="stepper" v-model="step" :alternative-labels="alt" :contractable="contractable">
        <q-step default name="first" title="Ad style">
          <div v-for="n in 10" :key="n">{{ n }} Step 1</div>
          <q-stepper-navigation>
            <q-btn :color="color" @click="$refs.stepper.next()">Continue</q-btn>
            <q-btn :color="color" @click="$refs.stepper.goToStep('fifth')" class="q-ml-sm">Go to Step 4</q-btn>
          </q-stepper-navigation>
        </q-step>
        <q-step error title="Custom channels" subtitle="Alert message">
          <div v-for="n in 10" :key="n">{{ n }} Step 2</div>
          <q-stepper-navigation>
            <q-btn :color="color" @click="$refs.stepper.next()">Next</q-btn>
            <q-btn :color="color" flat @click="$refs.stepper.previous()" class="q-ml-sm">Back</q-btn>
          </q-stepper-navigation>
        </q-step>
        <q-step title="Get code">
          <div v-for="n in 3" :key="n">{{ n }} Step 3</div>
          <q-stepper-navigation>
            <q-btn :color="color" @click="$refs.stepper.next()">Next</q-btn>
            <q-btn :color="color" flat @click="$refs.stepper.previous()" class="q-ml-sm">Back</q-btn>
          </q-stepper-navigation>
        </q-step>
        <q-step name="fifth" disable title="Disabled">
          <div v-for="n in 3" :key="n">{{ n }} Step 4</div>
          <q-stepper-navigation>
            <q-btn :color="color" @click="$refs.stepper.next()">Next</q-btn>
            <q-btn :color="color" flat @click="$refs.stepper.previous()" class="q-ml-sm">Back</q-btn>
          </q-stepper-navigation>
        </q-step>
        <q-step name="fourth" title="Editable">
          <div v-for="n in 3" :key="n">{{ n }} Step 5</div>
          <q-stepper-navigation>
            <q-btn :color="color" @click="$refs.stepper.goToStep('first')">Restart</q-btn>
            <q-btn :color="color" flat @click="$refs.stepper.previous()" class="q-ml-sm">Back</q-btn>
          </q-stepper-navigation>
        </q-step>

        <q-stepper-navigation>
          <q-btn :color="color" flat @click="$refs.stepper.previous()">Back</q-btn>
          <q-btn :color="color" @click="$refs.stepper.next()" class="q-ml-sm">Next</q-btn>
        </q-stepper-navigation>
      </q-stepper>

      <br><br>

      <q-toggle v-model="vertical" label="Vertical" />
      <q-stepper :no-header-navigation="!backnav" ref="stepper2" :color="color" v-model="step2" :alternative-labels="alt" :vertical="vertical">
        <q-step default name="first" title="Ad style">
          <div v-for="n in 10" :key="n">{{ n }} Step 1</div>
          <q-stepper-navigation>
            <q-btn :color="color" @click="$refs.stepper2.next()">Continue</q-btn>
          </q-stepper-navigation>
        </q-step>
        <q-step error title="Custom channels" subtitle="Alert message">
          <div v-for="n in 10" :key="n">{{ n }} Step 2</div>
          <q-stepper-navigation>
            <q-btn :color="color" @click="$refs.stepper2.next()">Next</q-btn>
            <q-btn :color="color" flat @click="$refs.stepper2.previous()" class="q-ml-sm">Back</q-btn>
          </q-stepper-navigation>
        </q-step>
        <q-step title="Get code">
          <div v-for="n in 3" :key="n">{{ n }} Step 3</div>
          <q-stepper-navigation>
            <q-btn :color="color" @click="$refs.stepper2.next()">Next</q-btn>
            <q-btn :color="color" flat @click="$refs.stepper2.previous()" class="q-ml-sm">Back</q-btn>
          </q-stepper-navigation>
        </q-step>
        <q-step name="fifth" disable title="Disabled">
          <div v-for="n in 3" :key="n">{{ n }} Step 4</div>
          <q-stepper-navigation>
            <q-btn :color="color" @click="$refs.stepper2.next()">Next</q-btn>
            <q-btn :color="color" flat @click="$refs.stepper2.previous()" class="q-ml-sm">Back</q-btn>
          </q-stepper-navigation>
        </q-step>
        <q-step name="fourth" title="Editable">
          <div v-for="n in 3" :key="n">{{ n }} Step 5</div>
          <q-stepper-navigation>
            <q-btn :color="color" @click="$refs.stepper2.goToStep('first')">Restart</q-btn>
            <q-btn :color="color" flat @click="$refs.stepper2.previous()" class="q-ml-sm">Back</q-btn>
          </q-stepper-navigation>
        </q-step>
      </q-stepper>
    </div>
  </div>
</template>

<script>

export default {
  data () {
    return {
      vertical: true,
      step: 'first',
      step2: 'first',
      alt: false,
      contractable: false,
      backnav: true,
      color: 'secondary',
      text: ''
    }
  },
  mounted () {
    window.x = this.$refs.stepper
  }
}
</script>
