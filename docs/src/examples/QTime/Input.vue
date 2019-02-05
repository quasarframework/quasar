<template>
  <div class="q-pa-md">
    <div class="q-gutter-sm row">
      <q-input filled v-model="time" mask="time" :rules="['time']">
        <q-icon slot="append" name="access_time" class="cursor-pointer">
          <q-popup-proxy>
            <q-time
              v-model="time"
            />
          </q-popup-proxy>
        </q-icon>
      </q-input>

      <q-input filled v-model="timeWithSeconds" mask="fulltime" :rules="['fulltime']">
        <q-icon slot="append" name="access_time" class="cursor-pointer">
          <q-popup-proxy>
            <q-time
              v-model="timeWithSeconds"
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
      timeWithSeconds: '10:56:00'
    }
  }
}
</script>
