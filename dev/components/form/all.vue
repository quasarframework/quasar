<template>
  <div>
    <div class="layout-padding" style="max-width: 650px;">
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
      <q-search inverted class="q-mt-sm" @change="val => { termsN = val; onChange(val) }" @input="onInput" @clear="onClear" type="number" :value="termsN" float-label="Start typing a number (onChange)">
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

      <p class="caption">Options selected: {{ JSON.stringify(options) }}</p>
      <div class="row gutter-sm">
        <div>
          <div>
            <q-checkbox @change="onChange" @input="onInput" v-model="options" val="Romania" label="Romania" />
          </div>
          <div>
            <q-checkbox @change="val => { options = val; onChange(val) }" @input="onInput" :value="options" val="Albania" label="Albania (onChange)" />
          </div>
        </div>
        <q-option-group
          type="checkbox"
          v-model="options"
          @change="onChange"
          @input="onInput"
          :options="[
            { label: 'Poland', value: 'Poland' },
            { label: 'Portugal', value: 'Portugal' }
          ]"
        />
        <q-option-group
          type="checkbox"
          :value="options"
          @change="val => { options = val; onChange(val) }"
          @input="onInput"
          :options="[
            { label: 'Finland (onChange)', value: 'Finland' },
            { label: 'France (onChange)', value: 'France' }
          ]"
        />
      </div>

      <p class="caption">Options selected: {{ JSON.stringify(options) }}</p>
      <div class="row gutter-sm">
        <div>
          <div>
            <q-toggle @change="onChange" @input="onInput" v-model="options" val="Romania" label="Romania" />
          </div>
          <div>
            <q-toggle @change="val => { options = val; onChange(val) }" @input="onInput" :value="options" val="Albania" label="Albania (onChange)" />
          </div>
        </div>
        <q-option-group
          type="toggle"
          v-model="options"
          @change="onChange"
          @input="onInput"
          :options="[
            { label: 'Poland', value: 'Poland' },
            { label: 'Portugal', value: 'Portugal' }
          ]"
        />
        <q-option-group
          type="toggle"
          :value="options"
          @change="val => { options = val; onChange(val) }"
          @input="onInput"
          :options="[
            { label: 'Finland (onChange)', value: 'Finland' },
            { label: 'France (onChange)', value: 'France' }
          ]"
        />
      </div>

      <p class="caption">Option selected: {{ JSON.stringify(option) }}</p>
      <div class="row gutter-sm">
        <div>
          <div>
            <q-radio @change="onChange" @input="onInput" v-model="option" val="Romania" label="Romania" />
          </div>
          <div>
            <q-radio @change="val => { option = val; onChange(val) }" @input="onInput" :value="option" val="Albania" label="Albania (onChange)" />
          </div>
        </div>
        <q-option-group
          type="radio"
          v-model="option"
          @change="onChange"
          @input="onInput"
          :options="[
            { label: 'Poland', value: 'Poland' },
            { label: 'Portugal', value: 'Portugal' }
          ]"
        />
        <q-option-group
          type="radio"
          :value="option"
          @change="val => { option = val; onChange(val) }"
          @input="onInput"
          :options="[
            { label: 'Finland (onChange)', value: 'Finland' },
            { label: 'France (onChange)', value: 'France' }
          ]"
        />
      </div>

      <p class="caption">Options selected: {{ JSON.stringify(options) }}</p>
      <q-chips-input @change="onChange" @input="onInput" @clear="onClear" float-label="List" v-model="options" />
      <q-chips-input inverted class="q-mt-sm" @change="val => { options = val; onChange(val) }" @input="onInput" @clear="onClear" float-label="List (onChange)" :value="options" />

      <p class="caption">Color selected: {{ JSON.stringify(color) }}</p>
      <q-color clearable @change="onChange" @input="onInput" @clear="onClear" v-model="color" float-label="Color" />
      <q-color inverted clearable class="q-mt-sm" @change="val => { color = val; onChange(val) }" @input="onInput" @clear="onClear" :value="color" float-label="Color (onChange)" />
      <q-color clearable class="q-mt-sm" @change="onChange" @input="onInput" @clear="onClear" v-model="color" :default-selection="defaultColor" float-label="Color (default #0f0)" />
      <q-color inverted clearable class="q-mt-sm" @change="val => { color = val; onChange(val) }" @input="onInput" @clear="onClear" :value="color" :default-selection="defaultColor" float-label="Color (default #0f0, onChange)" />
      <p class="caption">Color selected: {{ JSON.stringify(colorP) }}</p>
      <div class="row gutter-sm">
        <div>
          <div>Color</div>
          <q-color-picker clearable @change="onChange" @input="onInput" @clear="onClear" v-model="colorP" />
        </div>
        <div>
          <div>Color (onChange)</div>
          <q-color-picker inverted clearable @change="val => { colorP = val; onChange(val) }" @input="onInput" @clear="onClear" :value="colorP" />
        </div>
      </div>

      <p class="caption">Date selected: {{ JSON.stringify(date) }}</p>
      <q-datetime type="date" formatModel="date" clearable @change="onChange" @input="onInput" @clear="onClear" v-model="date" float-label="Date" />
      <q-datetime type="date" formatModel="date" inverted clearable class="q-mt-sm" @change="val => { date = val; onChange(val) }" @input="onInput" @clear="onClear" :value="date" float-label="Date (onChange)" />
      <q-datetime type="date" formatModel="date" clearable class="q-mt-sm" @change="onChange" @input="onInput" @clear="onClear" v-model="date" :default-selection="defaultDate" float-label="Date (default 2020-06-15)" />
      <q-datetime type="date" formatModel="date" inverted clearable class="q-mt-sm" @change="val => { date = val; onChange(val) }" @input="onInput" @clear="onClear" :value="date" :default-selection="defaultDate" float-label="Date (default 2020-06-15, onChange)" />

      <p class="caption">Text: {{ JSON.stringify(terms) }}</p>
      <q-input clearable @change="onChange" @input="onInput" @clear="onClear" v-model="terms" float-label="Text" />
      <q-input inverted clearable class="q-mt-sm" @change="val => { terms = val; onChange(val) }" @input="onInput" @clear="onClear" :value="terms" float-label="Text (onChange)" />

      <p class="caption">Textarea: {{ JSON.stringify(terms) }}</p>
      <q-input type="textarea" clearable @change="onChange" @input="onInput" @clear="onClear" v-model="terms" float-label="Textarea" />
      <q-input type="textarea" inverted clearable class="q-mt-sm" @change="val => { terms = val; onChange(val) }" @input="onInput" @clear="onClear" :value="terms" float-label="Textarea (onChange)" />

      <p class="caption">Password: {{ JSON.stringify(terms) }}</p>
      <q-input type="password" clearable @change="onChange" @input="onInput" @clear="onClear" v-model="terms" float-label="Password" />
      <q-input type="password" inverted clearable class="q-mt-sm" @change="val => { terms = val; onChange(val) }" @input="onInput" @clear="onClear" :value="terms" float-label="Password (onChange)" />

      <p class="caption">Number: {{ JSON.stringify(termsN) }}</p>
      <q-input type="number" clearable @change="onChange" @input="onInput" @clear="onClear" v-model="termsN" float-label="Number" />
      <q-input type="number" inverted clearable class="q-mt-sm" @change="val => { termsN = val; onChange(val) }" @input="onInput" @clear="onClear" :value="termsN" float-label="Number (onChange)" />

      <p class="caption">Number (step {{step}}): {{ JSON.stringify(termsNS) }}</p>
      <q-input type="number" clearable :step="step" @change="onChange" @input="onInput" @clear="onClear" v-model="termsNS" float-label="Number" />
      <q-input type="number" inverted clearable :step="step" class="q-mt-sm" @change="val => { termsNS = val; onChange(val) }" @input="onInput" @clear="onClear" :value="termsNS" float-label="Number (onChange)" />

      <p class="caption">Number (decimals {{decimals}}): {{ JSON.stringify(termsNS) }}</p>
      <q-input type="number" clearable :decimals="decimals" @change="onChange" @input="onInput" @clear="onClear" v-model="termsNS" float-label="Number" />
      <q-input type="number" inverted clearable :decimals="decimals" class="q-mt-sm" @change="val => { termsNS = val; onChange(val) }" @input="onInput" @clear="onClear" :value="termsNS" float-label="Number (onChange)" />

      <p class="caption">Knob: {{ JSON.stringify(termsK) }}</p>
      <div class="row gutter-sm">
        <div class="col-6">
          <div>Between {{minVal}} and {{maxVal}}, step {{step}}</div>
          <q-knob :step="step" @change="onChange" @input="onInput" v-model="termsK" :min="minVal" :max="maxVal" />
        </div>
        <div class="col-6">
          <div>Between {{minVal}} and {{maxVal}}, step {{step}} (onChange)</div>
          <q-knob :step="step" @change="val => { termsK = val; onChange(val) }" @input="onInput" :value="termsK" :min="minVal" :max="maxVal" />
        </div>
        <div class="col-6">
          <div>Between {{minVal}} and {{maxVal}}, step {{step}}, decimals {{decimals}}</div>
          <q-knob :step="step" :decimals="decimals" @change="onChange" @input="onInput" v-model="termsK" :min="minVal" :max="maxVal" />
        </div>
        <div class="col-6">
          <div>Between {{minVal}} and {{maxVal}}, step {{step}}, decimals {{decimals}} (onChange)</div>
          <q-knob :step="step" :decimals="decimals" @change="val => { termsK = val; onChange(val) }" @input="onInput" :value="termsK" :min="minVal" :max="maxVal" />
        </div>
      </div>

      <p class="caption">Slider: {{ JSON.stringify(termsK) }}</p>
      <div class="row gutter-sm">
        <div class="col-6">
          <div>Between {{minVal}} and {{maxVal}}, step {{step}}</div>
          <q-slider :step="step" @change="onChange" @input="onInput" v-model="termsK" :min="minVal" :max="maxVal" />
        </div>
        <div class="col-6">
          <div>Between {{minVal}} and {{maxVal}}, step {{step}} (onChange)</div>
          <q-slider :step="step" @change="val => { termsK = val; onChange(val) }" @input="onInput" :value="termsK" :min="minVal" :max="maxVal" />
        </div>
        <div class="col-6">
          <div>Between {{minVal}} and {{maxVal}}, step {{step}}, decimals {{decimals}}</div>
          <q-slider :step="step" :decimals="decimals" @change="onChange" @input="onInput" v-model="termsK" :min="minVal" :max="maxVal" />
        </div>
        <div class="col-6">
          <div>Between {{minVal}} and {{maxVal}}, step {{step}}, decimals {{decimals}} (onChange)</div>
          <q-slider :step="step" :decimals="decimals" @change="val => { termsK = val; onChange(val) }" @input="onInput" :value="termsK" :min="minVal" :max="maxVal" />
        </div>
      </div>

      <p class="caption">Range: {{ JSON.stringify(termsR) }}</p>
      <div class="row gutter-sm">
        <div class="col-6">
          <div>Between {{minVal}} and {{maxVal}}, step {{step}}</div>
          <q-range drag-range :step="step" @change="onChange" @input="onInput" v-model="termsR" :min="minVal" :max="maxVal" />
        </div>
        <div class="col-6">
          <div>Between {{minVal}} and {{maxVal}}, step {{step}} (onChange)</div>
          <q-range drag-range :step="step" @change="val => { termsR = val; onChange(val) }" @input="onInput" :value="termsR" :min="minVal" :max="maxVal" />
        </div>
        <div class="col-6">
          <div>Between {{minVal}} and {{maxVal}}, step {{step}}, decimals {{decimals}}</div>
          <q-range drag-range :step="step" :decimals="decimals" @change="onChange" @input="onInput" v-model="termsR" :min="minVal" :max="maxVal" />
        </div>
        <div class="col-6">
          <div>Between {{minVal}} and {{maxVal}}, step {{step}}, decimals {{decimals}} (onChange)</div>
          <q-range drag-range :step="step" :decimals="decimals" @change="val => { termsR = val; onChange(val) }" @input="onInput" :value="termsR" :min="minVal" :max="maxVal" />
        </div>
      </div>

      <p class="caption">Selected option: {{ JSON.stringify(option) }}</p>
      <q-select clearable @change="onChange" @input="onInput" @clear="onClear" v-model="option" :options="countries" float-label="Select" />
      <q-select inverted clearable class="q-mt-sm" @change="val => { option = val; onChange(val) }" @input="onInput" @clear="onClear" :value="option" :options="countries" float-label="Select (onChange)" />

      <p class="caption">Selected options: {{ JSON.stringify(options) }}</p>
      <q-select multiple clearable @change="onChange" @input="onInput" @clear="onClear" v-model="options" :options="countries" float-label="Select multiple" />
      <q-select multiple inverted clearable class="q-mt-sm" @change="val => { options = val; onChange(val) }" @input="onInput" @clear="onClear" :value="options" :options="countries" float-label="Select multiple (onChange)" />
      <q-select multiple chips clearable class="q-mt-sm" @change="onChange" @input="onInput" @clear="onClear" v-model="options" :options="countries" float-label="Select multiple - chips" />
      <q-select multiple chips inverted clearable class="q-mt-sm" @change="val => { options = val; onChange(val) }" @input="onInput" @clear="onClear" :value="options" :options="countries" float-label="Select multiple - chips (onChange)" />
    </div>
  </div>
</template>

<script>
import countries from 'data/autocomplete.json'

const icons = ['alarm', 'email', 'search', 'build', 'card_giftcard', 'perm_identity', 'receipt', 'schedule', 'speaker_phone', 'archive', 'weekend', 'battery_charging_full']

function randomColor () {
  const v = Math.random()
  if (v < 0.2) {
    return 'red'
  }
  if (v > 0.8) {
    return 'green'
  }
}

function randomIcon () {
  const v = Math.floor(Math.random() * (30 + icons.length))
  return v >= 30 ? icons[v - 30] : null
}

export default {
  data () {
    return {
      terms: '',
      termsN: null,
      termsNS: null,
      termsK: 0.5,
      termsR: {
        min: 0.5,
        max: 0.8
      },
      option: null,
      options: [],
      color: '#0ff',
      colorP: '#ff0',
      defaultColor: '#0f0',
      date: new Date(),
      defaultDate: '2020-06-15T18:30:30',
      minVal: 0,
      maxVal: 2,
      step: 0.01,
      decimals: 1,
      countries: countries.slice(0, 20).map(country => ({ label: country, value: country, color: randomColor(), rightIcon: randomIcon() })),
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
