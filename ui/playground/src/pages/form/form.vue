<template>
  <div class="q-pa-md" style="max-width: 500px">
    <div>{{ native || 'null' }}</div>
    <div>{{ name || 'null' }}</div>
    <div>{{ age || 'null' }}</div>
    <div>{{ modelAsync || 'null' }}</div>

    <q-toggle v-model="show" label="Show form" />
    <q-toggle v-model="autofocus" label="Autofocus" />
    <q-toggle v-model="dark" label="Dark" :false-value="null" />
    <q-toggle v-model="greedy" label="Greedy" />
    <q-toggle v-model="loading" label="Loading" />
    <q-toggle v-model="customInput" label="Custom Input" />
    <q-toggle v-model="titleIsDisabled" label="Disable Title QSelect" />
    <q-option-group
      class="q-mb-lg"
      inline
      v-model="autofocusEl"
      dense="dense"
      :options="autofocusEls"
    />

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
        <CustomInput
          v-if="customInput"
          filled
          v-model="customValue"
          label="Custom value *"
          lazy-rules
          :rules="[val => (val && val.length > 0) || 'Please type something']"
          hint="This custom input should be validated first on submit"
        />

        <div>
          <input v-model="native" :autofocus="autofocusEl === 0" />
        </div>

        <my-comp />

        <q-select
          ref="titleRef"
          name="title"
          v-model="title"
          :options="titles"
          :dark="dark"
          :color="dark ? 'yellow' : 'primary'"
          filled
          :disable="titleIsDisabled"
          label="Title"
          :rules="[val => !!val]"
          :autofocus="autofocusEl === 4"
          clearable
        />

        <q-input
          ref="nameRef"
          :dark="dark"
          filled
          v-model="name"
          label="Your name *"
          label-color="green"
          hint="Name and surname"
          lazy-rules
          :rules="[val => (val && val.length > 0) || 'Please type something']"
          :autofocus="autofocusEl === 1"
          clearable
        />

        <q-input
          ref="ageRef"
          :dark="dark"
          filled
          type="number"
          v-model="age"
          label="Your age * (lazy)"
          lazy-rules
          :rules="[
            val => (val !== null && val !== '') || 'Please type your age',
            val => (val > 0 && val < 100) || 'Please type a real age'
          ]"
          :autofocus="autofocusEl === 2"
          clearable
        />

        <q-input
          ref="ageRef"
          :dark="dark"
          filled
          type="number"
          v-model="age"
          label="Your age * (lazy ondemand)"
          lazy-rules="ondemand"
          :rules="[
            val => (val !== null && val !== '') || 'Please type your age',
            val => (val > 0 && val < 100) || 'Please type a real age'
          ]"
          clearable
        />

        <q-input
          v-model="modelAsync"
          :dark="dark"
          filled
          label="Only async *"
          :rules="[asyncRule]"
          clearable
        />

        <q-toggle
          :dark="dark"
          v-model="accept"
          label="I accept the license and terms"
          :autofocus="autofocusEl === 3"
        />

        <div>
          <q-btn
            label="Submit"
            type="submit"
            color="primary"
            :loading="loading"
          />
          <q-btn
            label="Reset"
            type="reset"
            color="primary"
            flat
            class="q-ml-sm"
            :loading="loading"
          />
        </div>
      </div>
    </q-form>

    <div class="q-mt-xl q-pa-sm bg-grey-2 rounded-borders">
      <q-toggle
        v-model="nativeSubmit"
        label="Use native submit (else it calls onSubmit)"
      />
    </div>

    <q-form
      class="q-pa-md"
      autocomplete="on"
      :class="dark ? 'bg-grey-8' : void 0"
      v-on="formListeners"
      action="http://localhost:4444/upload"
      method="post"
      enctype="multipart/form-data"
      target="wind1"
    >
      <div class="q-col-gutter-md">
        <div class="q-gutter-md">
          <q-badge :label="user || 'N/A'" />
          <q-badge :label="pwd || 'N/A'" />
        </div>
        <q-select
          name="title"
          v-model="title"
          :options="titles"
          :dark="dark"
          :color="dark ? 'yellow' : 'primary'"
          filled
          label="Title"
          :rules="[val => !!val]"
        />
        <q-input
          name="user"
          v-model="user"
          :dark="dark"
          :color="dark ? 'yellow' : 'primary'"
          filled
          label="Username"
          autocomplete="username"
          :rules="[val => !!val]"
        />
        <q-input
          name="password"
          v-model="pwd"
          :dark="dark"
          :color="dark ? 'yellow' : 'primary'"
          filled
          type="password"
          label="Password"
          autocomplete="current-password"
          :rules="[val => !!val]"
        />
        <div>
          <q-btn label="Submit" type="submit" color="primary" />
        </div>
      </div>
    </q-form>
  </div>
</template>

<script setup>
import { computed, h, ref } from 'vue'
import { QCard, QCardSection, QField, QFormChildMixin, useQuasar } from 'quasar'

const CustomInput = {
  props: ['modelValue'],
  render() {
    return h(
      QField,
      {
        modelValue: this.modelValue,
        stackLabel: true
      },
      {
        control: () => this.modelValue || 'null'
      }
    )
  }
}

const MyComp = {
  mixins: [QFormChildMixin],

  render() {
    return h('div', {}, [
      h(
        QCard,
        {
          class: 'text-subtitle2',
          bordered: true,
          flat: true
        },
        () => h(QCardSection, () => ['a custom component'])
      )
    ])
  },

  methods: {
    validate() {
      console.log('called my-comp.validate()')
      return true
    }
  }
}

const $q = useQuasar()

const loading = ref(false)
const native = ref(null)
const name = ref(null)
const age = ref(null)
const modelAsync = ref(null)

const accept = ref(false)

const titleIsDisabled = ref(false)

const show = ref(true)
const autofocus = ref(true)
const autofocusEls = ref([
  { value: 0, label: 'Native input' },
  { value: 1, label: 'Name' },
  { value: 2, label: 'Age' },
  { value: 3, label: 'Toggle' },
  { value: 4, label: 'Title' }
])
const autofocusEl = ref(1)

const dark = ref(null)
const greedy = ref(false)

const titles = ref(['Mr.', 'Ms.'])

const title = ref(null)
const user = ref(null)
const pwd = ref(null)
const customValue = ref('')
const customInput = ref(true)

const nativeSubmit = ref(false)

const formListeners = computed(() => {
  const listeners = {
    reset: onReset
  }

  if (nativeSubmit.value !== true) {
    listeners.submit = onSubmit
  }

  return listeners
})

function asyncRule(val) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(Boolean(val) || '* Required')
    }, 1000)
  })
}

function onSubmit(evt) {
  $q.notify('submit')
  console.log('@submit')

  // evt.target.submit()
}

function onReset() {
  native.value = null
  name.value = null
  age.value = null
  modelAsync.value = null
  accept.value = false

  console.log('@reset')
}

function onValidationSuccess() {
  console.log('@validation-success')
}

function onValidationError() {
  console.log('@validation-error')
}

function onClick() {
  $q.notify('click')
  console.log('cliiick')
}
</script>
