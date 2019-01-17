<template>
  <div class="q-pa-md row">
    <div class="q-pa-md">Default:
      <q-knob show-value class="q-ml-xs" v-model="value" />
    </div>
    <div class="q-pa-md">Primary:
      <q-knob show-value class="q-ml-xs" color="primary" v-model="value" />
    </div>
    <div class="q-pa-md">Deep Purple, Purple 3 Track:
      <q-knob class="q-ml-xs" color="deep-purple" track-color="purple-3" show-value v-model="value" />
    </div>
    <div class="q-pa-md">Red, Teal Center, Green Track:
      <q-knob show-value class="q-ml-xs" color="red" center-color="teal" track-color="green" v-model="value" />
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
