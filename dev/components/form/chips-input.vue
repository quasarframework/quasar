<template>
  <div>
    <div class="layout-padding">
      <div class="label bg-secondary text-white">
        Model:
      </div>
      <span class="thin-paragraph">[{{ model.length ? model.join(', ') : '*empty*' }}]</span>

      <br>
      <p class="caption">
        <span class="desktop-only">Click</span>
        <span class="mobile-only">Tap</span>
        on Chips Textbox below to start adding Chips.
      </p>
      <q-chips-input align="right" @change="value => log('@change', value)" @input="value => log('@input', value)" color="secondary" float-label="Float Label" v-model="model" placeholder="Some placeholder" />
      <q-chips-input align="right" @change="value => log('@change', value)" @input="value => log('@input', value)" color="secondary" hide-underline float-label="Float Label (hide underline)" v-model="model" placeholder="Some placeholder" />
      <q-chips-input align="right" @change="value => { model = value; log('@change', value) }" @input="value => log('@input', value)" color="secondary" float-label="Float Label (onChange)" :value="model" placeholder="Some placeholder" />
      <q-chips-input inverted color="dark" frame-color="amber" float-label="Float Label" v-model="model" placeholder="Some placeholder" />
      <q-chips-input inverted color="dark" :dark="false" frame-color="white" float-label="Float Label" v-model="model" placeholder="Some placeholder" />
      <q-chips-input inverted float-label="Uppercase" upper-case v-model="model" placeholder="Uppercase" />
      <q-chips-input inverted float-label="Lowercase" lower-case v-model="model" placeholder="Lowercase" />

      <q-chips-input float-label="List autocomplete" v-model="options">
        <q-autocomplete :static-data="{field: 'value', list: countries}" />
      </q-chips-input>

      <pre class="shadow-2 q-pa-sm q-mb-md">{{ options }}</pre>

      <q-chips-input float-label="List autocomplete - Complex" :value="optionsComplexParsed" @remove="optionsComplexRemove">
        <q-autocomplete :static-data="{field: 'value', list: countries}" @selected="optionsComplexAdd" />
      </q-chips-input>
      <pre class="shadow-2 q-pa-sm q-mb-md">{{ optionsComplex }}</pre>

      <div class="bg-grey-9" style="padding: 15px">
        <q-chips-input dark color="amber" float-label="Float Label" v-model="model" placeholder="Some placeholder" />
      </div>

      <p class="caption">Custom icons</p>
      <q-chips-input v-model="model" add-icon="check" />
      <q-chips-input v-model="model" add-icon="add" />
      <q-chips-input v-model="model" add-icon="add_circle" />

      <p class="caption">With Clearable</p>
      <q-chips-input align="right" @change="value => log('@change', value)" @input="value => log('@input', value)" color="secondary" float-label="Float Label" v-model="model" placeholder="Some placeholder" clearable />

      <p class="caption">With Limit</p>
      <q-chips-input :limit="2" align="right" @change="value => log('@change', value)" @input="value => log('@input', value)" color="secondary" float-label="Float Label" v-model="model" placeholder="You can not select more than 2" />

      <p class="caption">v-model.lazy</p>
      <q-chips-input :value="model" @change="value => { model = value; log('@change', value) }"/>

      <p class="caption">Disabled State</p>
      <q-chips-input v-model="model" disable/>

      <p class="caption">Readonly State</p>
      <q-chips-input v-model="model" readonly/>

      <p class="caption">Error State</p>
      <q-chips-input v-model="model" error/>

      <p class="caption">Inside Field</p>
      <q-field
        icon="account_box"
        label="Birthday"
        :count="10"
        helper="Some helper here"
        :label-width="3"
      >
        <q-chips-input float-label="Float Label" v-model="model" :count="10"/>
      </q-field>

      <p class="caption">Inside of a List</p>
      <q-list>
        <q-item multiline>
          <q-item-side icon="edit" />
          <q-item-main>
            <q-chips-input v-model="model" placeholder="Type names"/>
          </q-item-main>
        </q-item>
      </q-list>
    </div>
  </div>
</template>

<script>
import countries from 'data/autocomplete.json'

const countriesList = countries.map((country, i) => ({
  label: country,
  value: country,
  stamp: country.slice(0, 3).toUpperCase(),
  disable: Math.random() > 0.9
}))

export default {
  data () {
    return {
      model: ['Joe'],
      options: [],
      optionsComplex: [],
      countries: countriesList
    }
  },
  watch: {
    model (val, old) {
      console.log(`Changed from ${JSON.stringify(old)} to ${JSON.stringify(val)}`)
    }
  },
  computed: {
    optionsComplexParsed () {
      return this.optionsComplex.map(o => `${o.label} - ${o.stamp}`)
    }
  },
  methods: {
    log (name, data) {
      console.log(name, JSON.stringify(data))
    },
    optionsComplexAdd (value, kbdNav) {
      if (kbdNav) {
        return
      }
      const index = this.optionsComplex.findIndex(o => o === value)
      if (index > -1) {
        this.optionsComplex.splice(index, 1)
      }
      this.optionsComplex.push(value)
    },
    optionsComplexRemove ({ index }) {
      if (index > -1) {
        this.optionsComplex.splice(index, 1)
      }
    }
  }
}
</script>
