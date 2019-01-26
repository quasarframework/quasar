<template>
  <q-stepper
    ref="stepper"
    v-model="currentStep"
    color="primary"
    header-nav
  >
    <q-step name="first" title="First Step" done>
      First Step
    </q-step>
    <q-step name="second" title="Second Step">
      Second Step
    </q-step>
    <q-step name="third" title="Third Step">
      Third Step
    </q-step>

    <template slot="navigation">
      <q-stepper-navigation>
        <q-btn
          @click="$refs.stepper.previous()"
          label="Previous"
        />
        <q-btn
          @click="$refs.stepper.next()"
          label="Next"
        />
      </q-stepper-navigation>
    </template>
  </q-stepper>
</template>

<script>
export default {
  data () {
    return {
      currentStep: 'second'
    }
  }
}
</script>
