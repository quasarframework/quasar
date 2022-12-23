<template>
  <form @submit.prevent="simulateSubmit" class="q-pa-md">
    <!-- a simple text field watching for the enter key release -->
    <q-input
      filled
      color="teal"
      hint="Type then hit Enter key above"
      v-model="test"
    />

    <!--
      A button with v-model set to submit.
      v-model scope variable must be a strict Boolean
    -->
    <div class="row justify-end">
      <q-btn
        type="submit"
        :loading="submitting"
        label="Save"
        class="q-mt-md"
        color="teal"
      >
        <template v-slot:loading>
          <q-spinner-facebook />
        </template>
      </q-btn>
    </div>
  </form>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    const test = ref('')
    const submitting = ref(false)

    function simulateSubmit () {
      submitting.value = true

      // Simulating a delay here.
      // When we are done, we reset "submitting"
      // Boolean to false to restore the
      // initial state.
      setTimeout(() => {
        // delay simulated, we are done,
        // now restoring submit to its initial state
        submitting.value = false
      }, 3000)
    }

    return {
      test,
      submitting,
      simulateSubmit
    }
  }
}
</script>
