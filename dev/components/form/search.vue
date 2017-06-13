<template>
  <div>
    <div class="layout-padding">
      <div class="label bg-secondary text-white">
        Model <span class="right-detail"><em>{{stringModel}}</em></span>
      </div>

      <div style="margin-top: 15px">
        <q-search @change="onChange" v-model="search" align="right" suffix="Quasar" style="width: 300px"></q-search>
        <q-search v-model="search" color="orange"></q-search>
        <q-search v-model="search" color="secondary" icon="explore" placeholder="PlacesPlacesPlacesPlacesPlacesPlacesPlaces"></q-search>
        <q-search v-model="search" color="primary" icon="local_airport" placeholder="Airports"></q-search>
        <q-search v-model="search" color="dark" icon="local_hotel" placeholder="Hotels"></q-search>
        <q-search stack-label="Stack Label" v-model="search" color="amber" icon="local_hotel" placeholder="Hotels"></q-search>
      </div>

      <div style="margin-top: 15px">
        <q-search inverted v-model="search" align="right" suffix="Quasar" style="width: 300px"></q-search>
        <q-search inverted v-model="search" color="orange"></q-search>
        <q-search inverted v-model="search" color="secondary" icon="explore" placeholder="PlacesPlacesPlacesPlacesPlacesPlacesPlaces"></q-search>
        <q-search inverted v-model="search" color="primary" icon="local_airport" placeholder="Airports"></q-search>
        <q-search inverted v-model="search" color="dark" icon="local_hotel" placeholder="Hotels"></q-search>
        <q-search inverted stack-label="Stack Label" v-model="search" color="amber" icon="local_hotel" placeholder="Hotels"></q-search>
      </div>

      <p class="caption">Numeric Format</p>
      <div class="label bg-secondary text-white">
        Model <span class="right-detail"><em>{{numberModel}}</em></span>
      </div>
      <q-search v-model="number" type="number" color="positive" style="margin-top: 15px"></q-search>

      <p class="caption">Disabled State</p>
      <q-search v-model="search" color="primary" disable></q-search>

      <p class="caption">Error State</p>
      <q-search v-model="search" error></q-search>
      <q-search inverted v-model="search" error></q-search>
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
  methods: {
    onChange (val) {
      console.log('@change', val)
    }
  }
}
</script>
