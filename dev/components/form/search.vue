<template>
  <div>
    <div class="q-layout-padding">
      <div class="label bg-secondary text-white">
        Model <span class="right-detail"><em>{{ stringModel }}</em></span>
      </div>

      <div style="margin-top: 15px">
        <q-search prefix="PRE" suffix="SUF" @change="onChange" @input="onInput" @clear="onClear" v-model="search" align="right" style="width: 300px" />
        <q-search prefix="PRE" suffix="SUF" @change="onChange" @input="onInput" @clear="onClear" clear-value="" v-model="search" color="orange" placeholder="Search" />
        <q-search prefix="PRE" suffix="SUF" @change="onChange" @input="onInput" @clear="onClear" clear-value="" v-model="search" color="orange" upper-case placeholder="Search - UpperCase" />
        <q-search prefix="PRE" suffix="SUF" @change="onChange" @input="onInput" @clear="onClear" clear-value="" v-model="search" color="orange" lower-case placeholder="Search - LowerCase" />
        <q-search prefix="PRE" suffix="SUF" @change="val => { search = val; onChange(val); }" @input="onInput" @clear="onClear" :value="search" color="orange" placeholder="Search (onChange)" />
        <q-search prefix="PRE" suffix="SUF" v-model="search" color="secondary" icon="explore" placeholder="PlacesPlacesPlacesPlacesPlacesPlacesPlaces" />
        <q-search prefix="PRE" suffix="SUF" v-model="search" color="primary" icon="local_airport" placeholder="Airports" />
        <q-search prefix="PRE" suffix="SUF" v-model="search" color="dark" icon="local_hotel" placeholder="Hotels" />
        <q-search prefix="PRE" suffix="SUF" stack-label="Stack Label" v-model="search" color="amber" icon="local_hotel" placeholder="Hotels" />
        <q-search prefix="PRE" suffix="SUF" float-label="Float Label" v-model="search" color="amber" icon="local_hotel" placeholder="Hotels" />
        <q-search prefix="PRE" suffix="SUF" hide-underline stack-label="Stack Label (hide underline)" v-model="search" color="amber" icon="local_hotel" placeholder="Hotels" />
        <q-search prefix="PRE" suffix="SUF" hide-underline float-label="Float Label (hide underline)" v-model="search" color="amber" icon="local_hotel" placeholder="Hotels" />
      </div>

      <div style="margin-top: 15px">
        <q-search inverted v-model="search" prefix="PRE" suffix="SUF" align="right" style="width: 300px" />
        <q-search inverted v-model="search" prefix="PRE" suffix="SUF" color="orange" />
        <q-search inverted v-model="search" prefix="PRE" suffix="SUF" color="secondary" icon="explore" placeholder="PlacesPlacesPlacesPlacesPlacesPlacesPlaces" />
        <q-search inverted v-model="search" prefix="PRE" suffix="SUF" color="primary" icon="local_airport" placeholder="Airports" />
        <q-search inverted v-model="search" prefix="PRE" suffix="SUF" color="dark" icon="local_hotel" placeholder="Hotels" />
        <q-search inverted v-model="search" prefix="PRE" suffix="SUF" color="amber" icon="local_hotel" placeholder="Hotels" stack-label="Stack Label" />
        <q-search inverted v-model="search" prefix="PRE" suffix="SUF" color="white" :dark="false" icon="local_hotel" placeholder="Hotels" />
        <q-search inverted v-model="search" prefix="PRE" suffix="SUF" color="primary" :dark="false" icon="local_hotel" placeholder="Hotels" stack-label="Stack Label" />
        <q-search inverted v-model="search" prefix="PRE" suffix="SUF" color="primary" :dark="false" icon="local_hotel" placeholder="Hotels" float-label="Float Label" />
      </div>

      <p class="caption">Numeric Format</p>
      <div class="label bg-secondary text-white">
        Model <span class="right-detail"><em>{{ numberModel }}</em></span>
      </div>
      <q-search v-model="number" type="number" color="positive" style="margin-top: 15px"/>

      <p class="caption">v-model.lazy: "{{ search }}"</p>
      <q-search :value="search" @change="val => { search = val; onChange(val) }" color="primary"/>

      <p class="caption">v-model.trim: "{{ search }}"</p>
      <q-search v-model.trim="search" color="primary"/>

      <p class="caption">Disabled State</p>
      <q-search v-model="search" color="primary" disable/>

      <p class="caption">Error State</p>
      <q-search v-model="search" error/>
      <q-search inverted v-model="search" error/>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      search: '',
      number: ''
    }
  },
  computed: {
    stringModel () {
      return this.search ? `"${this.search}"` : 'Empty'
    },
    numberModel () {
      return this.number || this.number === 0 ? this.number : 'None'
    }
  },
  watch: {
    search (val, old) {
      console.log(`Changed from ${JSON.stringify(old)} to ${JSON.stringify(val)}`)
    },
    number (val, old) {
      console.log(`Changed from ${JSON.stringify(old)} to ${JSON.stringify(val)}`)
    }
  },
  methods: {
    onChange (val) {
      console.log('@change', JSON.stringify(val))
    },
    onInput (val) {
      console.log('@input', JSON.stringify(val))
    },
    onClear (val) {
      console.log('@clear', JSON.stringify(val))
    }
  }
}
</script>
