<template>
  <div class="q-pa-md" style="max-width: 500px">
    <q-form
      v-if="show"
      :autofocus="autofocus"
      ref="form"
      :greedy="greedy"
      @submit.prevent.stop="onSubmit"
      @reset="onReset"
      @validation-success="onValidationSuccess"
      @validation-error="onValidationError"
      class="q-pa-md"
      :class="dark ? 'bg-grey-8' : void 0"
    >
      <div class="q-col-gutter-md">
        <q-input
          ref="title"
          :dark="dark"
          filled
          v-model="title"
          label="Your title *"
          label-color="green"
          hint="Title"
          lazy-rules="ondemand"
          :rules="[ val => val && val.length > 0 || 'Please type something']"
          clearable
        />

        <q-input
          ref="name"
          :dark="dark"
          filled
          v-model="name"
          label="Your name *"
          label-color="green"
          hint="Name and surname"
          lazy-rules="ondemand"
          :rules="[ val => val && val.length > 0 || 'Please type something']"
          clearable
        />

        <q-input
          ref="age"
          name="age"
          :dark="dark"
          filled
          type="number"
          v-model="age"
          label="Your age * (lazy)"
          lazy-rules="ondemand"
          :rules="[
            val => val !== null && val !== '' || 'Please type your age',
            val => val > 0 && val < 100 || 'Please type a real age'
          ]"
          clearable
        />

        <q-input
          ref="age"
          :dark="dark"
          filled
          type="number"
          v-model="age"
          label="Your age * (lazy ondemand)"
          lazy-rules="ondemand"
          :rules="[
            val => val !== null && val !== '' || 'Please type your age',
            val => val > 0 && val < 100 || 'Please type a real age'
          ]"
          clearable
        />

        <q-input
          v-model="modelAsync"
          :dark="dark"
          filled
          label="Only async *"
          :rules="[
            asyncRule
          ]"
          clearable
        />

        <q-toggle :dark="dark" v-model="accept" label="I accept the license and terms" :autofocus="autofocusEl === 3" />

        <div>
          <q-btn class="q-mr-sm" label="Validate Age" @click="validateAgeField" />
          <q-btn label="Submit" type="submit" color="primary" :loading="loading" />
          <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" :loading="loading" />
        </div>
      </div>
    </q-form>

  </div>
</template>

<script>

export default {
  data () {
    return {
      loading: false,
      native: null,
      name: null,
      age: null,
      modelAsync: null,

      accept: false,

      titleIsDisabled: false,

      show: true,
      autofocus: true,
      autofocusEls: [
        { value: 0, label: 'Native input' },
        { value: 1, label: 'Name' },
        { value: 2, label: 'Age' },
        { value: 3, label: 'Toggle' },
        { value: 4, label: 'Title' }
      ],
      autofocusEl: 1,

      dark: null,
      greedy: true,

      titles: [ 'Mr.', 'Ms.' ],

      title: null,
      user: null,
      pwd: null,
      customValue: '',
      customInput: true,

      nativeSubmit: false
    }
  },

  computed: {
    formListeners () {
      const listeners = {
        reset: this.onReset
      }

      if (this.nativeSubmit !== true) {
        listeners.submit = this.onSubmit
      }

      return listeners
    }
  },

  methods: {
    async asyncRule (val) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(!!val || '* Required')
        }, 1000)
      })
    },

    validateAgeField () {
      this.$refs.form.validateField('age')
    },

    onSubmit (evt) {
      this.$q.notify('submit')
      console.log('@submit')

      // evt.target.submit()
    },

    onReset () {
      this.native = null
      this.name = null
      this.age = null
      this.modelAsync = null
      this.accept = false

      console.log('@reset')
    },

    onValidationSuccess () {
      console.log('@validation-success')
    },

    onValidationError () {
      console.log('@validation-error')
    },

    onClick () {
      this.$q.notify('click')
      console.log('cliiick')
    }
  }
}
</script>
