<template>
  <div>
    <div class="q-layout-padding">
      <q-toggle label="Vertical" v-model="vertical" />
      <q-toggle label="Animated" v-model="animated" />
      <q-toggle label="Alternative Labels" v-model="alt" />
      <q-toggle label="Contractable" v-model="contractable" />
      <q-toggle label="Header Navigation" v-model="headerNav" />
      <q-toggle label="Use 'header-nav' on steps" v-model="headerNavStep" />
      <q-toggle label="Flat" v-model="flat" />
      <q-toggle label="Bordered" v-model="bordered" />
      <q-toggle label="Dark" v-model="dark" />

      <q-toggle label="Global Navigation" v-model="globalNav" />
      <q-toggle label="Caption" v-model="caption" />
      <q-toggle label="Use 'done' prop" v-model="useDone" />

      <q-stepper
        :class="'q-mt-lg' + (dark ? ' bg-black' : '')"
        :vertical="vertical"
        :animated="animated"
        :dark="dark"
        :flat="flat"
        :bordered="bordered"
        :header-nav="headerNav"
        :color="color"
        ref="stepper"
        v-model="step"
        :alternative-labels="alt"
        :contractable="contractable"
      >
        <q-step :name="1" :done="useDone && step > 1" :header-nav="headerNavStep ? step > 1 : true" title="Ad style" icon="map" :caption="caption ? 'Some caption' : null">
          <div v-for="n in 10" :key="'1.'+n">{{ n }} Step 1</div>
          <q-stepper-navigation v-if="!globalNav">
            <q-btn :color="color" @click="$refs.stepper.next()">Continue</q-btn>
            <q-btn :color="color" @click="step = 5" class="q-ml-sm">Go to Step 5</q-btn>
          </q-stepper-navigation>
        </q-step>
        <q-step :name="2" :done="useDone && step > 2" :header-nav="headerNavStep ? step > 2 : true" error title="Custom channels" :caption="caption ? 'Alert message' : null" icon="map">
          <div v-for="n in 10" :key="'2.'+n">{{ n }} Step 2</div>
          <q-stepper-navigation v-if="!globalNav">
            <q-btn :color="color" @click="$refs.stepper.next()">Continue</q-btn>
            <q-btn :color="color" flat @click="$refs.stepper.previous()" class="q-ml-sm">Back</q-btn>
          </q-stepper-navigation>
        </q-step>
        <q-step :name="3" done-color="orange" :done="useDone && step > 3" :header-nav="headerNavStep ? step > 3 : true" title="Get code" icon="map">
          <div v-for="n in 3" :key="'3.'+n">{{ n }} Step 3</div>
          <q-stepper-navigation v-if="!globalNav">
            <q-btn :color="color" @click="$refs.stepper.next()">Continue</q-btn>
            <q-btn :color="color" flat @click="$refs.stepper.previous()" class="q-ml-sm">Back</q-btn>
          </q-stepper-navigation>
        </q-step>
        <q-step :name="4" :done="useDone && step > 4" :header-nav="headerNavStep ? step > 4 : true" disable title="Disabled" icon="map">
          <div v-for="n in 3" :key="'4.'+n">{{ n }} Step 4</div>
          <q-stepper-navigation v-if="!globalNav">
            <q-btn :color="color" @click="$refs.stepper.next()">Continue</q-btn>
            <q-btn :color="color" flat @click="$refs.stepper.previous()" class="q-ml-sm">Back</q-btn>
          </q-stepper-navigation>
        </q-step>
        <q-step :name="5" title="Wrap up" :header-nav="headerNavStep ? step > 5 : true" icon="map">
          <div v-for="n in 3" :key="'5.'+n">{{ n }} Step 5</div>
          <q-stepper-navigation v-if="!globalNav">
            <q-btn :color="color" @click="step = 1">Restart</q-btn>
            <q-btn :color="color" flat @click="$refs.stepper.previous()" class="q-ml-sm">Back</q-btn>
          </q-stepper-navigation>
        </q-step>

        <q-stepper-navigation v-if="globalNav" slot="navigation">
          <q-btn :disable="step === 5" :color="color" @click="$refs.stepper.next()">Continue</q-btn>
          <q-btn v-if="step !== 1" flat @click="$refs.stepper.previous()" class="q-ml-sm">Back</q-btn>
        </q-stepper-navigation>
      </q-stepper>
    </div>
  </div>
</template>

<script>

export default {
  data () {
    return {
      color: 'primary',

      step: 1,
      vertical: false,
      animated: true,
      alt: false,
      contractable: false,
      headerNav: true,
      flat: false,
      bordered: false,
      dark: false,

      globalNav: false,
      caption: false,
      useDone: false,
      headerNavStep: false
    }
  },
  watch: {
    dark (v) {
      this.color = v ? 'deep-orange' : 'primary'
    }
  },
  mounted () {
    window.x = this.$refs.stepper
  }
}
</script>
