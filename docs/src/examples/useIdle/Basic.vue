<template>
  <div class="q-pa-md">
    <div class="row items-center q-gutter-sm q-mb-md">
      <q-btn color="primary" label="resetIdle()" no-caps @click="resetIdle" />
      <q-toggle v-model="disabled" label="Disable tracking" />
    </div>

    <div class="row items-center q-gutter-sm">
      <q-badge
        :color="isIdle ? 'orange' : 'positive'"
        :label="isIdle ? 'idle' : 'active'"
      />
      <div v-if="elapsed !== null">Last activity: {{ elapsed }}s ago</div>
    </div>

    <div class="text-caption q-mt-sm">
      Stop moving the mouse, typing or touching the page for 5 seconds.
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useIdle, useInterval } from 'quasar'

const disabled = ref(false)

const { isIdle, lastActive, resetIdle } = useIdle(() => ({
  timeout: 5000,
  disabled: disabled.value
}))

const elapsed = ref(null)
const { registerInterval } = useInterval()

onMounted(() => {
  registerInterval(() => {
    elapsed.value = Math.round((Date.now() - lastActive.value) / 1000)
  }, 1000)
})
</script>
