<template>
  <div class="q-pa-md">
    <div class="q-gutter-y-md column" style="max-width: 300px">
      <q-input filled v-model="email" type="email" suffix="@gmail.com">
        <template v-slot:before>
          <q-icon name="mail" />
        </template>
      </q-input>

      <q-input outlined v-model.number="number" type="number" prefix="$">
        <template v-slot:append>
          <q-avatar>
            <img
              alt="Quasar logo"
              src="https://cdn.quasar.dev/logo-v2/svg/logo.svg"
            />
          </q-avatar>
        </template>
      </q-input>

      <q-input
        standout
        v-model="email"
        type="email"
        prefix="Email:"
        suffix="@gmail.com"
      >
        <template v-slot:prepend>
          <q-icon name="mail" />
        </template>
      </q-input>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const email = ref('')
const number = ref(null)
const text = ref('')
</script>
