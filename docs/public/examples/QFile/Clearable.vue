<template>
  <div class="q-pa-md">
    <div class="q-gutter-y-md column" style="max-width: 300px">
      <q-file clearable filled color="purple-12" v-model="model" label="Label" />

      <!-- equivalent -->
      <q-file color="orange" filled v-model="model" label="Label">
        <template v-if="model" v-slot:append>
          <q-icon name="cancel" @click.stop.prevent="model = null" class="cursor-pointer" />
        </template>
      </q-file>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    return {
      model: ref(null)
    }
  }
}
</script>
