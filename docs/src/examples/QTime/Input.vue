<template>
  <div class="q-pa-md q-gutter-md">
    <div class="row justify-center">
      <q-input filled v-model="fullTime" mask="time" :rules="['time']">
        <q-icon slot="append" name="access_time" class="cursor-pointer">
          <q-popup-proxy>
            <q-time
              v-model="fullTime"
            />
          </q-popup-proxy>
        </q-icon>
      </q-input>
    </div>
    <div class="row justify-center">
      <q-input filled v-model="time" mask="fulltime" :rules="['fulltime']">
        <q-icon slot="append" name="access_time" class="cursor-pointer">
          <q-popup-proxy>
            <q-time
              v-model="time"
              with-seconds
              format24h
            />
          </q-popup-proxy>
        </q-icon>
      </q-input>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      time: '10:56',
      fullTime: '10:56:00'
    }
  }
}
</script>
