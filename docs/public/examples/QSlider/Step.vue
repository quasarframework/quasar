<template>
  <div class="q-pa-md">
    <q-badge color="secondary">
      Model: {{ basicModel }} (0 to 100, step 50)
    </q-badge>
    <q-slider
      v-model="basicModel"
      :step="50"
    />
    <q-badge color="secondary">
      Model: {{ redModel }} (0 to 100, step 25)
    </q-badge>
    <q-slider
      v-model="redModel"
      color="red"
      :step="25"
    />
    <q-badge color="secondary">
      Model: {{ greenModel }} (0 to 5, step 1)
    </q-badge>
    <q-slider
      v-model="greenModel"
      color="green"
      :min="0"
      :step="1"
      :max="5"
    />
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    return {
      basicModel: ref(50),
      redModel: ref(25),
      greenModel: ref(2)
    }
  }
}
</script>
