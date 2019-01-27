<template>
  <div class="row q-gutter-md q-pa-md justify-around">
    <q-card class="col-xs-12 col-sm-5 col-lg-3 col-xl-2 q-pa-md">
      <q-input label="I am outlined" outlined rounded v-model="value" />
    </q-card>
    <q-card class="col-xs-12 col-sm-5 col-lg-3 col-xl-2 q-pa-md">
      <q-input label="I am filled" filled rounded v-model="value" bg-color="secondary" />
    </q-card>
    <q-card class="col-xs-12 col-sm-5 col-lg-3 col-xl-2 q-pa-md">
      <q-input label="I am standout" standout rounded v-model="value" color="deep-orange" bg-color="orange"  />
    </q-card>
    <q-card class="col-xs-12 col-sm-5 col-lg-3 col-xl-2 q-pa-md text-white bg-grey-10">
      <q-input label="I am standard (no effect)" rounded v-model="value" dark />
    </q-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      value: ''
    }
  }
}
</script>
