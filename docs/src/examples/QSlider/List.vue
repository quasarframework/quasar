<template>
  <div class="q-pa-md">
    <q-list>
      <q-item>
        <q-item-section avatar>
          <q-icon name="volume_up" />
        </q-item-section>
        <q-item-section>
          <q-slider
            v-model="volume"
            :min="0"
            :max="10"
            label
          />
        </q-item-section>
      </q-item>

      <q-item>
        <q-item-section avatar>
          <q-icon name="brightness_medium" />
        </q-item-section>
        <q-item-section>
          <q-slider
            v-model="brightness"
            :min="0"
            :max="10"
            label
          />
        </q-item-section>
      </q-item>

      <q-item>
        <q-item-section avatar>
          <q-icon name="mic" />
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
    </q-list>
  </div>
</template>

<script>
export default {
  data () {
    return {
      volume: 6,
      brightness: 3,
      mic: 8
    }
  }
}
</script>
