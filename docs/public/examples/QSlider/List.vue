<template>
  <div class="q-pa-md">
    <q-list dense>
      <q-item>
        <q-item-section avatar>
          <q-icon color="teal" name="volume_up" />
        </q-item-section>
        <q-item-section>
          <q-slider
            v-model="volume"
            :min="0"
            :max="10"
            label
            color="teal"
          />
        </q-item-section>
      </q-item>

      <q-item>
        <q-item-section avatar>
          <q-icon color="deep-orange" name="brightness_medium" />
        </q-item-section>
        <q-item-section>
          <q-slider
            v-model="brightness"
            :min="0"
            :max="10"
            label
            color="deep-orange"
          />
        </q-item-section>
      </q-item>

      <q-item>
        <q-item-section avatar>
          <q-icon color="primary" name="mic" />
        </q-item-section>
        <q-item-section>
          <q-slider
            v-model="mic"
            :min="0"
            :max="50"
            label
          />
        </q-item-section>
      </q-item>

      <q-separator inset spaced />

      <q-item>
        <q-item-section side>
          <q-icon name="volume_down" />
        </q-item-section>
        <q-item-section>
          <q-slider
            v-model="volume"
            :min="0"
            :max="10"
            label
          />
        </q-item-section>
        <q-item-section side>
          <q-icon name="volume_up" />
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
      volume: ref(6),
      brightness: ref(3),
      mic: ref(8)
    }
  }
}
</script>
