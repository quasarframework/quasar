<template>
  <div class="q-pa-md" style="max-width: 300px">
    <form
      @submit.prevent.stop="onSubmit"
      @reset.prevent.stop="onReset"
      class="q-gutter-md"
    >
      <q-input
        ref="nameRef"
        filled
        v-model="name"
        label="Your name *"
        hint="Name and surname"
        lazy-rules
        :rules="nameRules"
      />

      <q-input
        ref="ageRef"
        filled
        type="number"
        v-model.number="age"
        label="Your age *"
        lazy-rules
        :rules="ageRules"
      />

      <q-toggle v-model="accept" label="I accept the license and terms" />

      <div>
        <q-btn label="Submit" type="submit" color="primary" />
        <q-btn
          label="Reset"
          type="reset"
          color="primary"
          flat
          class="q-ml-sm"
        />
      </div>
    </form>
  </div>
</template>

<script setup>
import { useQuasar } from 'quasar'
import { ref, useTemplateRef } from 'vue'

const $q = useQuasar()

const name = ref(null)
const nameRef = useTemplateRef('nameRef')
const nameRules = [val => (val && val.length !== 0) || 'Please type something']

const age = ref(null)
const ageRef = useTemplateRef('ageRef')
const ageRules = [
  val => (val !== null && val !== '') || 'Please type your age',
  val => (val > 0 && val < 100) || 'Please type a real age'
]

const accept = ref(false)

function onSubmit() {
  nameRef.value.validate()
  ageRef.value.validate()

  if (nameRef.value.hasError || ageRef.value.hasError) {
    // form has error
  } else if (accept.value !== true) {
    $q.notify({
      color: 'negative',
      message: 'You need to accept the license and terms first'
    })
  } else {
    $q.notify({
      icon: 'done',
      color: 'positive',
      message: 'Submitted'
    })
  }
}

function onReset() {
  name.value = null
  age.value = null

  nameRef.value.resetValidation()
  ageRef.value.resetValidation()
}
</script>
