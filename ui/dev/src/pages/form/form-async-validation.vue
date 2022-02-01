<template>
  <div class="q-layout-padding">
    <q-form
      style="max-width: 300px"
      @submit="onSubmit"
      @reset="onReset"
      @validation-success="onValidationChange(true)"
      @validation-error="onValidationChange(false)"
    >
      <q-card bordered>
        <q-card-section>
          <q-banner v-if="submitted" class="bg-positive" dark rounded>Form submitted</q-banner>
          <q-banner v-else class="bg-negative" dark rounded>Form NOT submitted</q-banner>
        </q-card-section>

        <q-card-section v-if="validated !== null">
          <q-banner v-if="validated === true" class="bg-positive" dark rounded>Form valid</q-banner>
          <q-banner v-else class="bg-negative" dark rounded>Form invalid</q-banner>
        </q-card-section>

        <q-card-section>
          <q-toggle v-model="async" label="Async rules" />

          <q-input
            v-model="modelValue"
            :rules="validationRules"
            filled
            label="Input"
            hint="Field is required"
            lazy-rules
            reactive-rules
          />
        </q-card-section>

        <q-card-actions>
          <q-btn
            class="col"
            type="reset"
            color="grey-8"
            flat
            label="Reset"
          />

          <q-btn
            class="col"
            type="submit"
            color="primary"
            unelevated
            label="Submit"
          />
        </q-card-actions>
      </q-card>
    </q-form>
  </div>
</template>

<script>
const wait = (delay = 3000) => new Promise(resolve => setTimeout(resolve, delay))
const required = val => (typeof val === 'string' && val.length > 0) || 'Field is required'
const asyncValidate = val => wait().then(() => required(val))

export default {
  data () {
    return {
      modelValue: '',
      submitted: false,
      validated: null,
      async: true
    }
  },

  computed: {
    validationRules () {
      return this.async === true
        ? [ asyncValidate ]
        : [ required ]
    }
  },

  methods: {
    onReset () {
      this.modelValue = ''
      this.submitted = false
      this.validated = null
    },

    onSubmit () {
      console.log('onSubmit')
      this.submitted = true
    },

    onValidationChange (state) {
      console.log('@validation-' + (state === true ? 'success' : 'error'))
      this.submitted = false
      this.validated = state
    }
  }
}
</script>
