<template>
  <div class="q-pa-md">
    <q-input filled v-model="input" mask="date" :rules="['date']">
      <template v-slot:append>
        <q-icon name="event" class="cursor-pointer">
          <q-popup-proxy :breakpoint="600">
            <q-date v-model="input" />
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    return {
      input: ref(''),
      date: ref('2018/11/03')
    }
  }
}
</script>
