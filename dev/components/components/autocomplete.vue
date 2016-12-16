<template>
  <div>
    <div class="layout-padding" style="max-width: 600px;">
      <h5>Type countries</h5>

      <q-autocomplete v-model="terms" @search="search" set-width>
        <q-search v-model="terms" />
      </q-autocomplete>

      <br><br>

      <p class="caption">Minimum 3 characters to trigger search</p>
      <q-autocomplete v-model="terms" @search="search" :minCharacters="3">
        <input v-model="terms" class="full-width"/>
      </q-autocomplete>

      <br><br>

      <p class="caption">Fills with its own input field</p>
      <q-autocomplete v-model="terms" @search="search" />

      <br><br>

      <p class="caption">Static List</p>
      <q-autocomplete v-model="terms" set-width :static-data="{field: 'value', list: countries}" @search="search" />
    </div>
  </div>
</template>

<script>
import { Utils } from 'quasar'
import countries from 'data/countries.json'

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
    return `UID: ${Utils.uid()}`
  }
}
function parseCountries () {
  return countries.map(country => {
    return {
      label: country,
      secondLabel: getRandomSecondLabel(),
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
      console.log(`Triggered search for "${terms}"`)
      setTimeout(() => {
        done(Utils.filter(terms, {field: 'value', list: parseCountries()}))
      }, 1000)
    }
  }
}
</script>
