<template>
  <div class="q-pa-md row">
    <div class="q-pa-md">Custom Center Content:
      <q-knob class="q-ml-xs" color="magenta" show-value v-model="value">
        <q-avatar size="2em">
          <img src="/statics/quasar-logo.png">
        </q-avatar>
      </q-knob>
    </div>
    <div class="q-pa-md">90 Degree Arc Angle:
      <q-knob class="q-ml-xs" :angle="90" color="pink" v-model="value"/>
    </div>
    <div class="q-pa-md">60px Size:
      <q-knob class="q-ml-xs" size="60px" color="amber" v-model="value"/>
    </div>
    <div class="q-pa-md">.5 Arc Thickness:
      <q-knob class="q-ml-xs" :thickness=".5" color="deep-orange" v-model="value"/>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      value: 42
    }
  }
}
</script>
