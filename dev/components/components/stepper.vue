<template>
  <div>
    <div class="layout-padding">
      <q-toggle label="Vertical" v-model="vertical" />
      <q-toggle label="Animated" v-model="animated" />
      <q-toggle label="Alternative Labels" v-model="alt" />
      <q-toggle label="Contractable" v-model="contractable" />
      <q-toggle label="Header Navigation" v-model="headerNavigation" />
      <q-toggle label="Flat" v-model="flat" />
      <q-toggle label="Bordered" v-model="bordered" />
      <q-toggle label="Dark" v-model="dark" />
      <q-toggle label="Global Navigation" v-model="globalNav" />
      <br><br>

      <div class="q-py-md q-px-xs" :class="dark ? 'bg-black' : ''">

        <q-stepper :vertical="vertical" :animated="animated" :dark="dark" :flat="flat" :bordered="bordered" :header-navigation="headerNavigation" :color="color" ref="stepper" v-model="step" :alternative-labels="alt" :contractable="contractable">
          <q-step name="first" title="Ad style" icon="map">
            <div v-for="n in 10" :key="'1.'+n">{{ n }} Step 1</div>
            <q-stepper-navigation v-if="!globalNav">
              <q-btn :color="color" @click="$refs.stepper.next()">Continue</q-btn>
              <q-btn :color="color" @click="step = 'fifth'" class="q-ml-sm">Go to Step 5</q-btn>
            </q-stepper-navigation>
          </q-step>
          <q-step name="second" error title="Custom channels" caption="Alert message" icon="map">
            <div v-for="n in 10" :key="'2.'+n">{{ n }} Step 2</div>
            <q-stepper-navigation v-if="!globalNav">
              <q-btn :color="color" @click="$refs.stepper.next()">Continue</q-btn>
              <q-btn :color="color" flat @click="$refs.stepper.previous()" class="q-ml-sm">Back</q-btn>
            </q-stepper-navigation>
          </q-step>
          <q-step name="third" title="Get code" icon="map">
            <div v-for="n in 3" :key="'3.'+n">{{ n }} Step 3</div>
            <q-stepper-navigation v-if="!globalNav">
              <q-btn :color="color" @click="$refs.stepper.next()">Continue</q-btn>
              <q-btn :color="color" flat @click="$refs.stepper.previous()" class="q-ml-sm">Back</q-btn>
            </q-stepper-navigation>
          </q-step>
          <q-step name="fourth" disable title="Disabled" icon="map">
            <div v-for="n in 3" :key="'4.'+n">{{ n }} Step 4</div>
            <q-stepper-navigation v-if="!globalNav">
              <q-btn :color="color" @click="$refs.stepper.next()">Continue</q-btn>
              <q-btn :color="color" flat @click="$refs.stepper.previous()" class="q-ml-sm">Back</q-btn>
            </q-stepper-navigation>
          </q-step>
          <q-step name="fifth" title="Editable" icon="map">
            <div v-for="n in 3" :key="'5.'+n">{{ n }} Step 5</div>
            <q-stepper-navigation v-if="!globalNav">
              <q-btn :color="color" @click="step = 'first'">Restart</q-btn>
              <q-btn :color="color" flat @click="$refs.stepper.previous()" class="q-ml-sm">Back</q-btn>
            </q-stepper-navigation>
          </q-step>

          <q-stepper-navigation v-if="globalNav" slot="navigation">
            <q-btn :disable="step === 'fifth'" :color="color" @click="$refs.stepper.next()">Continue</q-btn>
            <q-btn v-if="step !== 'first'" flat @click="$refs.stepper.previous()" class="q-ml-sm">Back</q-btn>
          </q-stepper-navigation>
        </q-stepper>

      </div>
    </div>
  </div>
</template>

<script>

export default {
  data () {
    return {
      color: 'purple',

      step: 'first',
      vertical: false,
      animated: true,
      alt: false,
      contractable: false,
      headerNavigation: true,
      flat: false,
      bordered: false,
      dark: false,
      globalNav: true
    }
  },
  mounted () {
    window.x = this.$refs.stepper
  }
}
</script>
