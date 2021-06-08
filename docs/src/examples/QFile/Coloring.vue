<template>
  <div class="q-pa-md">
    <div class="q-gutter-y-md column" style="max-width: 300px">
      <q-file color="purple-12" v-model="model" label="Label">
        <template v-slot:prepend>
          <q-icon name="attach_file" />
        </template>
      </q-file>

      <q-file color="teal" filled v-model="model" label="Label">
        <template v-slot:prepend>
          <q-icon name="cloud_upload" />
        </template>
      </q-file>

      <q-file color="grey-3" outlined label-color="orange" v-model="model" label="Label">
        <template v-slot:append>
          <q-icon name="attachment" color="orange" />
        </template>
      </q-file>

      <q-file color="lime-11" bg-color="green" filled v-model="model" label="Label">
        <template v-slot:prepend>
          <q-icon name="attachment" />
        </template>
      </q-file>

      <q-file color="teal" outlined v-model="model" label="Label">
        <template v-slot:append>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo.svg">
          </q-avatar>
        </template>
      </q-file>

      <q-file clearable color="orange" standout bottom-slots v-model="model" label="Label" counter>
        <template v-slot:prepend>
          <q-icon name="attach_file" />
        </template>
        <template v-slot:append>
          <q-icon name="favorite" />
        </template>

        <template v-slot:hint>
          Field hint
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
