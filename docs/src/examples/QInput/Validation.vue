<template>
  <div class="row q-gutter-md q-pa-md justify-around">
    <q-card class="col-xs-12 col-sm-5 col-lg-3 col-xl-2 q-pa-md">
      <q-input label="maxlength=5, counter" counter maxlength="5" v-model="value" />
    </q-card>
    <q-card class="col-xs-12 col-sm-5 col-lg-3 col-xl-2 q-pa-md">
      <q-input label="Min length of 3" :rules="[val => val.length >= 3 || 'Please use at least 3 characters' ]" v-model="value" color="secondary" />
    </q-card>
    <q-card class="col-xs-12 col-sm-5 col-lg-3 col-xl-2 q-pa-md">
      <q-input label="Can't end with space" :rules="[val => val[val.length - 1] !== ' ' || 'Please don\'t leave any trailing spaces' ]" v-model="value" color="indigo" />
    </q-card>
    <q-card class="col-xs-12 col-sm-5 col-lg-3 col-xl-2 q-pa-md">
      <q-checkbox v-model="error">Error</q-checkbox>
      <q-input label="Manual error state" :error="error" bottom-slots error-message="You have set this input to error" v-model="value" />
    </q-card>
    <q-card class="col-xs-12 col-sm-5 col-lg-3 col-xl-2 q-pa-md">
      <q-input label="Lazy rules" :rules="[val => val.length > 0 || 'Please provide some input' ]" lazy-rules v-model="value" color="indigo" />
    </q-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      value: '',
      error: false
    }
  }
}
</script>
