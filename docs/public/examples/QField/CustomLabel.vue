<template>
  <div class="q-pa-md">
    <div class="q-gutter-y-md column" style="max-width: 300px">
      <q-field filled :model-value="email" suffix="@gmail.com" label-slot>
        <template v-slot:label>
          <div class="row items-center all-pointer-events">
            <q-icon class="q-mr-xs" color="deep-orange" size="24px" name="mail" />
            Email (hover for more info)

            <q-tooltip class="bg-grey-8" anchor="top left" self="bottom left" :offset="[0, 8]">Email address</q-tooltip>
          </div>
        </template>

        <template v-slot:control>
          <div class="self-center full-width no-outline text-right" tabindex="0">{{email}}</div>
        </template>
      </q-field>

      <q-field outlined :model-value="number" prefix="$" label-slot>
        <template v-slot:control>
          <div class="self-center full-width no-outline" tabindex="0">{{number}}</div>
        </template>

        <template v-slot:append>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo.svg">
          </q-avatar>
        </template>

        <template v-slot:label>
          <span class="text-weight-bold text-deep-orange">You</span>
          can customize the <span class="q-px-sm bg-deep-orange text-white text-italic rounded-borders">label</span>
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
      email: ref('john.doe'),
      number: ref(123)
    }
  }
}
</script>
