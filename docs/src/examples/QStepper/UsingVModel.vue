<template>
  <q-stepper v-model="currentStep">
    <q-step name="first" title="First Step">
      Step 1
      <q-stepper-navigation>
        <q-btn
          color="primary"
          @click="currentStep = 'second'"
          label="Go to Step 2"
        />
      </q-stepper-navigation>
    </q-step>

    <q-step name="second" title="Second Step">
      Step 2
      <q-stepper-navigation>
        <q-btn
          color="primary"
          @click="currentStep = 'first'"
          label="Go Back"
        />
      </q-stepper-navigation>
    </q-step>
  </q-stepper>
</template>

<script>
export default {
  data () {
    return {
      // we initialize it with first step's name
      currentStep: 'first'
    }
  }
}
</script>
