<template>
  <div class="q-pa-md">
    <q-list>
      <q-item tag="label" v-ripple>
        <q-item-section>
          <q-item-label>Battery too low</q-item-label>
        </q-item-section>
        <q-item-section avatar>
          <q-toggle color="blue" v-model="notifications" val="battery" />
        </q-item-section>
      </q-item>

      <q-item tag="label" v-ripple>
        <q-item-section>
          <q-item-label>Friend request</q-item-label>
          <q-item-label caption>Allow notification</q-item-label>
        </q-item-section>
        <q-item-section avatar>
          <q-toggle color="green" v-model="notifications" val="friend" />
        </q-item-section>
      </q-item>

      <q-item tag="label" v-ripple>
        <q-item-section>
          <q-item-label>Picture uploaded</q-item-label>
          <q-item-label caption>Allow notification when uploading images</q-item-label>
        </q-item-section>
        <q-item-section avatar>
          <q-toggle color="red" v-model="notifications" val="picture" />
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    return {
      notifications: ref(['friend'])
    }
  }
}
</script>
