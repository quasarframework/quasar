<template>
  <div class="q-layout-padding">
    <div class="column q-gutter-y-md">
      <div class="row items-start">
        <q-toggle label="Lazy Rules" v-model="config.lazy" />
        <q-toggle label="Reactive Rules" v-model="config.reactive" />
        <q-select
          v-if="config.reactive"
          style="width: 300px"
          class="q-ma-sm"
          v-model="lang"
          :options="langs"
          outlined
          label="Change to trigger reactive rules"
        />
      </div>

      <div class="row q-gutter-x-lg">
        <q-form class="column q-gutter-y-sm" style="width: 300px" greedy @submit.prevent>
          <h6>Greedy form</h6>
          <q-toggle label="Enable" v-model="config.greedyForm" />
          <template v-if="config.greedyForm">
            <q-input
              v-for="i in 3"
              :key="i"
              v-model="text[i]"
              :lazy-rules="config.lazy"
              :reactive-rules="config.reactive"
              :label="lang.value[`field${i}`]"
              :rules="rules"
            />

            <q-input
              v-for="i in 3"
              :key="i + 3"
              v-model="text[i + 3]"
              :lazy-rules="config.lazy"
              :reactive-rules="config.reactive"
              :label="lang.value[`field${i + 3}`]"
              :rules="rulesAsync"
            />

            <q-input
              key="7"
              v-model="text[7]"
              lazy-rules="ondemand"
              :reactive-rules="config.reactive"
              :rules="rules"
              label="lazy -> ondemand"
            />

            <q-btn
              type="submit"
              color="primary"
              rounded
              :label="lang.value.submit"
            />
            <q-btn
              type="reset"
              color="primary"
              outline
              rounded
              :label="lang.value.reset"
            />
          </template>
        </q-form>

        <q-form class="column q-gutter-y-sm" style="width: 300px" @submit.prevent>
          <h6>Not-Greedy form</h6>
          <q-toggle label="Enable" v-model="config.notGreedyForm" />
          <template v-if="config.notGreedyForm">
            <q-input
              v-for="i in 3"
              :key="i"
              v-model="text[i]"
              :lazy-rules="config.lazy"
              :reactive-rules="config.reactive"
              :label="lang.value[`field${i}`]"
              :rules="rules"
            />

            <q-input
              v-for="i in 3"
              :key="i + 3"
              v-model="text[i + 3]"
              :lazy-rules="config.lazy"
              :reactive-rules="config.reactive"
              :label="lang.value[`field${i + 3}`]"
              :rules="rulesAsync"
            />

            <q-input
              key="7"
              v-model="text[7]"
              lazy-rules="ondemand"
              :reactive-rules="config.reactive"
              :rules="rules"
              label="lazy -> ondemand"
            />

            <q-btn
              type="submit"
              color="primary"
              rounded
              :label="lang.value.submit"
            />
            <q-btn
              type="reset"
              color="primary"
              outline
              rounded
              :label="lang.value.reset"
            />
          </template>
        </q-form>

        <q-form class="column q-gutter-y-sm" style="width: 300px" @submit.prevent>
          <h6>Not-Greedy form - Async first</h6>
          <q-toggle label="Enable" v-model="config.notGreedyFormAsync" />
          <template v-if="config.notGreedyFormAsync">
            <q-input
              v-for="i in 3"
              :key="i + 3"
              v-model="text[i + 3]"
              :lazy-rules="config.lazy"
              :reactive-rules="config.reactive"
              :label="lang.value[`field${i + 3}`]"
              :rules="rulesAsync"
            />

            <q-input
              v-for="i in 3"
              :key="i"
              v-model="text[i]"
              :lazy-rules="config.lazy"
              :reactive-rules="config.reactive"
              :label="lang.value[`field${i}`]"
              :rules="rules"
            />

            <q-input
              key="7"
              v-model="text[7]"
              lazy-rules="ondemand"
              :reactive-rules="config.reactive"
              :rules="rules"
              label="lazy -> ondemand"
            />

            <q-btn
              type="submit"
              color="primary"
              rounded
              :label="lang.value.submit"
            />
            <q-btn
              type="reset"
              color="primary"
              outline
              rounded
              :label="lang.value.reset"
            />
          </template>
        </q-form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useLocalStorageConfig } from 'src/composables/useLocalStorageConfig.js'

const langs = [
  {
    label: 'English',
    value: { required: 'Required', submit: 'Submit En', reset: 'Reset En' }
  },
  {
    label: 'French',
    value: { required: 'Obligatoire', submit: 'Submit Fr', reset: 'Reset Fr' }
  }
]
langs.forEach(lang => {
  for (let i = 1; i <= 6; i++) {
    lang.value[ `field${ i }` ] = `Field ${ i } ${ lang.label }${ i > 3 && i < 6 ? ' - Async' : '' }`
  }
})

const lang = ref(langs[ 0 ])
const text = ref({
  1: '',
  2: '',
  3: 'filled',
  4: '',
  5: '',
  6: 'filled',
  7: ''
})

const config = useLocalStorageConfig('form-validation-reactive-lazy', {
  lazy: true,
  reactive: true,
  greedyForm: true,
  notGreedyForm: true,
  notGreedyFormAsync: true
})

const rules = computed(() => getRules(lang.value))
const rulesAsync = computed(() => getRulesAsync(lang.value))

function getRules (lang) {
  return [
    val => (typeof val === 'string' && val.trim().length > 0) || lang.value.required
  ]
}

function getRulesAsync (lang) {
  return [
    val => Promise.resolve((typeof val === 'string' && val.trim().length > 0) || lang.value.required)
  ]
}
</script>
