<template>
  <div class="q-layout-padding row q-gutter-md">
    <div class="column q-gutter-y-md" style="max-width: 200px">
      <q-input
        class="q-input--test-label"
        type="number"
        outlined
        v-model.number="model1"
        label="Req null"
        required
        clearable
      />
      <q-input
        class="q-input--test-label"
        type="number"
        outlined
        v-model.number="model2"
        label="Req 1.3"
        required
        clearable
      />
      <q-input
        class="q-input--test-label"
        type="number"
        outlined
        v-model.number="model2"
        label="Req 1.3 step 0.1"
        :step="0.1"
        required
        clearable
      />
      <q-input
        class="q-input--test-label"
        type="number"
        outlined
        v-model.number="model3"
        label="Req 'aaa'"
        required
        clearable
      />
      <q-input
        class="q-input--test-label"
        type="number"
        outlined
        v-model.number="model4"
        label="Req '111'"
        required
        clearable
      />
      <q-input
        class="q-input--test-label"
        type="number"
        outlined
        v-model.number="model5"
        label="Req 10 (max 8)"
        :max="8"
        required
        clearable
      />
    </div>

    <div class="column q-gutter-y-md" style="max-width: 200px">
      <q-input
        class="q-input--test-label"
        type="number"
        outlined
        placeholder="Placeholder"
        v-model.number="model1"
        label="Req null"
        required
      />
      <q-input
        class="q-input--test-label"
        type="number"
        outlined
        placeholder="Placeholder"
        v-model.number="model2"
        label="Req 1.3"
        required
      />
      <q-input
        class="q-input--test-label"
        type="number"
        outlined
        placeholder="Placeholder"
        v-model.number="model2"
        label="Req 1.3 step 0.1"
        :step="0.1"
        required
      />
      <q-input
        class="q-input--test-label"
        type="number"
        outlined
        placeholder="Placeholder"
        v-model.number="model3"
        label="Req 'aaa'"
        required
      />
      <q-input
        class="q-input--test-label"
        type="number"
        outlined
        placeholder="Placeholder"
        v-model.number="model4"
        label="Req '111'"
        required
      />
      <q-input
        class="q-input--test-label"
        type="number"
        outlined
        placeholder="Placeholder"
        v-model.number="model5"
        label="Req 10 (max 8)"
        :max="8"
        required
      />
    </div>

    <div class="column q-gutter-y-md" style="max-width: 200px">
      <q-input
        class="q-input--test-label"
        type="number"
        outlined
        v-model.number="model1"
        label="null"
      />
      <q-input
        class="q-input--test-label"
        type="number"
        outlined
        v-model.number="model2"
        label="1.3"
      />
      <q-input
        class="q-input--test-label"
        type="number"
        outlined
        v-model.number="model2"
        label="1.3 step 0.1"
        :step="0.1"
      />
      <q-input
        class="q-input--test-label"
        type="number"
        outlined
        v-model.number="model3"
        label="'aaa'"
      />
      <q-input
        class="q-input--test-label"
        type="number"
        outlined
        v-model.number="model4"
        label="'111'"
      />
      <q-input
        class="q-input--test-label"
        type="number"
        outlined
        v-model.number="model5"
        label="10 (max 8)"
        :max="8"
      />
    </div>

    <div class="column q-gutter-y-md" style="max-width: 200px">
      <q-input
        class="q-input--test-label"
        type="number"
        outlined
        placeholder="Placeholder"
        v-model.number="model1"
        label="null"
      />
      <q-input
        class="q-input--test-label"
        type="number"
        outlined
        placeholder="Placeholder"
        v-model.number="model2"
        label="1.3"
      />
      <q-input
        class="q-input--test-label"
        type="number"
        outlined
        placeholder="Placeholder"
        v-model.number="model2"
        label="1.3 step 0.1"
        :step="0.1"
      />
      <q-input
        class="q-input--test-label"
        type="number"
        outlined
        placeholder="Placeholder"
        v-model.number="model3"
        label="'aaa'"
      />
      <q-input
        class="q-input--test-label"
        type="number"
        outlined
        placeholder="Placeholder"
        v-model.number="model4"
        label="'111'"
      />
      <q-input
        class="q-input--test-label"
        type="number"
        outlined
        placeholder="Placeholder"
        v-model.number="model5"
        label="10 (max 8)"
        :max="8"
      />
    </div>

    <div class="column q-gutter-y-md" style="max-width: 200px">
      <q-input
        class="q-input--test-label"
        type="date"
        outlined
        v-model="model1"
        label="Req null"
        required
      />
      <q-input
        class="q-input--test-label"
        type="date"
        outlined
        v-model="modelD"
        label="Req date valid"
        required
      />
      <q-input
        class="q-input--test-label"
        type="date"
        outlined
        v-model="modelDi"
        label="Req date invalid"
        required
      />
    </div>

    <div class="column q-gutter-y-md" style="max-width: 200px">
      <q-input
        class="q-input--test-label"
        type="date"
        outlined
        v-model="model1"
        label="null"
      />
      <q-input
        class="q-input--test-label"
        type="date"
        outlined
        v-model="modelD"
        label="date valid"
      />
      <q-input
        class="q-input--test-label"
        type="date"
        outlined
        v-model="modelDi"
        label="date invalid"
      />
    </div>

    <div class="column q-gutter-y-md" style="max-width: 200px">
      <q-input
        class="q-input--test-label"
        type="date"
        outlined
        placeholder="Placeholder"
        v-model="model1"
        label="Req null"
        required
      />
      <q-input
        class="q-input--test-label"
        type="date"
        outlined
        placeholder="Placeholder"
        v-model="modelD"
        label="Req date valid"
        required
      />
      <q-input
        class="q-input--test-label"
        type="date"
        outlined
        placeholder="Placeholder"
        v-model="modelDi"
        label="Req date invalid"
        required
      />
    </div>

    <div class="column q-gutter-y-md" style="max-width: 200px">
      <q-input
        class="q-input--test-label"
        type="date"
        outlined
        placeholder="Placeholder"
        v-model="model1"
        label="null"
      />
      <q-input
        class="q-input--test-label"
        type="date"
        outlined
        placeholder="Placeholder"
        v-model="modelD"
        label="date valid"
      />
      <q-input
        class="q-input--test-label"
        type="date"
        outlined
        placeholder="Placeholder"
        v-model="modelDi"
        label="date invalid"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const model1 = ref(null)
const model2 = ref(1.3)
const model3 = ref('aaa')
const model4 = ref('111')
const model5 = ref(10)
const modelD = ref('2023-03-25')
const modelDi = ref('25/03/2023')
</script>

<style lang="sass">
.q-input--test-label
  outline-offset: 2px
  border-radius: 2px

  &:has(input:valid)
    outline: 2px solid green !important
  &:has(input:invalid)
    outline: 2px solid red !important
  &:has(input:placeholder-shown)
    background-color: rgba(200, 100, 100, .3)
</style>
