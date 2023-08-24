<template>
  <div class="q-pa-md">
    <div class="q-gutter-y-md column" style="max-width: 300px">
      <q-field color="purple-12" label="Label" stack-label>
        <template v-slot:prepend>
          <q-icon name="event" />
        </template>
        <template v-slot:control>
          <div class="self-center full-width no-outline" tabindex="0">{{text}}</div>
        </template>
      </q-field>

      <q-field color="teal" filled label="Label" stack-label>
        <template v-slot:prepend>
          <q-icon name="event" />
        </template>
        <template v-slot:control>
          <div class="self-center full-width no-outline" tabindex="0">{{text}}</div>
        </template>
      </q-field>

      <q-field color="grey-3" label-color="orange" outlined label="Label" stack-label>
        <template v-slot:append>
          <q-icon name="event" color="orange" />
        </template>
        <template v-slot:control>
          <div class="self-center full-width no-outline" tabindex="0">{{text}}</div>
        </template>
      </q-field>

      <q-field color="lime-11" bg-color="green" filled label="Label" stack-label>
        <template v-slot:prepend>
          <q-icon name="event" />
        </template>
        <template v-slot:control>
          <div class="self-center full-width no-outline" tabindex="0">{{text}}</div>
        </template>
      </q-field>

      <q-field color="teal" outlined label="Label" stack-label>
        <template v-slot:append>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo.svg">
          </q-avatar>
        </template>
        <template v-slot:control>
          <div class="self-center full-width no-outline" tabindex="0">{{text}}</div>
        </template>
      </q-field>

      <q-field color="orange" standout bottom-slots :model-value="text" label="Label" stack-label counter clearable>
        <template v-slot:prepend>
          <q-icon name="place" />
        </template>
        <template v-slot:control>
          <div class="self-center full-width no-outline" tabindex="0">{{text}}</div>
        </template>
        <template v-slot:append>
          <q-icon name="favorite" />
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
