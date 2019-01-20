<template>
  <div class="q-pa-md q-gutter-md">
    <div class="row justify-center">
      <q-input filled v-model="date" mask="date" :rules="['date']">
        <q-icon slot="append" name="event" class="cursor-pointer">
          <q-popup-proxy>
            <q-date
              v-model="date"
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
      date: '2019/02/01'
    }
  }
}
</script>
