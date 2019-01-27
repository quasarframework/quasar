<template>
  <div class="row q-gutter-md q-pa-md justify-around">
    <q-card class="col-xs-12 col-sm-5 col-lg-3 col-xl-2 q-pa-md">
      <q-input prefix="$" v-model="value" label="prefix" />
    </q-card>
    <q-card class="col-xs-12 col-sm-5 col-lg-3 col-xl-2 q-pa-md">
      <q-input suffix="%" v-model="value" label="suffix" color="secondary" />
    </q-card>
    <q-card class="col-xs-12 col-sm-5 col-lg-3 col-xl-2 q-pa-md">
      <q-input v-model="value" label="prepend" color="deep-orange">
        <q-icon slot="prepend" name="email" />
      </q-input>
    </q-card>
    <q-card class="col-xs-12 col-sm-5 col-lg-3 col-xl-2 q-pa-md text-white bg-grey-10">
      <q-input v-model="value" label="before" dark >
        <q-icon slot="before" name="attach_money" />
      </q-input>
    </q-card>
    <q-card class="col-xs-12 col-sm-5 col-lg-3 col-xl-2 q-pa-md">
      <q-input v-model="value" label="append" color="deep-purple" >
        <q-btn slot="append" round flat icon="clear" />
      </q-input>
    </q-card>
    <q-card class="col-xs-12 col-sm-5 col-lg-3 col-xl-2 q-pa-md">
      <q-input v-model="value" label="after" color="deep-purple" >
        <q-btn slot="after" flat round icon="send" />
      </q-input>
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
