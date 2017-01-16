<template>
  <div>
    <div class="layout-padding">
      <div class="label bg-secondary text-white">
        Model <span class="right-detail">"<em>{{search}}</em>"</span>
      </div>

      <br><br>

      <div class="column small-gutter">
        <q-search v-model="search"></q-search>
        <q-search v-model="search" class="orange"></q-search>
        <q-search v-model="search" class="secondary" icon="explore" placeholder="PlacesPlacesPlacesPlacesPlacesPlacesPlaces"></q-search>
        <q-search v-model="search" class="primary" icon="local_airport" placeholder="Airports"></q-search>
        <q-search v-model="search" class="dark" icon="local_hotel" placeholder="Hotels"></q-search>
      </div>

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
      search: ''
    }
  }
}
</script>
