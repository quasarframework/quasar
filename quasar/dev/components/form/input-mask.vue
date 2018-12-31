<template>
  <div class="q-layout-padding">
    <div style="max-width: 600px" class="q-gutter-y-md">
      <h1>Input Mask</h1>

      <div>Model: {{ text1 }}</div>
      <q-input mask="date" v-model="text1" filled hint="Date ####/##/##" label="Label" />

      <div>Model: {{ text2 }}</div>
      <q-input mask="((###) ### - ####)" v-model="text2" filled hint="Phone ((###) ### - ####)" counter label="Label" />

      <div>Model: {{ text3 }}</div>
      <q-input mask="phone" fill-mask v-model="text3" filled hint="Phone (###) ### - #### --- with fill-mask" counter label="Label" />

      <div>Model: {{ text4 }}</div>
      <q-input mask="phone" unmasked-value v-model="text4" filled hint="Phone (###) ### - #### -- with unmasked-value" counter label="Label" />

      <div class="text-h6">Live mask test</div>
      <q-input v-model="mask" outlined label="Mask" />
      <q-input :mask="mask" v-model="textMask" filled label="Masked input" />
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      text1: '',
      text2: '',
      text3: '',
      text4: '',

      mask: '(###) ###S - (###)',
      textMask: ''
    }
  }
}
</script>
