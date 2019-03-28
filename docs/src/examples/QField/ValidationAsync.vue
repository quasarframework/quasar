<template>
  <div class="q-pa-md" style="max-width: 350px">
    <q-field
      ref="slider"
      filled
      :value="slider"
      hint="Pick between 10 and 60"
      :rules="[ myRule ]"
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
      slider: 10
    }
  },

  methods: {
    myRule (val) {
      // simulating a delay

      return new Promise((resolve, reject) => {
        setTimeout(() => {
          // call
          //  resolve(true)
          //     --> content is valid
          //  resolve(false)
          //     --> content is NOT valid, no error message
          //  resolve(error_message)
          //     --> content is NOT valid, we have error message
          resolve((val >= 10 && val <= 60) || 'Please set value to maximum 60')

          // calling reject(...) will also mark the input
          // as having an error, but there will not be any
          // error message displayed below the input
          // (only in browser console)
        }, 1000)
      })
    },

    reset () {
      this.$refs.slider.resetValidation()
    }
  }
}
</script>
