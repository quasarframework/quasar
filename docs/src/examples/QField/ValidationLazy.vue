<template>
  <div class="q-pa-md" style="max-width: 300px">
    <q-field
      ref="slider"
      filled
      :value="slider"
      label="Value must be less than 60"
      hint="Validation starts after first blur"
      :rules="[
        val => val < 60 || 'Please set value to maximum 60',
      ]"
      lazy-rules
    >
      <template v-slot:control>
        <q-slider
          v-model="slider"
          :min="0"
          :max="100"
          label
          label-always
          class="q-mt-lg"
          style="width: 200px"
        />
      </template>
    </q-field>

    <q-btn class="q-mt-sm" label="Reset Validation" @click="reset" color="primary"/>
  </div>
</template>

<script>
export default {
  data () {
    return {
      slider: 50
    }
  },

  methods: {
    reset () {
      this.$refs.slider.resetValidation()
    }
  }
}
</script>
