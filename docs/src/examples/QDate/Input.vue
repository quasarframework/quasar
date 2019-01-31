<template>
  <div class="q-pa-md" style="max-width: 300px">
    <q-input filled v-model="date" mask="date" :rules="['date']">
      <q-icon slot="append" name="event" class="cursor-pointer">
        <q-popup-proxy>
          <q-date v-model="date" />
        </q-popup-proxy>
      </q-icon>
    </q-input>
  </div>
</template>

<script>
export default {
  data () {
    return {
      date: '2019/02/01'
    }
  }
}
</script>
