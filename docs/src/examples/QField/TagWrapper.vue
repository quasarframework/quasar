<template>
  <div class="q-pa-md">
    <div class="q-gutter-y-md column" style="max-width: 300px">
      <q-field label="Custom Component Wrapper" stack-label>

        <template v-slot:control>
          <div class="self-center full-width no-outline" tabindex="0">{{divText}}</div>
        </template>
      </q-field>

      <q-field v-model="labelText" tag="label" label="Form Control Field Wrapper" stack-label clearable>
        <template v-slot:control="{ id, modelValue, emitValue }">
          <input :id="id" class="q-field__input" :value="modelValue" @input="e => emitValue(e.target.value)">
        </template>
      </q-field>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    return {
      divText: ref('div tag content'),
      labelText: ref('label tag placeholder')
    }
  }
}
</script>
