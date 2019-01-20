<template>
  <div class="q-pa-md q-gutter-sm">
    <div class="text-h6">
      Internal validation
      <q-btn label="Reset" @click="reset" color="primary" flat/>
    </div>

    <q-input
      ref="input1"
      v-bind="{[type]: true}"
      v-model="model1"
      label="Label *"
      :rules="[
          val => !!val || '* Required'
        ]"
    />

    <q-input
      ref="input2"
      v-bind="{[type]: true}"
      v-model="model2"
      label="len <= 3"
      counter
      hint="Type something"
      :rules="[
          val => val.length <= 3 || 'Please use maximum 3 characters'
        ]"
    >
      <q-icon slot="append" name="close" @click="model2 = ''" class="cursor-pointer"/>
    </q-input>

    <q-input
      ref="input3"
      v-bind="{[type]: true}"
      v-model="model3"
      label="Required, Lazy, Len < 2"
      counter
      hint="Validation starts after first blur"
      :rules="[
          val => !!val || '* Required',
          val => val.length < 2 || 'Please use maximum 1 character',
        ]"
      lazy-rules
    />

    <div class="text-h6 q-mt-xl">External validation</div>
    <div class="q-gutter-sm">
      <q-toggle v-model="error" label="Error state"/>
      <q-radio v-model="errorMessage" val="First error" label="First error"/>
      <q-radio v-model="errorMessage" val="Second error" label="Second error"/>
    </div>
    <q-input
      ref="inputExternal"
      v-bind="{[type]: true}"
      v-model="modelExternal"
      label="Label"
      hint="Hint"
      :error="error"
      :error-message="errorMessage"
    />

    <q-input
      ref="inputExternal"
      v-bind="{[type]: true}"
      v-model="modelExternal"
      label="Label"
      hint="Hint"
      :error="error"
      style="margin-bottom: 30px"
    >
      <div slot="error">Slotted error message</div>
      <div slot="error">Second slotted error message</div>
    </q-input>
  </div>

</template>

<script>
export default {
  data () {
    const n = 3

    const data = {
      n,
      type: 'filled',
      modelExternal: '',
      error: false,
      errorMessage: 'First error'
    }

    for (let i = 1; i <= n; i++) {
      data['model' + i] = ''
    }

    return data
  },

  methods: {
    reset () {
      for (let i = 1; i <= this.n; i++) {
        this.$refs['input' + i].resetValidation()
      }
    }
  }
}
</script>
