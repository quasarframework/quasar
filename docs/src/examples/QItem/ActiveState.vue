<template>
  <div class="q-pa-md q-gutter-md" style="max-width: 350px">
    <q-toggle v-model="active" label="Active" />

    <q-list bordered separator>
      <q-item clickable v-ripple :active="active">
        <q-item-section avatar>
          <q-icon name="signal_wifi_off" />
        </q-item-section>
        <q-item-section>Active</q-item-section>
        <q-item-section side>Side</q-item-section>
      </q-item>

      <q-item clickable v-ripple :active="active" active-class="text-orange">
        <q-item-section avatar>
          <q-icon name="signal_wifi_off" />
        </q-item-section>
        <q-item-section>Active, Active class</q-item-section>
        <q-item-section side>Side</q-item-section>
      </q-item>

      <q-item clickable v-ripple :active="active" active-class="bg-teal-1 text-grey-8">
        <q-item-section avatar>
          <q-icon name="signal_wifi_off" />
        </q-item-section>
        <q-item-section>Active, Active class</q-item-section>
        <q-item-section side>Side</q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    return {
      active: ref(true)
    }
  }
}
</script>
