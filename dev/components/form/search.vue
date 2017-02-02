<template>
  <div>
    <div class="layout-padding">
      <div class="label bg-secondary text-white">
        Model <span class="right-detail"><em>{{stringModel}}</em></span>
      </div>

      <div class="column small-gutter" style="margin-top: 15px">
        <q-search v-model="search"></q-search>
        <q-search v-model="search" class="orange"></q-search>
        <q-search v-model="search" class="secondary" icon="explore" placeholder="PlacesPlacesPlacesPlacesPlacesPlacesPlaces"></q-search>
        <q-search v-model="search" class="primary" icon="local_airport" placeholder="Airports"></q-search>
        <q-search v-model="search" class="dark" icon="local_hotel" placeholder="Hotels"></q-search>
      </div>

      <p class="caption">Numeric Format</p>
      <div class="label bg-secondary text-white">
        Model <span class="right-detail"><em>{{numberModel}}</em></span>
      </div>
      <q-search v-model="number" numeric class="positive" style="margin-top: 15px"></q-search>

      <p class="caption">Disabled State</p>
      <q-search v-model="search" class="primary" disable></q-search>

      <p class="caption">Readonly State</p>
      <q-search v-model="search" class="primary" readonly></q-search>

      <p class="caption">Error State</p>
      <q-search v-model="search" class="primary has-error"></q-search>
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
  }
}
</script>
