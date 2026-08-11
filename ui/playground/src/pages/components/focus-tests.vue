<template>
  <div class="q-ma-lg">
    <div class="q-my-sm">
      <q-input ref="focus_1" v-model="text" />
    </div>
    <div class="q-my-sm">
      <input ref="focus_2" v-model="text" />
    </div>

    <div class="q-gutter-md">
      <q-btn color="primary" label="Focus QInput" @click="() => focus(1)" />
      <q-btn color="primary" label="Focus Input" @click="() => focus(2)" />
      <q-btn color="primary" label="Do nothing" />
      <q-btn
        color="primary"
        label="Link"
        :to="`/components/focus-tests#${index}`"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const text = ref('')
const index = ref(1)

const focus_1 = ref(null)
const focus_2 = ref(null)

watch(route, () => {
  index.value += 1
})

function focus(target) {
  const el = { focus_1, focus_2 }[`focus_${target}`]?.value
  el?.focus()
}
</script>
