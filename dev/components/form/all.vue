<template>
  <div>
    <div class="layout-padding" style="max-width: 600px;">
      <p class="caption">Country selected: {{ JSON.stringify(terms) }}</p>
      <q-search class="q-mt-sm" @change="onChange" @input="onInput" @clear="onClear" v-model="terms" float-label="Start typing a country name - search">
        <q-autocomplete :static-data="{field: 'value', list: countries}" @selected="selected" />
      </q-search>
      <q-search inverted class="q-mt-sm" @change="val => { terms = val; onChange(val) }" @input="onInput" @clear="onClear" :value="terms" float-label="Start typing a country name -search (onChange)">
        <q-autocomplete :static-data="{field: 'value', list: countries}" @selected="selected" />
      </q-search>
      <q-input clearable class="q-mt-sm" @change="onChange" @input="onInput" @clear="onClear" v-model="terms" float-label="Start typing a country name - input">
        <q-autocomplete :static-data="{field: 'value', list: countries}" @selected="selected" />
      </q-input>
      <q-input inverted clearable class="q-mt-sm" @change="val => { terms = val; onChange(val) }" @input="onInput" @clear="onClear" :value="terms" float-label="Start typing a country name - input (onChange)">
        <q-autocomplete :static-data="{field: 'value', list: countries}" @selected="selected" />
      </q-input>
      <q-input clearable class="q-mt-sm" type="textarea" @change="onChange" @input="onInput" @clear="onClear" v-model="terms" float-label="Start typing a country name - textarea">
        <q-autocomplete :static-data="{field: 'value', list: countries}" @selected="selected" />
      </q-input>
      <q-input inverted clearable class="q-mt-sm" type="textarea" @change="val => { terms = val; onChange(val) }" @input="onInput" @clear="onClear" :value="terms" float-label="Start typing a country name - textarea (onChange)">
        <q-autocomplete :static-data="{field: 'value', list: countries}" @selected="selected" />
      </q-input>

      <p class="caption">Number selected: {{ JSON.stringify(termsN) }}</p>
      <q-search class="q-mt-sm" @change="onChange" @input="onInput" @clear="onClear" type="number" v-model="termsN" float-label="Start typing a number">
        <q-autocomplete :static-data="{field: 'value', list: numbers}" @selected="selected" />
      </q-search>
      <q-search inverted class="q-mt-sm" @change="val => { termsN = val; onChange(val) }" @input="onInput" @clear="onClear" type="number" v-model="termsN" float-label="Start typing a number (onChange)">
        <q-autocomplete :static-data="{field: 'value', list: numbers}" @selected="selected" />
      </q-search>
      <q-input clearable class="q-mt-sm" @change="onChange" @input="onInput" @clear="onClear" v-model="termsN" float-label="Start typing a number - input">
        <q-autocomplete :static-data="{field: 'value', list: numbers}" @selected="selected" />
      </q-input>
      <q-input inverted clearable class="q-mt-sm" @change="val => { termsN = val; onChange(val) }" @input="onInput" @clear="onClear" :value="termsN" float-label="Start typing a number - input (onChange)">
        <q-autocomplete :static-data="{field: 'value', list: numbers}" @selected="selected" />
      </q-input>
      <q-input clearable class="q-mt-sm" type="textarea" @change="onChange" @input="onInput" @clear="onClear" v-model="termsN" float-label="Start typing a number - textarea">
        <q-autocomplete :static-data="{field: 'value', list: numbers}" @selected="selected" />
      </q-input>
      <q-input inverted clearable class="q-mt-sm" type="textarea" @change="val => { termsN = val; onChange(val) }" @input="onInput" @clear="onClear" :value="termsN" float-label="Start typing a number - textarea (onChange)">
        <q-autocomplete :static-data="{field: 'value', list: numbers}" @selected="selected" />
      </q-input>
    </div>
  </div>
</template>

<script>
import countries from 'data/autocomplete.json'

export default {
  data () {
    return {
      terms: '',
      termsN: null,
      countries: countries.map(country => ({ label: country, value: country })),
      numbers: [1, 2, 3, 4, 5, 1111, 2222, 3333, 4444, 5555].map(v => ({ label: String(v), value: v }))
    }
  },
  methods: {
    selected (item) {
      this.$q.notify(`Selected suggestion ${JSON.stringify(item)}`)
    },
    onClear (val) {
      console.log('@clear', JSON.stringify(val))
    },
    onChange (val) {
      console.log('@change', JSON.stringify(val))
    },
    onInput (val) {
      console.log('@input', JSON.stringify(val))
    }
  }
}
</script>
