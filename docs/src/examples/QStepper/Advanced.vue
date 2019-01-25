<template>
  <q-stepper
    v-model="currentStep"
    color="secondary"
    ref="stepper"
    alternative-labels
  >
    <q-step
      name="first"
      title="Ad Style"
    >
      Step 1
      <q-stepper-navigation>
        <q-btn color="secondary" @click="$refs.stepper.next()" label="Continue" />
      </q-stepper-navigation>
    </q-step>

    <q-step
      name="second"
      title="Custom Channels"
      caption="Alert message"
      error
    >
      Step 2
      <q-stepper-navigation>
        <q-btn color="secondary" flat @click="$refs.stepper.previous()" label="Back" />
        <q-btn color="secondary" @click="$refs.stepper.next()" label="Next" />
      </q-stepper-navigation>
    </q-step>

    <q-step
      name="third"
      title="Get Code"
    >
      Step 3
      <q-stepper-navigation>
        <q-btn color="secondary" flat @click="$refs.stepper.previous()" label="Back" />
        <q-btn color="secondary" @click="$refs.stepper.next()" label="Next" />
      </q-stepper-navigation>
    </q-step>

    <q-step
      name="fourth"
      title="Disabled Step"
      disable
    >
      Step 4
      <q-stepper-navigation>
        <q-btn color="secondary" flat @click="$refs.stepper.previous()" label="Back" />
        <q-btn color="secondary" @click="$refs.stepper.next()" label="Next" />
      </q-stepper-navigation>
    </q-step>

    <q-step
      name="fifth"
      title="Finalize"
    >
      Step 5
      <q-stepper-navigation>
        <q-btn color="secondary" flat @click="$refs.stepper.previous()" label="Back" />
      </q-stepper-navigation>
    </q-step>
  </q-stepper>
</template>

<script>
export default {
  data () {
    return {
      currentStep: 'first'
    }
  }
}
</script>
