<template>
  <div class="q-pa-md row">
    <div class="q-pa-md">5 Step:
      <q-knob class="q-ml-xs" color="orange-8" show-value :step="5" v-model="value" />
    </div>
    <div class="q-pa-md">10 Step:
      <q-knob class="q-ml-xs" color="light-blue" show-value :step="10" v-model="value" />
    </div>
    <div class="q-pa-md">Max 75, min 25:
      <q-knob class="q-ml-xs" :max="75" :min="25" color="primary" show-value v-model="limitedValue" />
    </div>
    <div class="q-pa-md">Lazy Input ({{lazyValue}}):
      <q-knob class="q-ml-xs" @change="updateLazyValue" color="secondary" show-value :value="42" />
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      value: 42,
      limitedValue: 42,
      lazyValue: 42
    }
  },
  methods: {
    updateLazyValue (val) {
      this.lazyValue = val
    }
  }
}
</script>
