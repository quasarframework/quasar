<template>
  <div class="q-pa-md row">
    <div class="q-pa-md">Default:
      <q-knob class="q-ml-xs" v-model="value" />
    </div>
    <div class="q-pa-md">Primary:
      <q-knob class="q-ml-xs" color="primary" v-model="value" />
    </div>
    <div class="q-pa-md">Red, Teal Center, Green Track:
      <q-knob class="q-ml-xs" color="red" center-color="teal" track-color="green" v-model="value" />
    </div>
    <div class="q-pa-md">Show Value:
      <q-knob class="q-ml-xs" show-value color="deep-purple" v-model="value" />
    </div>
    <div class="q-pa-md">5 Step:
      <q-knob class="q-ml-xs" color="orange-8" show-value :step="5" v-model="value" />
    </div>
    <div class="q-pa-md">Max 75, min 25:
      <q-knob class="q-ml-xs" :max="75" :min="25" color="primary" show-value v-model="limitedValue" />
    </div>
    <div class="q-pa-md">Custom Center Content:
      <q-knob class="q-ml-xs" color="magenta" show-value v-model="value"><q-avatar size="2em">
      <img src="/statics/quasar-logo.png" />
      </q-avatar>
    </q-knob>
    </div>
    <div class="q-pa-md">Disable:
      <q-knob class="q-ml-xs" disable show-value v-model="value" />
    </div>
    <div class="q-pa-md">Read Only:
      <q-knob class="q-ml-xs" readonly show-value color="pink" v-model="value" />
    </div>
    <div class="q-pa-md">90 Degree Arc Angle:
      <q-knob class="q-ml-xs" :angle="90" show-value color="pink" v-model="value" />
    </div>
    <div class="q-pa-md">.5 Arc Thickness, 60px Size:
      <q-knob class="q-ml-xs" :thickness=".5" size="60px" color="amber" v-model="value" />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      value: 42,
      limitedValue: 42
    }
  }
}
</script>
