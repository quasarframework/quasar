<template>
  <div class="q-layout-padding">
    <div class="q-pa-md" style="max-width: 400px">
      <h5>Form with async validation rules</h5>
      <q-form
        @submit="onSubmit"
        @reset="onReset"
        @validation-success="onVal(true)"
        @validation-error="onVal(false)"
        class="q-gutter-md"
        ref="formRef"
        greedy
      >
        <q-input
          filled
          v-model="name"
          @update:model-value="programaticSubmit"
          debounce="500"
          label="Your name *"
          hint="Name and surname"
          :rules="[validateNameAsync]"
        />

        <q-input
          filled
          type="number"
          v-model="age"
          @update:model-value="programaticSubmit"
          label="Your age *"
          debounce="500"
          :rules="[validateAgeRequiredAsync, validateAgeRangeAsync]"
        />

        <q-toggle
          @update:model-value="programaticSubmit"
          v-model="accept"
          label="I accept the license and terms"
        />

        <div>
          <q-btn
            label="Reset"
            type="reset"
            color="primary"
            flat
            class="q-ml-sm"
          />
        </div>
      </q-form>
    </div>

    <div class="q-pa-md" style="max-width: 400px">
      <h5>Form that clears after submit</h5>

      <q-toggle v-model="autofocus" label="Autofocus form" />

      <q-form @submit="onSubmitClear" ref="clearForm" :autofocus="autofocus">
        <q-input
          dense
          filled
          v-model="form.text1"
          label="Not lazy"
          :rules="[isReq]"
        />
        <q-input
          dense
          filled
          v-model="form.text2"
          label="Lazy"
          lazy-rules
          :rules="[isReq]"
        />

        <q-btn type="submit" label="go" />
      </q-form>
    </div>
  </div>
</template>

<script setup>
import { useQuasar } from 'quasar'
import { ref } from 'vue'

const $q = useQuasar()

const name = ref(null)
const age = ref(null)

const accept = ref(false)

const form = ref({})
const autofocus = ref(false)

const formRef = ref(null)
const clearForm = ref(null)

function validateNameAsync(val) {
  return new Promise(resolve => {
    resolve((val && val.length !== 0) || 'Please type something')
  })
}

function validateAgeRequiredAsync(val) {
  return new Promise(resolve => {
    resolve((val !== null && val !== '') || 'Please type your age')
  })
}

function validateAgeRangeAsync(val) {
  return new Promise(resolve => {
    resolve((val > 0 && val < 100) || 'Please type a real age')
  })
}

function programaticSubmit() {
  const formEl = formRef.value
  setTimeout(() => {
    formEl.submit()
  }, 100)
}

function onSubmit() {
  $q.notify({
    color: 'green-4',
    textColor: 'white',
    icon: 'cloud_done',
    message: 'Submitted'
  })
}

function onReset() {
  name.value = null
  age.value = null
  accept.value = false
}

function onVal(status) {
  console.log('VALIDATION', status)
}

function isReq(val) {
  return Boolean(val) || 'required'
}

function onSubmitClear() {
  form.value = {}
  clearForm.value.reset()
}
</script>
