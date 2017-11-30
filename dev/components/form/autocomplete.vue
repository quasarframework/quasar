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

      <q-search @change="val => { terms = val; onChange(val) }" @input="onInput" :value="terms" placeholder="Start typing a country name (onChange)">
        <q-autocomplete @search="search" @selected="selected" />
      </q-search>

      <q-input @change="onChange" @input="onInput" v-model="terms" placeholder="Start typing a country name">
        <q-autocomplete @search="search" @selected="selected" />
      </q-input>

      <q-input @change="val => { terms = val; onChange(val) }" @input="onInput" :value="terms" placeholder="Start typing a country name (onChange)">
        <q-autocomplete @search="search" @selected="selected" />
      </q-input>

      <q-search inverted v-model="terms" placeholder="Start typing a country name">
        <q-autocomplete @search="search" @selected="selected"  />
      </q-search>

      <p class="caption">Maximum of 2 results at a time</p>
      <q-search inverted color="amber" v-model="terms">
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

      <p class="caption">Separator between results</p>
      <q-search v-model="terms">
        <q-autocomplete
          separator
          @search="search"
          @selected="selected"
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

export default {
  data () {
    return {
      terms: '',
      countries: parseCountries()
    }
  },
  methods: {
    search (terms, done) {
      setTimeout(() => {
        done(filter(terms, {field: 'value', list: parseCountries()}))
      }, 1000)
    },
    selected (item) {
      this.$q.notify(`Selected suggestion "${item.label}"`)
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
