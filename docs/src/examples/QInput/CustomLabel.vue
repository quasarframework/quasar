<template>
  <div class="q-pa-md">
    <div class="q-gutter-y-md column" style="max-width: 300px">
      <q-input filled v-model="email" suffix="@gmail.com" input-class="text-right" label-slot clearable>
        <template v-slot:label>
          <div class="row items-center all-pointer-events">
            <q-icon class="q-mr-xs" color="deep-orange" size="24px" name="mail" />
            Email (hover for more info)

            <q-tooltip class="bg-grey-8" anchor="top left" self="bottom left" :offset="[0, 8]">Email address</q-tooltip>
          </div>
        </template>
      </q-input>

      <q-input outlined v-model="number" prefix="$" label-slot clearable>
        <template v-slot:prepend>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo.svg">
          </q-avatar>
        </template>

        <template v-slot:label>
          <span class="text-weight-bold text-deep-orange">You</span>
          can customize the <span class="q-px-sm bg-deep-orange text-white text-italic rounded-borders">label</span>
        </template>
      </q-input>
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
