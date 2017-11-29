<template>
  <div>
    <div class="layout-padding input-example" style="max-width: 600px;">
      <q-input ref="xi" :attributes="{gigi: 'yes'}" @change="onChange" v-model="text" />
      <q-btn @click="$refs.xi.select()">Select</q-btn>
      <q-input v-model="text" stack-label="Stack Label" />
      <q-card>
        <q-card-title class="bg-dark text-white q-px-small q-py-smaller">Text value: {{JSON.stringify(text)}}</q-card-title>
        <q-card-main>
          <q-input v-model="text" float-label="Text" placeholder="Placeholder" @input="onInput" @change="onChange" clearable />
          <q-input :value="text" float-label="Text (onChange)" placeholder="Placeholder" @input="onInput" @change="val => { text = val, onChange(val) }" clearable />
        </q-card-main>
      </q-card>

      <q-card>
        <q-card-title class="bg-dark text-white q-px-small q-py-smaller">Numeric value: {{JSON.stringify(numberNull)}}</q-card-title>
        <q-card-main>
          <q-input v-model="numberNull" type="number" prefix="$" float-label="Number (initial null)" @input="onInput" @change="onChange" clearable />
          <q-input :value="numberNull" type="number" prefix="$" float-label="Number (initial null, onChange)" @input="onInput" @change="val => { numberNull = val, onChange(val) }" clearable />
          <q-input v-model="numberNull" type="number" :max-decimals="2" prefix="$" float-label="Number (initial null, 2 decimals)" @input="onInput" @change="onChange" clearable />
          <q-input :value="numberNull" type="number" :max-decimals="2" prefix="$" float-label="Number (initial null, 2 decimals, onChange)" @input="onInput" @change="val => { numberNull = val, onChange(val) }" clearable />
        </q-card-main>
      </q-card>

      <q-card>
        <q-card-title class="bg-dark text-white q-px-small q-py-smaller">Numeric value: {{JSON.stringify(numberInt)}}</q-card-title>
        <q-card-main>
          <q-input v-model="numberInt" type="number" prefix="$" float-label="Number (initial int)" @input="onInput" @change="onChange" clearable />
          <q-input :value="numberInt" type="number" prefix="$" float-label="Number (initial int, onChange)" @input="onInput" @change="val => { numberInt = val, onChange(val) }" clearable />
          <q-input v-model="numberInt" type="number" :max-decimals="2" prefix="$" float-label="Number (initial int, 2 decimals)" @input="onInput" @change="onChange" clearable />
          <q-input :value="numberInt" type="number" :max-decimals="2" prefix="$" float-label="Number (initial int, 2 decimals, onChange)" @input="onInput" @change="val => { numberInt = val, onChange(val) }" clearable />
        </q-card-main>
      </q-card>

      <q-card>
        <q-card-title class="bg-dark text-white q-px-small q-py-smaller">Numeric value: {{JSON.stringify(numberFloat)}}</q-card-title>
        <q-card-main>
          <q-input v-model="numberFloat" type="number" prefix="$" float-label="Number (initial float)" @input="onInput" @change="onChange" clearable />
          <q-input :value="numberFloat" type="number" prefix="$" float-label="Number (initial float, onChange)" @input="onInput" @change="val => { numberFLoat = val, onChange(val) }" clearable />
          <q-input v-model="numberFloat" type="number" :max-decimals="2" prefix="$" float-label="Number (initial float, 2 decimals)" @input="onInput" @change="onChange" clearable />
          <q-input :value="numberFloat" type="number" :max-decimals="2" prefix="$" float-label="Number (initial float, 2 decimals, onChange)" @input="onInput" @change="val => { numberFloat = val, onChange(val) }" clearable />
        </q-card-main>
      </q-card>

      <q-card>
        <q-card-title class="bg-dark text-white q-px-small q-py-smaller">Numeric value: {{JSON.stringify(numberFloatText)}}</q-card-title>
        <q-card-main>
          <q-input v-model="numberFloatText" type="number" prefix="$" float-label="Number (initial float as text)" @input="onInput" @change="onChange" clearable />
          <q-input :value="numberFloatText" type="number" prefix="$" float-label="Number (initial float as text, onChange)" @input="onInput" @change="val => { numberFloatText = val, onChange(val) }" clearable />
          <q-input v-model="numberFloatText" type="number" :max-decimals="2" prefix="$" float-label="Number (initial float as text, 2 decimals)" @input="onInput" @change="onChange" clearable />
          <q-input :value="numberFloatText" type="number" :max-decimals="2" prefix="$" float-label="Number (initial float as text, 2 decimals, onChange)" @input="onInput" @change="val => { numberFloatText = val, onChange(val) }" clearable />
        </q-card-main>
      </q-card>

      <q-card>
        <q-card-title class="bg-dark text-white q-px-small q-py-smaller">Password: {{JSON.stringify(text)}}</q-card-title>
        <q-card-main>
          <q-input v-model="text" type="password" float-label="Password" @input="onInput" @change="onChange" />
          <q-input :value="text" type="password" float-label="Password (onChange)" @input="onInput" @change="val => { text = val, onChange(val) }" />
          <q-input v-model="text" type="password" float-label="Password" @input="onInput" @change="onChange" clearable />
          <q-input :value="text" type="password" float-label="Password (onChange)" @input="onInput" @change="val => { text = val, onChange(val) }" clearable />
        </q-card-main>
      </q-card>

      <q-input v-model="text" suffix="@gmail.com" float-label="Clearable" clearable />
      <q-input v-model="text" type="password" float-label="Password & no-pass-toggle" no-pass-toggle />

      <q-input disable v-model="text" float-label="Float Label" placeholder="Gigi" />
      <q-input inverted disable v-model="text" float-label="Float Label" placeholder="Gigi" clearable />

      <q-input readonly v-model="text" float-label="Float Label" placeholder="Gigi" />
      <q-input inverted readonly v-model="text" float-label="Float Label" placeholder="Gigi" clearable />

      <q-input v-model="text" float-label="Colored" color="amber" />
      <q-input v-model="text" float-label="Colored" color="amber" error />

      <q-input v-model="text" float-label="Has warning" warning />
      <q-input v-model="text" float-label="Has both error and warning" error warning />

      <p class="caption">False initial value</p>
      <q-input v-model="textFalse" float-label="Some placeholder" />
      <q-input v-model="textFalse" stack-label="Some placeholder" />

      <p class="caption">Zero initial value</p>
      <q-input v-model="textZero" float-label="Some placeholder" />
      <q-input v-model="textZero" stack-label="Some placeholder" />

      <p class="caption">v-model.lazy: "{{text}}"</p>
      <q-input :value="text" @change="val => { text = val }" clearable placeholder="Some placeholder" />

      <p class="caption">v-model.trim: "{{text}}"</p>
      <q-input v-model.trim="text" clearable placeholder="Some placeholder" />

      <p class="caption">Inverted Inputs</p>
      <q-input v-model="text" :error="error" inverted color="secondary" type="password" clearable placeholder="Some placeholder" :after="[{icon: 'warning', error: true, handler () {}}]" />
      <q-input v-model="text" inverted stack-label="Colored" color="amber" />
      <q-input v-model="text" inverted stack-label="Colored" :after="[{icon: 'arrow_forward', content: true, handler () {}}]"/>
      <q-input v-model="text" inverted type="textarea" stack-label="Colored" color="tertiary" :min-rows="5" />

      <p class="caption">On dark background</p>
      <div class="bg-grey-9" style="width: 500px; padding: 25px">
        <q-input v-model="text" float-label="Colored" dark prefix="$" suffix="TSP" />
        <q-input v-model="text" float-label="Colored" dark color="amber" prefix="$" suffix="TSP" />

        <q-field
          icon="wifi"
          label="Some Label"
          :count="10"
          helper="Some helper"
          :error="error"
          error-label="Some error"
        >
          <q-input
            v-model="text"
            dark
            color="yellow"
            float-label="Textfield"
          />
        </q-field>
      </div>

      <p class="caption">With loading state</p>
      <q-checkbox v-model="loading" label="Loading (click me)" />
      <q-input :loading="loading" v-model="text" placeholder="Gigi" />
      <q-input :loading="loading" v-model="text" stack-label="Float Label" placeholder="Gigi" />
      <q-input :loading="loading" inverted v-model="text" stack-label="Float Label" placeholder="Gigi" />

      <p class="caption">Along Fields</p>

      <q-field
        icon="wifi"
        label="Some Label"
        :count="10"
        helper="Some helper"
        error-label="Some error"
      >
        <q-input
          v-model="text"
          :error="error"
        />
      </q-field>

      <q-field
        icon="wifi"
        label="Some Label"
        :count="10"
        helper="Some helper"
        error-label="Some error"
      >
        <q-input
          v-model="text"
          :error="error"
          float-label="Textfield"
        />
      </q-field>

      <q-field
        icon="wifi"
        label="Some Label"
        :count="10"
        helper="Some helper"
        :error="error"
        error-label="Some error"
      >
        <q-input v-model="text" inverted placeholder="On Field" :after="[{icon: 'arrow_forward', content: true, handler () {}}]"/>
      </q-field>

      <q-field
        icon="wifi"
        label="Some Label"
        :count="10"
        helper="Some helper"
        :error="error"
        error-label="Some error"
      >
        <q-input v-model="text" color="amber" inverted stack-label="Stack Label" :after="[{icon: 'arrow_forward', content: true, handler () {}}]"/>
      </q-field>

      <q-field
        icon="wifi"
        label="Some Label"
        :count="10"
        helper="Some helper"
        :error="error"
        error-label="Some error"
      >
        <q-input v-model="text" color="amber" :inverted="error" float-label="Float Label" :after="[{icon: 'arrow_forward', content: true, handler () {}}]"/>
      </q-field>

      <q-field
        icon="wifi"
        helper="Some helper"
        :error="error"
        error-label="Some error"
      >
        <q-input
          v-model="text"
          float-label="Textfield"
          :error="error"
        />
      </q-field>

      <br><br>

      <q-input v-model="area" type="textarea" float-label="Textarea" :max-height="100" :min-rows="3" />

      <div class="fixed" style="bottom: 16px; right: 16px;">
        <q-checkbox v-model="error" label="Error" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      text: '',
      textFalse: false,
      textZero: '0',
      numberNull: null,
      numberInt: 0,
      numberFloat: 0.00001,
      numberFloatText: '0.00001',
      area: '',
      focus: false,
      error: false,
      loading: false
    }
  },
  computed: {
    length () {
      return this.text.length
    }
  },
  methods: {
    onChange (val) {
      console.log('@change', JSON.stringify(val))
    },
    onInput (val) {
      console.log('@input', JSON.stringify(val))
    }
  }
}
</script>

<style lang="stylus">
.q-field
  // border 1px solid black
.q-input
  // border 1px solid black
</style>
