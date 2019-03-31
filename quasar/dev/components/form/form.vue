<template>
  <div class="q-pa-md" style="max-width: 300px">
    <div>{{ native }}</div>
    <div>{{ name }}</div>
    <div>{{ age }}</div>
    <div>{{ modelAsync }}</div>

    <q-toggle v-model="show" label="Show form" />
    <q-toggle v-model="autofocus" label="Autofocus" />
    <q-option-group class="q-mb-lg" inline v-model="autofocusEl" dense="dense" :options="autofocusEls" />

    <q-form
      v-if="show"
      :autofocus="autofocus"
      ref="form"
      @submit="onSubmit"
      @reset="onReset"
      @validation-success="onValidationSuccess"
      @validation-error="onValidationError"
      class="q-gutter-md"
    >
      <input v-model="native" :autofocus="autofocusEl === 0">

      <q-input
        ref="name"
        filled
        v-model="name"
        label="Your name *"
        hint="Name and surname"
        lazy-rules
        :rules="[ val => val && val.length > 0 || 'Please type something']"
        :autofocus="autofocusEl === 1"
      />

      <q-input
        ref="age"
        filled
        type="number"
        v-model="age"
        label="Your age *"
        lazy-rules
        :rules="[
          val => val !== null && val !== '' || 'Please type your age',
          val => val > 0 && val < 100 || 'Please type a real age'
        ]"
        :autofocus="autofocusEl === 2"
      />

      <q-input
        v-model="modelAsync"
        filled
        label="Only async *"
        :rules="[
          asyncRule
        ]"
      />

      <q-toggle v-model="accept" label="I accept the license and terms" :autofocus="autofocusEl === 3" />

      <div>
        <q-btn label="Submit" type="submit" color="primary" />
        <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
      </div>
    </q-form>
  </div>
</template>

<script>
export default {
  data () {
    return {
      native: null,
      name: null,
      age: null,
      modelAsync: null,

      accept: false,

      show: true,
      autofocus: true,
      autofocusEls: [
        { value: 0, label: 'Native input' },
        { value: 1, label: 'Name' },
        { value: 2, label: 'Age' },
        { value: 3, label: 'Toggle' }
      ],
      autofocusEl: 1
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

    onSubmit () {
      console.log('@submit')
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
    }
  }
}
</script>
