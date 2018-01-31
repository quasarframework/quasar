<template>
  <div>
    <div class="layout-padding column" style="height: 100vh;" :class="dark ? 'text-orange bg-black' : null">
      <div class="col-auto">
        <q-checkbox toggleIndeterminate :dark="dark" v-model="dark" label="Dark mode" />
        <q-toggle :dark="dark" v-model="disable" label="Disabled" />
        <q-toggle :dark="dark" v-model="readonly" label="Readonly" />
        <q-toggle :dark="dark" v-model="clearable" label="Clearable" />
        <q-btn size="sm" color="negative" label="Clear with null" @click="clear(null)" />
        <q-btn size="sm" color="negative" label="Clear with undefined" @click="clear(void 0)" />
        <q-btn size="sm" color="positive" label="Fill" @click="fill()" />
      </div>
      <q-scroll-area class="col q-pa-md">
        <p class="q-subtitle">Country selected: {{ JSON.stringify(terms) }}</p>
        <q-search :dark="dark" :disable="disable" :readonly="readonly" :clearable="clearable" class="q-ma-sm" @change="onChange" @input="onInput" @clear="onClear" v-model="terms" float-label="Start typing a country name - search">
          <q-autocomplete :static-data="{field: 'value', list: countries}" @selected="selected" />
        </q-search>
        <q-search :dark="dark" :color="dark === false ? 'white' : 'primary'" :disable="disable" :readonly="readonly" inverted :clearable="clearable" class="q-ma-sm" @change="val => { terms = val; onChange(val) }" @input="onInput" @clear="onClear" :value="terms" float-label="Start typing a country name -search (onChange)">
          <q-autocomplete :static-data="{field: 'value', list: countries}" @selected="selected" />
        </q-search>
        <q-input :dark="dark" :disable="disable" :readonly="readonly" :clearable="clearable" class="q-ma-sm" @change="onChange" @input="onInput" @clear="onClear" v-model="terms" float-label="Start typing a country name - input">
          <q-autocomplete :static-data="{field: 'value', list: countries}" @selected="selected" />
        </q-input>
        <q-input :dark="dark" :color="dark === false ? 'white' : 'primary'" :disable="disable" :readonly="readonly" inverted :clearable="clearable" class="q-ma-sm" @change="val => { terms = val; onChange(val) }" @input="onInput" @clear="onClear" :value="terms" float-label="Start typing a country name - input (onChange)">
          <q-autocomplete :static-data="{field: 'value', list: countries}" @selected="selected" />
        </q-input>
        <q-input :dark="dark" :disable="disable" :readonly="readonly" :clearable="clearable" class="q-ma-sm" type="textarea" @change="onChange" @input="onInput" @clear="onClear" v-model="terms" float-label="Start typing a country name - textarea">
          <q-autocomplete :static-data="{field: 'value', list: countries}" @selected="selected" />
        </q-input>
        <q-input :dark="dark" :color="dark === false ? 'white' : 'primary'" :disable="disable" :readonly="readonly" inverted :clearable="clearable" class="q-ma-sm" type="textarea" @change="val => { terms = val; onChange(val) }" @input="onInput" @clear="onClear" :value="terms" float-label="Start typing a country name - textarea (onChange)">
          <q-autocomplete :static-data="{field: 'value', list: countries}" @selected="selected" />
        </q-input>

        <p class="q-subtitle">Number selected: {{ JSON.stringify(termsN) }}</p>
        <q-search :dark="dark" :disable="disable" :readonly="readonly" :clearable="clearable" class="q-ma-sm" @change="onChange" @input="onInput" @clear="onClear" type="number" v-model="termsN" float-label="Start typing a number">
          <q-autocomplete :static-data="{field: 'value', list: numbers}" @selected="selected" />
        </q-search>
        <q-search :dark="dark" :color="dark === false ? 'white' : 'primary'" :disable="disable" :readonly="readonly" inverted :clearable="clearable" class="q-ma-sm" @change="val => { termsN = val; onChange(val) }" @input="onInput" @clear="onClear" type="number" :value="termsN" float-label="Start typing a number (onChange)">
          <q-autocomplete :static-data="{field: 'value', list: numbers}" @selected="selected" />
        </q-search>
        <q-input :dark="dark" :disable="disable" :readonly="readonly" :clearable="clearable" class="q-ma-sm" @change="onChange" @input="onInput" @clear="onClear" v-model="termsN" float-label="Start typing a number - input">
          <q-autocomplete :static-data="{field: 'value', list: numbers}" @selected="selected" />
        </q-input>
        <q-input :dark="dark" :color="dark === false ? 'white' : 'primary'" :disable="disable" :readonly="readonly" inverted :clearable="clearable" class="q-ma-sm" @change="val => { termsN = val; onChange(val) }" @input="onInput" @clear="onClear" :value="termsN" float-label="Start typing a number - input (onChange)">
          <q-autocomplete :static-data="{field: 'value', list: numbers}" @selected="selected" />
        </q-input>
        <q-input :dark="dark" :disable="disable" :readonly="readonly" :clearable="clearable" class="q-ma-sm" type="textarea" @change="onChange" @input="onInput" @clear="onClear" v-model="termsN" float-label="Start typing a number - textarea">
          <q-autocomplete :static-data="{field: 'value', list: numbers}" @selected="selected" />
        </q-input>
        <q-input :dark="dark" :color="dark === false ? 'white' : 'primary'" :disable="disable" :readonly="readonly" inverted :clearable="clearable" class="q-ma-sm" type="textarea" @change="val => { termsN = val; onChange(val) }" @input="onInput" @clear="onClear" :value="termsN" float-label="Start typing a number - textarea (onChange)">
          <q-autocomplete :static-data="{field: 'value', list: numbers}" @selected="selected" />
        </q-input>

        <p class="q-subtitle">Options selected: {{ JSON.stringify(options) }}</p>
        <div class="row gutter-sm">
          <div>
            <div>
              <q-checkbox :dark="dark" :disable="disable" :readonly="readonly" @change="onChange" @input="onInput" v-model="options" val="Romania" label="Romania" />
            </div>
            <div>
              <q-checkbox :dark="dark" :disable="disable" :readonly="readonly" @change="val => { options = val; onChange(val) }" @input="onInput" :value="options" val="Albania" label="Albania (onChange)" />
            </div>
          </div>
          <q-option-group :dark="dark" :disable="disable" :readonly="readonly"
            type="checkbox"
            v-model="options"
            @change="onChange"
            @input="onInput"
            :options="[
              { label: 'Poland', value: 'Poland' },
              { label: 'Portugal', value: 'Portugal' }
            ]"
          />
          <q-option-group :dark="dark" :disable="disable" :readonly="readonly"
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

        <p class="q-subtitle">Options selected: {{ JSON.stringify(options) }}</p>
        <div class="row gutter-sm">
          <div>
            <div>
              <q-toggle :dark="dark" :disable="disable" :readonly="readonly" @change="onChange" @input="onInput" v-model="options" val="Romania" label="Romania" />
            </div>
            <div>
              <q-toggle :dark="dark" :disable="disable" :readonly="readonly" @change="val => { options = val; onChange(val) }" @input="onInput" :value="options" val="Albania" label="Albania (onChange)" />
            </div>
          </div>
          <q-option-group :dark="dark" :disable="disable" :readonly="readonly"
            type="toggle"
            v-model="options"
            @change="onChange"
            @input="onInput"
            :options="[
              { label: 'Poland', value: 'Poland' },
              { label: 'Portugal', value: 'Portugal' }
            ]"
          />
          <q-option-group :dark="dark" :disable="disable" :readonly="readonly"
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

        <p class="q-subtitle">Option selected: {{ JSON.stringify(option) }}</p>
        <div class="row gutter-sm">
          <div>
            <div>
              <q-radio :dark="dark" :disable="disable" :readonly="readonly" @change="onChange" @input="onInput" v-model="option" val="Romania" label="Romania" />
            </div>
            <div>
              <q-radio :dark="dark" :disable="disable" :readonly="readonly" @change="val => { option = val; onChange(val) }" @input="onInput" :value="option" val="Albania" label="Albania (onChange)" />
            </div>
          </div>
          <q-option-group :dark="dark" :disable="disable" :readonly="readonly"
            type="radio"
            v-model="option"
            @change="onChange"
            @input="onInput"
            :options="[
              { label: 'Poland', value: 'Poland' },
              { label: 'Portugal', value: 'Portugal' }
            ]"
          />
          <q-option-group :dark="dark" :disable="disable" :readonly="readonly"
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

        <p class="q-subtitle">Options selected: {{ JSON.stringify(options) }}</p>
        <q-chips-input :dark="dark" :disable="disable" :readonly="readonly" class="q-ma-sm" @change="onChange" @input="onInput" @clear="onClear" float-label="List" v-model="options" />
        <q-chips-input :dark="dark" :color="dark === false ? 'white' : 'primary'" :disable="disable" :readonly="readonly" inverted class="q-ma-sm" @change="val => { options = val; onChange(val) }" @input="onInput" @clear="onClear" float-label="List (onChange)" :value="options" />

        <p class="q-subtitle">Color selected: {{ JSON.stringify(color) }}</p>
        <q-color :dark="dark" :disable="disable" :readonly="readonly" :clearable="clearable" class="q-ma-sm" @change="onChange" @input="onInput" @clear="onClear" v-model="color" float-label="Color (RGBA)" type="rgba" />
        <q-color :dark="dark" :color="dark === false ? 'white' : 'primary'" :disable="disable" :readonly="readonly" inverted :clearable="clearable" class="q-ma-sm" @change="val => { color = val; onChange(val) }" @input="onInput" @clear="onClear" :value="color" float-label="Color (onChange)" />
        <q-color :dark="dark" :disable="disable" :readonly="readonly" :clearable="clearable" class="q-ma-sm" @change="onChange" @input="onInput" @clear="onClear" v-model="color" :default-value="defaultColor" :float-label="`Color (default ${defaultColor})`" />
        <q-color :dark="dark" :color="dark === false ? 'white' : 'primary'" :disable="disable" :readonly="readonly" inverted :clearable="clearable" class="q-ma-sm" @change="val => { color = val; onChange(val) }" @input="onInput" @clear="onClear" :value="color" :default-value="defaultColor" :float-label="`Color (default ${defaultColor}, onChange)`" />

        <p class="q-subtitle">Color selected: {{ JSON.stringify(colorP) }}</p>
        <div class="row gutter-sm">
          <div>
            <div>Color</div>
            <q-color-picker :dark="dark" :disable="disable" :readonly="readonly" @change="onChange" @input="onInput" @clear="onClear" v-model="colorP" />
          </div>
          <div>
            <div>Color (HEXA, onChange)</div>
            <q-color-picker :dark="dark" :disable="disable" :readonly="readonly" @change="val => { colorP = val; onChange(val) }" @input="onInput" @clear="onClear" :value="colorP" type="hexa" />
          </div>
          <div>
            <div>Color (default {{defaultColor}})</div>
            <q-color-picker :dark="dark" :disable="disable" :readonly="readonly" @change="onChange" @input="onInput" @clear="onClear" v-model="colorP" :default-value="defaultColor" />
          </div>
          <div>
            <div>Color (default {{defaultColor}}, onChange)</div>
            <q-color-picker :dark="dark" :disable="disable" :readonly="readonly" @change="val => { colorP = val; onChange(val) }" @input="onInput" @clear="onClear" :value="colorP" :default-value="defaultColor" />
          </div>
        </div>

        <p class="q-subtitle">Date selected: {{ JSON.stringify(date) }}</p>
        <q-datetime :dark="dark" :disable="disable" :readonly="readonly" type="date" formatModel="date" :clearable="clearable" class="q-ma-sm" @change="onChange" @input="onInput" @clear="onClear" v-model="date" float-label="Date" />
        <q-datetime :dark="dark" :color="dark === false ? 'white' : 'primary'" :disable="disable" :readonly="readonly" type="date" formatModel="date" inverted :clearable="clearable" class="q-ma-sm" @change="val => { date = val; onChange(val) }" @input="onInput" @clear="onClear" :value="date" float-label="Date (onChange)" />
        <q-datetime :dark="dark" :disable="disable" :readonly="readonly" type="date" formatModel="date" :clearable="clearable" class="q-ma-sm" @change="onChange" @input="onInput" @clear="onClear" v-model="date" :default-value="defaultDate" :float-label="`Date (default ${defaultDate})`" />
        <q-datetime :dark="dark" :color="dark === false ? 'white' : 'orange'" :disable="disable" :readonly="readonly" type="datetime" formatModel="date" inverted :clearable="clearable" class="q-ma-sm" @change="val => { date = val; onChange(val) }" @input="onInput" @clear="onClear" :value="date" :default-value="defaultDate" :float-label="`Datetime (default ${defaultDate}, onChange)`" />

        <p class="q-subtitle">Date selected: {{ JSON.stringify(date) }}</p>
        <div class="row gutter-sm">
          <div>
            <div>Date</div>
            <q-datetime-picker :dark="dark" color="primary" :disable="disable" :readonly="readonly" type="date" formatModel="date" @change="onChange" @input="onInput" @clear="onClear" v-model="date" />
          </div>
          <div>
            <div>Date (onChange)</div>
            <q-datetime-picker :dark="dark" color="red" :disable="disable" :readonly="readonly" type="date" formatModel="date" @change="val => { date = val; onChange(val) }" @input="onInput" @clear="onClear" :value="date" />
          </div>
          <div>
            <div>Date (default {{defaultDate}})</div>
            <q-datetime-picker :dark="dark" color="secondary" :disable="disable" :readonly="readonly" type="date" formatModel="date" @change="onChange" @input="onInput" @clear="onClear" v-model="date" :default-value="defaultDate" />
          </div>
          <div>
            <div>Date (default {{defaultDate}}, onChange)</div>
            <q-datetime-picker :dark="dark" color="dark" :disable="disable" :readonly="readonly" type="date" formatModel="date" @change="val => { date = val; onChange(val) }" @input="onInput" @clear="onClear" :value="date" :default-value="defaultDate" />
          </div>
          <div>
            <div>Datetime</div>
            <q-datetime-picker :dark="dark" color="primary" :disable="disable" :readonly="readonly" type="datetime" formatModel="date" @change="onChange" @input="onInput" @clear="onClear" v-model="date" />
          </div>
          <div>
            <div>Datetime (onChange)</div>
            <q-datetime-picker :dark="dark" color="orange" :disable="disable" :readonly="readonly" type="datetime" formatModel="date" @change="val => { date = val; onChange(val) }" @input="onInput" @clear="onClear" :value="date" />
          </div>
        </div>

        <p class="q-subtitle">Text: {{ JSON.stringify(terms) }}</p>
        <q-input :dark="dark" :disable="disable" :readonly="readonly" :clearable="clearable" class="q-ma-sm" @change="onChange" @input="onInput" @clear="onClear" v-model="terms" float-label="Text" />
        <q-input :dark="dark" :color="dark === false ? 'white' : 'primary'" :disable="disable" :readonly="readonly" inverted :clearable="clearable" class="q-ma-sm" @change="val => { terms = val; onChange(val) }" @input="onInput" @clear="onClear" :value="terms" float-label="Text (onChange)" />

        <p class="q-subtitle">Textarea: {{ JSON.stringify(terms) }}</p>
        <q-input :dark="dark" :disable="disable" :readonly="readonly" type="textarea" :clearable="clearable" class="q-ma-sm" @change="onChange" @input="onInput" @clear="onClear" v-model="terms" float-label="Textarea" />
        <q-input :dark="dark" :color="dark === false ? 'white' : 'primary'" :disable="disable" :readonly="readonly" type="textarea" inverted :clearable="clearable" class="q-ma-sm" @change="val => { terms = val; onChange(val) }" @input="onInput" @clear="onClear" :value="terms" float-label="Textarea (onChange)" />

        <p class="q-subtitle">Password: {{ JSON.stringify(terms) }}</p>
        <q-input :dark="dark" :disable="disable" :readonly="readonly" type="password" :clearable="clearable" class="q-ma-sm" @change="onChange" @input="onInput" @clear="onClear" v-model="terms" float-label="Password" />
        <q-input :dark="dark" :color="dark === false ? 'white' : 'primary'" :disable="disable" :readonly="readonly" type="password" inverted :clearable="clearable" class="q-ma-sm" @change="val => { terms = val; onChange(val) }" @input="onInput" @clear="onClear" :value="terms" float-label="Password (onChange)" />

        <p class="q-subtitle">Number: {{ JSON.stringify(termsN) }}</p>
        <q-input :dark="dark" :disable="disable" :readonly="readonly" type="number" :clearable="clearable" class="q-ma-sm" @change="onChange" @input="onInput" @clear="onClear" v-model="termsN" float-label="Number" />
        <q-input :dark="dark" :color="dark === false ? 'white' : 'primary'" :disable="disable" :readonly="readonly" type="number" inverted :clearable="clearable" class="q-ma-sm" @change="val => { termsN = val; onChange(val) }" @input="onInput" @clear="onClear" :value="termsN" float-label="Number (onChange)" />

        <p class="q-subtitle">Number (step {{step}}): {{ JSON.stringify(termsNS) }}</p>
        <q-input :dark="dark" :disable="disable" :readonly="readonly" type="number" :clearable="clearable" class="q-ma-sm" :step="step" @change="onChange" @input="onInput" @clear="onClear" v-model="termsNS" float-label="Number" />
        <q-input :dark="dark" :color="dark === false ? 'white' : 'primary'" :disable="disable" :readonly="readonly" type="number" inverted :clearable="clearable" :step="step" class="q-ma-sm" @change="val => { termsNS = val; onChange(val) }" @input="onInput" @clear="onClear" :value="termsNS" float-label="Number (onChange)" />

        <p class="q-subtitle">Number (decimals {{decimals}}): {{ JSON.stringify(termsNS) }}</p>
        <q-input :dark="dark" :disable="disable" :readonly="readonly" type="number" :clearable="clearable" class="q-ma-sm" :decimals="decimals" @change="onChange" @input="onInput" @clear="onClear" v-model="termsNS" float-label="Number" />
        <q-input :dark="dark" :color="dark === false ? 'white' : 'primary'" :disable="disable" :readonly="readonly" type="number" inverted :clearable="clearable" :decimals="decimals" class="q-ma-sm" @change="val => { termsNS = val; onChange(val) }" @input="onInput" @clear="onClear" :value="termsNS" float-label="Number (onChange)" />

        <p class="q-subtitle">Knob: {{ JSON.stringify(termsK) }}</p>
        <div class="row gutter-sm">
          <div class="col-6">
            <div>Between {{minVal}} and {{maxVal}}, step {{step}}</div>
            <q-knob :dark="dark" :disable="disable" :readonly="readonly" :step="step" @change="onChange" @input="onInput" v-model="termsK" :min="minVal" :max="maxVal" />
          </div>
          <div class="col-6">
            <div>Between {{minVal}} and {{maxVal}}, step {{step}} (onChange)</div>
            <q-knob :dark="dark" :disable="disable" :readonly="readonly" :step="step" @change="val => { termsK = val; onChange(val) }" @input="onInput" :value="termsK" :min="minVal" :max="maxVal" />
          </div>
          <div class="col-6">
            <div>Between {{minVal}} and {{maxVal}}, step {{step}}, decimals {{decimals}}</div>
            <q-knob :dark="dark" :disable="disable" :readonly="readonly" :step="step" :decimals="decimals" @change="onChange" @input="onInput" v-model="termsK" :min="minVal" :max="maxVal" />
          </div>
          <div class="col-6">
            <div>Between {{minVal}} and {{maxVal}}, step {{step}}, decimals {{decimals}} (onChange)</div>
            <q-knob :dark="dark" :disable="disable" :readonly="readonly" :step="step" :decimals="decimals" @change="val => { termsK = val; onChange(val) }" @input="onInput" :value="termsK" :min="minVal" :max="maxVal" />
          </div>
        </div>

        <p class="q-subtitle">Slider: {{ JSON.stringify(termsK) }}</p>
        <div class="row gutter-sm">
          <div class="col-6">
            <div>Between {{minVal}} and {{maxVal}}, step {{step}}</div>
            <q-slider :dark="dark" :disable="disable" :readonly="readonly" :step="step" @change="onChange" @input="onInput" v-model="termsK" :min="minVal" :max="maxVal" />
          </div>
          <div class="col-6">
            <div>Between {{minVal}} and {{maxVal}}, step {{step}} (onChange)</div>
            <q-slider :dark="dark" :disable="disable" :readonly="readonly" :step="step" @change="val => { termsK = val; onChange(val) }" @input="onInput" :value="termsK" :min="minVal" :max="maxVal" />
          </div>
          <div class="col-6">
            <div>Between {{minVal}} and {{maxVal}}, step {{step}}, decimals {{decimals}}</div>
            <q-slider :dark="dark" :disable="disable" :readonly="readonly" :step="step" :decimals="decimals" @change="onChange" @input="onInput" v-model="termsK" :min="minVal" :max="maxVal" />
          </div>
          <div class="col-6">
            <div>Between {{minVal}} and {{maxVal}}, step {{step}}, decimals {{decimals}} (onChange)</div>
            <q-slider :dark="dark" :disable="disable" :readonly="readonly" :step="step" :decimals="decimals" @change="val => { termsK = val; onChange(val) }" @input="onInput" :value="termsK" :min="minVal" :max="maxVal" />
          </div>
        </div>

        <p class="q-subtitle">Range: {{ JSON.stringify(termsR) }}</p>
        <div class="row gutter-sm">
          <div class="col-6">
            <div>Between {{minVal}} and {{maxVal}}, step {{step}}</div>
            <q-range :dark="dark" :disable="disable" :readonly="readonly" drag-range :step="step" @change="onChange" @input="onInput" v-model="termsR" :min="minVal" :max="maxVal" />
          </div>
          <div class="col-6">
            <div>Between {{minVal}} and {{maxVal}}, step {{step}} (onChange)</div>
            <q-range :dark="dark" :disable="disable" :readonly="readonly" drag-range :step="step" @change="val => { termsR = val; onChange(val) }" @input="onInput" :value="termsR" :min="minVal" :max="maxVal" />
          </div>
          <div class="col-6">
            <div>Between {{minVal}} and {{maxVal}}, step {{step}}, decimals {{decimals}}</div>
            <q-range :dark="dark" :disable="disable" :readonly="readonly" drag-range :step="step" :decimals="decimals" @change="onChange" @input="onInput" v-model="termsR" :min="minVal" :max="maxVal" />
          </div>
          <div class="col-6">
            <div>Between {{minVal}} and {{maxVal}}, step {{step}}, decimals {{decimals}} (onChange)</div>
            <q-range :dark="dark" :disable="disable" :readonly="readonly" drag-range :step="step" :decimals="decimals" @change="val => { termsR = val; onChange(val) }" @input="onInput" :value="termsR" :min="minVal" :max="maxVal" />
          </div>
        </div>

        <p class="q-subtitle">Selected option: {{ JSON.stringify(option) }}</p>
        <q-select :dark="dark" :disable="disable" :readonly="readonly" :clearable="clearable" class="q-ma-sm" @change="onChange" @input="onInput" @clear="onClear" v-model="option" :options="countries" float-label="Select" />
        <q-select :dark="dark" :color="dark === false ? 'white' : 'primary'" :disable="disable" :readonly="readonly" inverted :clearable="clearable" class="q-ma-sm" @change="val => { option = val; onChange(val) }" @input="onInput" @clear="onClear" :value="option" :options="countries" float-label="Select (onChange)" />

        <p class="q-subtitle">Selected options: {{ JSON.stringify(options) }}</p>
        <q-select :dark="dark" :disable="disable" :readonly="readonly" multiple :clearable="clearable" class="q-ma-sm" @change="onChange" @input="onInput" @clear="onClear" v-model="options" :options="countries" float-label="Select multiple (with filter)" filter />
        <q-select :dark="dark" :color="dark === false ? 'white' : 'primary'" :disable="disable" :readonly="readonly" multiple inverted :clearable="clearable" class="q-ma-sm" @change="val => { options = val; onChange(val) }" @input="onInput" @clear="onClear" :value="options" :options="countries" float-label="Select multiple (onChange)" />
        <q-select :dark="dark" :disable="disable" :readonly="readonly" multiple chips :clearable="clearable" class="q-ma-sm" @change="onChange" @input="onInput" @clear="onClear" v-model="options" :options="countries" float-label="Select multiple - chips" />
        <q-select :dark="dark" :color="dark === false ? 'white' : 'primary'" :disable="disable" :readonly="readonly" multiple chips inverted :clearable="clearable" class="q-ma-sm" @change="val => { options = val; onChange(val) }" @input="onInput" @clear="onClear" :value="options" :options="countries" float-label="Select multiple - chips (onChange)" />

        <p class="q-subtitle">Rating: {{ JSON.stringify(termT) }}</p>
        <div class="row gutter-sm">
          <div>
            <div>Rating</div>
            <q-rating class="q-ma-md" :dark="dark" :disable="disable" :readonly="readonly" size="3rem" @change="onChange" @input="onInput" v-model="termT" :max="maxVal" icon="create" />
          </div>
          <div>
            <div>Rating (onChange)</div>
            <q-rating class="q-ma-md" :dark="dark" :disable="disable" :readonly="readonly" size="3rem" @change="val => { termT = val; onChange(val) }" @input="onInput" :value="termT" :max="maxVal" icon="create" />
          </div>
        </div>
      </q-scroll-area>
    </div>
  </div>
</template>

<style lang="stylus">
  .q-subtitle
    border-left 5px solid #00f
    margin-top 1rem
    padding .5rem
</style>


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
      dark: null,
      disable: false,
      readonly: false,
      clearable: true,

      terms: '',
      termsN: null,
      termsNS: null,
      termsK: 0.5,
      termsR: { min: 0.5, max: 0.8 },
      termT: 1,
      option: null,
      options: [],
      color: '#0ff',
      colorP: '#ff0',
      date: new Date(),

      defaultColor: '#0f0',
      defaultDate: '2020-06-15T18:30:30',
      minVal: 0,
      maxVal: 6,
      step: 0.01,
      decimals: 1,
      countries: countries.slice(0, 40).map(country => ({ label: country, value: country, color: randomColor(), rightIcon: randomIcon() })),
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
    },
    clear (value) {
      this.terms = value
      this.termsN = value
      this.termsNS = value
      this.termsK = value
      this.termsR = value === void 0 ? void 0 : { min: value, max: value }
      this.termT = value
      this.option = value
      this.options = []
      this.color = value
      this.colorP = value
      this.date = value
    },
    fill () {
      this.terms = 'Algeria'
      this.termsN = 1
      this.termsNS = 1
      this.termsK = 0.5
      this.termsR = { min: 0.5, max: 0.8 }
      this.termT = 1
      this.option = this.countries[6].value
      this.options = [this.countries[6].value, this.countries[12].value, this.countries[16].value]
      this.color = '#0ff'
      this.colorP = '#ff0'
      this.date = new Date()
    }
  }
}
</script>
