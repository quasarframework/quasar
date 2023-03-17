<template>
  <div class="q-layout-padding row q-gutter-x-md">
    <div class="column q-gutter-y-md" style="max-width: 200px">
      <q-input type="number" outlined v-model.number="model1" label="R null" required clearable />
      <q-input type="number" outlined v-model.number="model2" label="R 1.3" required clearable />
      <q-input type="number" outlined v-model.number="model2" label="R 1.3 step 0.1" :step="0.1" required clearable />
      <q-input type="number" outlined v-model.number="model3" label="R 'aaa'" required clearable />
      <q-input type="number" outlined v-model.number="model4" label="R '111'" required clearable />
      <q-input type="number" outlined v-model.number="model5" label="R 10 (max 8)" :max="8" required clearable />
    </div>

    <div class="column q-gutter-y-md" style="max-width: 200px">
      <q-input type="number" outlined placeholder="Placeholder" v-model.number="model1" label="R null" required />
      <q-input type="number" outlined placeholder="Placeholder" v-model.number="model2" label="R 1.3" required />
      <q-input type="number" outlined placeholder="Placeholder" v-model.number="model2" label="R 1.3 step 0.1" :step="0.1" required />
      <q-input type="number" outlined placeholder="Placeholder" v-model.number="model3" label="R 'aaa'" required />
      <q-input type="number" outlined placeholder="Placeholder" v-model.number="model4" label="R '111'" required />
      <q-input type="number" outlined placeholder="Placeholder" v-model.number="model5" label="R 10 (max 8)" :max="8" required />
    </div>

    <div class="column q-gutter-y-md" style="max-width: 200px">
      <q-input type="number" outlined v-model.number="model1" label="null" />
      <q-input type="number" outlined v-model.number="model2" label="1.3" />
      <q-input type="number" outlined v-model.number="model2" label="1.3 step 0.1" :step="0.1" />
      <q-input type="number" outlined v-model.number="model3" label="'aaa'" />
      <q-input type="number" outlined v-model.number="model4" label="'111'" />
      <q-input type="number" outlined v-model.number="model5" label="10 (max 8)" :max="8" />
    </div>

    <div class="column q-gutter-y-md" style="max-width: 200px">
      <q-input type="number" outlined placeholder="Placeholder" v-model.number="model1" label="null" />
      <q-input type="number" outlined placeholder="Placeholder" v-model.number="model2" label="1.3" />
      <q-input type="number" outlined placeholder="Placeholder" v-model.number="model2" label="1.3 step 0.1" :step="0.1" />
      <q-input type="number" outlined placeholder="Placeholder" v-model.number="model3" label="'aaa'" />
      <q-input type="number" outlined placeholder="Placeholder" v-model.number="model4" label="'111'" />
      <q-input type="number" outlined placeholder="Placeholder" v-model.number="model5" label="10 (max 8)" :max="8" />
    </div>

    <div class="column q-gutter-y-md" style="max-width: 200px">
      <q-input type="date" outlined v-model="model1" label="R null" required />
      <q-input type="date" outlined v-model="modelD" label="R date valid" required />
      <q-input type="date" outlined v-model="modelDi" label="R date invalid" required />
    </div>

    <div class="column q-gutter-y-md" style="max-width: 200px">
      <q-input type="date" outlined v-model="model1" label="null" />
      <q-input type="date" outlined v-model="modelD" label="date valid" />
      <q-input type="date" outlined v-model="modelDi" label="date invalid" />
    </div>

    <div class="column q-gutter-y-md" style="max-width: 200px">
      <q-input type="date" outlined placeholder="Placeholder" v-model="model1" label="R null" required />
      <q-input type="date" outlined placeholder="Placeholder" v-model="modelD" label="R date valid" required />
      <q-input type="date" outlined placeholder="Placeholder" v-model="modelDi" label="R date invalid" required />
    </div>

    <div class="column q-gutter-y-md" style="max-width: 200px">
      <q-input type="date" outlined placeholder="Placeholder" v-model="model1" label="null" />
      <q-input type="date" outlined placeholder="Placeholder" v-model="modelD" label="date valid" />
      <q-input type="date" outlined placeholder="Placeholder" v-model="modelDi" label="date invalid" />
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      model1: null,
      model2: 1.3,
      model3: 'aaa',
      model4: '111',
      model5: 10,
      modelD: '2023-03-25',
      modelDi: '25/03/2023'
    }
  },
  methods: {
  }
}
</script>

<style lang="sass">
.q-input:has(input:valid)
  outline: 2px solid green !important
  outline-offset: 3px

.q-input:has(input:invalid)
  outline: 2px solid red !important
  outline-offset: 3px

.q-input:has(input:placeholder-shown)
  background-color: rgba(200, 100, 100, .3)
</style>
