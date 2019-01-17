<template>
  <div class="q-pa-md row">
    <div class="q-pa-md">Disable:
      <q-knob class="q-ml-xs" disable show-value v-model="value" />
    </div>
    <div class="q-pa-md">Read Only:
      <q-knob class="q-ml-xs" readonly show-value color="cyan" v-model="value" />
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
