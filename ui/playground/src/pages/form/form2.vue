<template>
  <div class="q-layout-padding">
    <div class="q-pa-md" style="max-width: 400px">
      <h5>
        Form with async validation rules
      </h5>
      <q-form
        @submit="onSubmit"
        @reset="onReset"
        @validation-success="onVal(true)"
        @validation-error="onVal(false)"
        class="q-gutter-md"
        ref="form"
        greedy
      >
        <q-input
          filled
          v-model="name"
          @update:model-value="programaticSubmit"
          debounce="500"
          label="Your name *"
          hint="Name and surname"
          :rules="[ validateNameAsync ]"
        />

        <q-input
          filled
          type="number"
          v-model="age"
          @update:model-value="programaticSubmit"
          label="Your age *"
          debounce="500"
          :rules="[
            validateAgeRequiredAsync,
            validateAgeRangeAsync,
          ]"
        />

        <q-toggle @update:model-value="programaticSubmit" v-model="accept" label="I accept the license and terms" />

        <div>
          <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
        </div>
      </q-form>
    </div>

    <div class="q-pa-md" style="max-width: 400px">
      <h5>
        Form that clears after submit
      </h5>

      <q-toggle v-model="autofocus" label="Autofocus form" />

      <q-form @submit="onSubmitClear" ref="form" :autofocus="autofocus">
        <q-input dense filled v-model="form.text1" label="Not lazy" :rules="[isReq]" />
        <q-input dense filled v-model="form.text2" label="Lazy" lazy-rules :rules="[isReq]" />

        <q-btn type="submit" label="go" />
      </q-form>
    </div>
  </div>
</template>

<script>
/* eslint-disable */

export default {
  data () {
    return {
      name: null,
      age: null,

      accept: false,

      form: {},
      autofocus: false
    }
  },

  methods: {
    validateNameAsync(val) {
       return new Promise(function(resolve) {
          resolve(val && val.length > 0 || 'Please type something');
       });
    },

    validateAgeRequiredAsync(val) {
       return new Promise(function(resolve) {
          resolve(val !== null && val !== '' || 'Please type your age');
       });
    },

    validateAgeRangeAsync(val) {
       return new Promise(function(resolve) {
          resolve(val > 0 && val < 100 || 'Please type a real age');
       });
    },

    programaticSubmit () {
       const form = this.$refs.form;
       setTimeout(function() {
         form.submit();
       }, 100);
    },
    onSubmit () {
      this.$q.notify({
        color: 'green-4',
        textColor: 'white',
        icon: 'cloud_done',
        message: 'Submitted'
      })
    },

    onReset () {
      this.name = null
      this.age = null
      this.accept = false
    },

    onVal (status) {
      console.log('VALIDATION', status)
    },

    isReq (val) {
      return !!val || 'required'
    },

    onSubmitClear () {
      this.form = {}
      this.$refs.form.reset()
    }
  }
}
</script>
