<template>
  <div class="row q-gutter-md q-pa-md justify-around">
    <q-card class="col-xs-12 col-sm-5 col-lg-3 col-xl-2 q-pa-md">
      <q-input v-model="value" readonly label="readonly" />
    </q-card>
    <q-card class="col-xs-12 col-sm-5 col-lg-3 col-xl-2 q-pa-md">
      <q-input v-model="value" outlined readonly label="readonly" />
    </q-card>
    <q-card class="col-xs-12 col-sm-5 col-lg-3 col-xl-2 q-pa-md">
      <q-input v-model="value" filled disable label="disable" />
    </q-card>
    <q-card class="col-xs-12 col-sm-5 col-lg-3 col-xl-2 q-pa-md text-white bg-grey-10">
      <q-input v-model="value" dark disable outlined label="disable" />
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
