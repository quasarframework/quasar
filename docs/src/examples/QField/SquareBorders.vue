<template>
  <div class="q-pa-md">
    <div class="q-gutter-y-md column" style="max-width: 300px">
      <q-field square filled>
        <template v-slot:prepend>
          <q-icon name="event" />
        </template>

        <template v-slot:control>
          <div class="self-center full-width no-outline" tabindex="0">{{text}}</div>
        </template>
      </q-field>

      <q-field square outlined>
        <template v-slot:control>
          <div class="self-center full-width no-outline" tabindex="0">{{text}}</div>
        </template>

        <template v-slot:append>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo.svg">
          </q-avatar>
        </template>
      </q-field>

      <q-field square standout bottom-slots :model-value="text" label="Label" stack-label counter>
        <template v-slot:prepend>
          <q-icon name="place" />
        </template>

        <template v-slot:control>
          <div class="self-center full-width no-outline" tabindex="0">{{text}}</div>
        </template>

        <template v-slot:append>
          <q-icon name="close" @click="text = ''" class="cursor-pointer" />
        </template>

        <template v-slot:hint>
          Field hint
        </template>
      </q-field>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    return {
      text: ref('Field content')
    }
  }
}
</script>
