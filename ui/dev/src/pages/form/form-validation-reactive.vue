<template>
  <div class="q-layout-padding">
    <div class="column q-gutter-y-md">
      <q-select
        style="width: 300px"
        v-model="lang"
        :options="langs"
        label="Language"
      />

      <div class="row q-gutter-x-lg">
        <q-form class="column q-gutter-y-sm" style="width: 300px" greedy @submit.prevent>
          <h6>Greedy form</h6>
          <q-input
            v-for="i in 3"
            :key="i"
            v-model="text[i]"
            lazy-rules
            reactive-rules
            :label="lang.value[`field${i}`]"
            :rules="rules"
          />

          <q-input
            v-for="i in 3"
            :key="i + 3"
            v-model="text[i + 3]"
            lazy-rules
            reactive-rules
            :label="lang.value[`field${i + 3}`]"
            :rules="rulesAsync"
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
        </q-form>

        <q-form class="column q-gutter-y-sm" style="width: 300px" @submit.prevent>
          <h6>Not-Greedy form</h6>
          <q-input
            v-for="i in 3"
            :key="i"
            v-model="text[i]"
            lazy-rules
            reactive-rules
            :label="lang.value[`field${i}`]"
            :rules="rules"
          />

          <q-input
            v-for="i in 3"
            :key="i + 3"
            v-model="text[i + 3]"
            lazy-rules
            reactive-rules
            :label="lang.value[`field${i + 3}`]"
            :rules="rulesAsync"
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
        </q-form>

        <q-form class="column q-gutter-y-sm" style="width: 300px" @submit.prevent>
          <h6>Not-Greedy form - Async first</h6>
          <q-input
            v-for="i in 3"
            :key="i + 3"
            v-model="text[i + 3]"
            lazy-rules
            reactive-rules
            :label="lang.value[`field${i + 3}`]"
            :rules="rulesAsync"
          />

          <q-input
            v-for="i in 3"
            :key="i"
            v-model="text[i]"
            lazy-rules
            reactive-rules
            :label="lang.value[`field${i}`]"
            :rules="rules"
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
        </q-form>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
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
    lang.value[`field${i}`] = `Field ${i} ${lang.label}${i > 3 ? ' - Async' : ''}`
  }
})
export default {
  data () {
    return {
      langs,
      lang: langs[0],
      text: {
        1: '',
        2: '',
        3: 'filled',
        4: '',
        5: '',
        6: 'filled'
      }
    }
  },
  computed: {
    rules () {
      return this.getRules(this.lang)
    },
    rulesAsync () {
      return this.getRulesAsync(this.lang)
    }
  },
  methods: {
    getRules (lang) {
      return [
        val => (typeof val === 'string' && val.trim().length > 0) || lang.value.required
      ]
    },
    getRulesAsync (lang) {
      return [
        val => Promise.resolve((typeof val === 'string' && val.trim().length > 0) || lang.value.required)
      ]
    }
  }
}
</script>
