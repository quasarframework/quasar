<template>
  <div class="ios q-pa-md text-no-wrap">

      <q-bar dense class="bg-teal text-white">
        <q-icon name="fas fa-signal" />
        <div>mobi-net</div>
        <div>4G</div>
        <q-icon name="fas fa-wifi" />
        <q-space />
        <q-icon name="near_me" />
        <div>100%</div>
        <q-icon name="fas fa-battery-full" />
      </q-bar><br />

      <q-bar dense class="bg-amber text-grey-8">
        <q-icon name="fas fa-signal" />
        <div>mobi-net</div>
        <div>4G</div>
        <q-icon name="fas fa-wifi" />
        <q-space />
        <q-icon name="near_me" />
        <div>100%</div>
        <q-icon name="fas fa-battery-full" />

      </q-bar><br />
  </div>
</template>

<script>
export default {
  data () {
    return {
    }
  }
}
</script>

<style scoped>
.ios .q-bar{
  overflow: hidden;
  max-width: 400px;
}
</style>
