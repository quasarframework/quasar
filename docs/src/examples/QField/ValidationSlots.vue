<template>
  <div class="q-pa-md" style="max-width: 300px">
    <q-field
      filled
      :value="slider"
      label="Move it above 30"
      bottom-slots
      hint="Max value is 30"
      :error="!isValid"
    >
      <template v-slot:control>
        <q-slider v-model="slider" :min="0" :max="100" label label-always class="q-mt-lg" style="width: 200px" />
      </template>
      <template v-slot:error>
        Please use a maximum value of 30.
      </template>
    </q-field>
  </div>
</template>

<script>
export default {
  data () {
    return {
      slider: 10
    }
  },

  computed: {
    isValid () {
      return this.slider <= 30
    }
  }
}
</script>
