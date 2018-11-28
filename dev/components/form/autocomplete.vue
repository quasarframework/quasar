<template>
  <div>
    <div class="layout-padding" style="max-width: 600px;">
      <p class="caption" style="margin-bottom: 40px">
        These examples feature countries autocomplete.<br>
        On desktop, Escape key closes the suggestions popover and you can navigate with keyboard arrow keys. Selection is made with either mouse/finger tap or by Enter key.
      </p>

      <q-search @change="onChange" @input="onInput" v-model="terms" placeholder="Start typing a country name">
        <q-autocomplete @search="search" @selected="selected" />
      </q-search>

      <q-search @change="onChange" @input="onInput" v-model="terms" placeholder="Country name - Trigger on focus">
        <q-autocomplete @search="search" @selected="selected" :min-characters="0" />
      </q-search>

      <q-search @change="onChange" @input="onInput" v-model="terms" hide-underline placeholder="Start typing a country name (hide underline)">
        <q-autocomplete @search="search" @selected="selected" />
      </q-search>

      <q-search @change="val => { terms = val; onChange(val) }" @input="onInput" :value="terms" placeholder="Start typing a country name (onChange)">
        <q-autocomplete @search="search" @selected="selected" />
      </q-search>

      <p class="caption">Usage of valueField for dynamic data</p>
      <q-search @change="onChange" @input="onInput" v-model="terms" float-label="Country name - Trigger on focus - valueField is icon">
        <q-autocomplete @search="search" @selected="selected" :min-characters="0" value-field="icon" />
      </q-search>

      <p class="caption">Number selected: {{ JSON.stringify(termsN) }}</p>
      <q-search type="number" v-model="termsN" placeholder="Start typing a number">
        <q-autocomplete :static-data="{field: 'value', list: numbers}" @selected="selected" />
      </q-search>

      <q-search type="number" v-model="termsN" placeholder="Start typing a number - long list">
        <q-autocomplete :static-data="{field: 'value', list: lots}" @selected="selected" :max-results="100" max-height="200px" />
      </q-search>

      <q-input @change="onChange" @input="onInput" v-model="terms" placeholder="Start typing a country name">
        <q-autocomplete @search="search" @selected="selected" />
      </q-input>

      <q-input type="textarea" @change="onChange" @input="onInput" v-model="terms" placeholder="Start typing a country name" stack-label="Autocomplete in textarea">
        <q-autocomplete @search="search" @selected="selected" />
      </q-input>

      <q-input @change="val => { terms = val; onChange(val) }" @input="onInput" :value="terms" placeholder="Start typing a country name (onChange)">
        <q-autocomplete @search="search" @selected="selected" />
      </q-input>

      <q-search inverted v-model="terms" placeholder="Start typing a country name">
        <q-autocomplete @search="search" @selected="selected" />
      </q-search>

      <p class="caption">Maximum of 2 results at a time</p>
      <q-search inverted color="amber" v-model="terms">
        <q-autocomplete
          @search="search"
          :max-results="2"
          @selected="selected"
        />
      </q-search>
      <q-search inverted color="white" :dark="false" v-model="terms">
        <q-autocomplete
          @search="search"
          :max-results="2"
          @selected="selected"
        />
      </q-search>

      <p class="caption">Minimum 3 characters to trigger search</p>
      <q-input color="amber" v-model="terms" placeholder="Type 'fre'">
        <q-autocomplete
          @search="search"
          :min-characters="3"
          @selected="selected"
        />
      </q-input>

      <p class="caption">Custom debounce before triggering search</p>
      <q-input color="amber" v-model="terms" placeholder="One second debounce">
        <q-autocomplete
          @search="search"
          :debounce="1000"
          @selected="selected"
        />
      </q-input>

      <p class="caption">Static List</p>
      <q-search inverted color="secondary" v-model="terms" placeholder="Featuring static data">
        <q-autocomplete
          :static-data="{field: 'value', list: countries}"
          @selected="selected"
        />
      </q-search>

      <p class="caption">Usage of valueField for Static List</p>
      <q-search inverted color="dark" class="q-mb-sm" v-model="terms" float-label="Featuring static data - valueField is icon and searching in label">
        <q-autocomplete
          :static-data="{field: 'label', list: countriesNoValue}"
          value-field="icon"
          @selected="selected"
        />
      </q-search>

      <q-search inverted color="dark" class="q-mb-sm" v-model="terms" float-label="Featuring static data - valueField is icon + label and searching in label">
        <q-autocomplete
          :static-data="{field: 'label', list: countriesNoValue}"
          :value-field="v => `${ v.icon } - ${ v.label }`"
          @selected="selected"
        />
      </q-search>

      <q-chips-input inverted color="dark" class="q-mb-sm" v-model="termsL" float-label="Featuring static data - valueField is icon + label and searching in label">
        <q-autocomplete
          :static-data="{field: 'label', list: countriesNoValue}"
          :value-field="v => `${ v.icon } - ${ v.label }`"
          :debounce="250"
          @selected="selected"
        />
      </q-chips-input>

      <p class="caption">Separator between results</p>
      <q-search v-model="terms">
        <q-autocomplete
          separator
          @search="search"
          @selected="selected"
        />
      </q-search>

      <p class="caption">Open on focus</p>
      <q-search inverted color="dark" class="q-mb-sm" v-model="terms1" float-label="Featuring static data - 1">
        <q-autocomplete
          :static-data="{field: 'label', list: countries}"
          :min-characters="0"
        />
      </q-search>
      <q-search inverted color="dark" class="q-mb-sm" v-model="terms2" float-label="Featuring static data - 2">
        <q-autocomplete
          :static-data="{field: 'label', list: countries}"
          :min-characters="0"
        />
      </q-search>
    </div>
  </div>
</template>

<script>
import { uid, filter } from 'quasar'
import countries from 'data/autocomplete.json'

const icons = ['alarm', 'email', 'search', 'build', 'card_giftcard', 'perm_identity', 'receipt', 'schedule', 'speaker_phone', 'archive', 'weekend', 'battery_charging_full']

function getRandomIcon () {
  return icons[Math.floor(Math.random() * icons.length)]
}
function getRandomStamp () {
  if (Math.floor(Math.random() * 50) % 3 === 0) {
    return `${Math.floor(Math.random() * 10)} min`
  }
}
function getRandomSecondLabel () {
  if (Math.floor(Math.random() * 50) % 4 === 0) {
    return `UID: ${uid().substring(0, 8)}`
  }
}
function parseCountries () {
  return countries.map(country => {
    return {
      label: country,
      sublabel: getRandomSecondLabel(),
      icon: getRandomIcon(),
      stamp: getRandomStamp(),
      value: country
    }
  })
}

function parseCountriesNoValue () {
  return countries.map(country => {
    return {
      label: country,
      sublabel: getRandomSecondLabel(),
      icon: getRandomIcon(),
      stamp: getRandomStamp()
    }
  })
}

export default {
  data () {
    return {
      terms: '',
      terms1: '',
      terms2: '',
      termsN: null,
      termsL: [],
      countries: parseCountries(),
      countriesNoValue: parseCountriesNoValue(),
      numbers: [1, 2, 3, 4, 5, 1111, 2222, 3333, 4444, 5555].map(v => ({ label: String(v), value: v })),
      lots: Array(100).fill(0).map((v, i) => ({ label: String(i), value: i }))
    }
  },
  methods: {
    search (terms, done) {
      setTimeout(() => {
        done(filter(terms, {field: 'value', list: parseCountries()}))
      }, 1000)
    },
    selected (item) {
      this.$q.notify(`Selected suggestion ${JSON.stringify(item)}`)
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
