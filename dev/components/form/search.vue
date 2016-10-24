<template>
  <div>
    <div class="layout-padding">
      <div class="label bg-secondary text-white">
        Model <span class="right-detail">"<em>{{search}}</em>"</span>
      </div>

      <br><br>

      <quasar-search v-model="search"></quasar-search>
      <quasar-search v-model="search" class="orange"></quasar-search>
      <quasar-search v-model="search" class="secondary" icon="explore" placeholder="Places"></quasar-search>
      <quasar-search v-model="search" class="primary" icon="local_airport" placeholder="Airports"></quasar-search>
      <quasar-search v-model="search" class="dark" icon="local_hotel" placeholder="Hotels"></quasar-search>

      <p class="caption">Disabled State</p>
      <quasar-search v-model="search" class="primary" disable></quasar-search>
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
