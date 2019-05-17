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

      <div>Model: {{ text5 }}</div>
      <q-input mask="phone" fill-mask="*" v-model="text5" filled hint="Phone (###) ### - #### --- with fill-mask *" counter label="Label" />

      <div class="text-h6">
        Live mask test: {{ textMask }}
      </div>
      <div class="row q-gutter-sm">
        <q-input class="col" v-model="mask" outlined dense label="Mask" />
        <q-input class="col" v-model="fillMaskText" outlined dense label="Fill mask char" :disable="!fillMask" />
        <q-toggle class="col" v-model="fillMask" label="Mask" />
        <q-toggle class="col" v-model="fillUnmask" label="Unmask" />
        <q-toggle class="col" v-model="fillRight" label="Right" />
      </div>
      <q-input
        :mask="mask"
        :reverse-fill-mask="fillRight"
        :fill-mask="fillMaskComp"
        :unmasked-value="fillUnmask"
        v-model="textMask"
        filled
        label="Masked input"
        :input-class="{ 'text-right': fillRight }"
      />
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
      text5: '',

      // mask: '(###) ###S - (###)',
      mask: '#.##',
      textMask: '123.50',

      fillRight: true,
      fillMask: true,
      fillUnmask: false,
      fillMaskText: '0'
    }
  },

  computed: {
    fillMaskComp () {
      return this.fillMask === false ? false : this.fillMaskText
    }
  }
}
</script>
