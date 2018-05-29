<template>
  <div>
    <div class="layout-padding">
      <div class="label bg-secondary text-white">
        Model <span class="right-detail"><em>{{ stringModel }}</em></span>
      </div>

      <div style="margin-top: 15px">
        <q-search @change="onChange" @input="onInput" @clear="onClear" v-model="search" align="right" suffix="Quasar" style="width: 300px"/>
        <q-search @change="onChange" @input="onInput" @clear="onClear" clear-value="" v-model="search" color="orange" placeholder="Search" clearable/>
        <q-search @change="val => { search = val; onChange(val); }" @input="onInput" @clear="onClear" :value="search" color="orange" placeholder="Search (onChange)"/>
        <q-search v-model="search" color="secondary" icon="explore" placeholder="PlacesPlacesPlacesPlacesPlacesPlacesPlaces"/>
        <q-search v-model="search" color="primary" icon="local_airport" placeholder="Airports"/>
        <q-search v-model="search" color="dark" icon="local_hotel" placeholder="Hotels"/>
        <q-search stack-label="Stack Label" v-model="search" color="amber" icon="local_hotel" placeholder="Hotels"/>
        <q-search hide-underline stack-label="Stack Label (hide underline)" v-model="search" color="amber" icon="local_hotel" placeholder="Hotels"/>
      </div>

      <div style="margin-top: 15px">
        <q-search inverted v-model="search" align="right" suffix="Quasar" style="width: 300px"/>
        <q-search inverted v-model="search" color="orange" clearable/>
        <q-search inverted v-model="search" color="secondary" icon="explore" placeholder="PlacesPlacesPlacesPlacesPlacesPlacesPlaces"/>
        <q-search inverted v-model="search" color="primary" icon="local_airport" placeholder="Airports"/>
        <q-search inverted v-model="search" color="dark" icon="local_hotel" placeholder="Hotels"/>
        <q-search inverted v-model="search" color="amber" icon="local_hotel" placeholder="Hotels" stack-label="Stack Label"/>
        <q-search inverted v-model="search" color="white" :dark="false" icon="local_hotel" placeholder="Hotels"/>
        <q-search inverted v-model="search" color="white" :dark="false" icon="local_hotel" placeholder="Hotels" stack-label="Stack Label"/>
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
