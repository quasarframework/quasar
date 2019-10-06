<template>
  <div class="q-pa-md" style="max-width: 500px">
    <div>{{ native }}</div>
    <div>{{ name }}</div>
    <div>{{ age }}</div>
    <div>{{ modelAsync }}</div>

    <q-toggle v-model="show" label="Show form" />
    <q-toggle v-model="autofocus" label="Autofocus" />
    <q-toggle v-model="dark" label="Dark" />
    <q-toggle v-model="greedy" label="Greedy" />
    <q-option-group class="q-mb-lg" inline v-model="autofocusEl" dense="dense" :options="autofocusEls" />

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
        <custom-input
          filled
          v-model="customValue"
          label="Custom value *"
          lazy-rules
          :rules="[val => (val && val.length > 0) || 'Please type something']"
          hint="This custom input should be validated first on submit"
        />

        <div>
          <input v-model="native" :autofocus="autofocusEl === 0">
        </div>

        <q-input
          ref="name"
          :dark="dark"
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
          :dark="dark"
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
          :dark="dark"
          filled
          label="Only async *"
          :rules="[
            asyncRule
          ]"
        />

        <q-toggle :dark="dark" v-model="accept" label="I accept the license and terms" :autofocus="autofocusEl === 3" />

        <div>
          <q-btn label="Submit" type="submit" color="primary" />
          <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
        </div>
      </div>
    </q-form>

    <q-form class="q-mt-xl q-pa-md" autocomplete="on" :class="dark ? 'bg-grey-8' : void 0" @submit="onSubmit" @reset="onReset">
      <div class="q-col-gutter-md">
        <div class="q-gutter-md">
          <q-badge :label="user || 'N/A'" />
          <q-badge :label="pwd || 'N/A'" />
        </div>
        <q-input
          v-model="user"
          :dark="dark"
          :color="dark ? 'yellow' : 'primary'"
          filled
          label="Username"
          autocomplete="username"
          :rules="[ val => !!val ]"
        />
        <q-input
          v-model="pwd"
          :dark="dark"
          :color="dark ? 'yellow' : 'primary'"
          filled
          type="password"
          label="Password"
          autocomplete="current-password"
          :rules="[ val => !!val ]"
        />
        <div>
          <q-btn label="Submit" type="submit" color="primary" />
        </div>
      </div>
    </q-form>
  </div>
</template>

<script>
export default {
  components: {
    customInput: {
      props: [ 'value' ],
      render (h) {
        return h('q-field', {
          props: {
            ...this.$attrs,
            value: this.value
          },
          listeners: this.$listeners,
          scopedSlots: {
            control: () => this.value
          }
        })
      }
    }
  },
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
      autofocusEl: 1,

      dark: false,
      greedy: false,

      user: null,
      pwd: null,
      customValue: ''
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
      this.$q.notify('submit')
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
