<template>
  <div class="q-pa-md">
    <div class="q-gutter-y-md column" style="max-width: 300px">
      <q-input clearable filled color="purple-12" v-model="text" label="Label" />

      <!-- equivalent -->
      <q-input color="orange" filled v-model="text" label="Label">
        <template v-if="text" v-slot:append>
          <q-icon name="cancel" @click.stop="text = null" class="cursor-pointer" />
        </template>
      </q-input>

      <!-- clear-icon -->
      <q-input
        clearable
        clear-icon="close"
        filled
        color="purple-12"
        v-model="text"
        label="Label"
      />
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    return {
      text: ref('Some text')
    }
  }
}
</script>
