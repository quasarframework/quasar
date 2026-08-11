<template>
  <div class="q-ma-md">
    Last item should be: {{ count - 1 }}

    <q-scroll-area
      style="height: 320px; min-width: 350px; max-width: 380px"
      ref="scroll"
    >
      <q-chat-message
        v-for="m in messages"
        :key="m.id"
        :text="[m.text]"
      ></q-chat-message>
    </q-scroll-area>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

const messages = ref(
  Array.from({ length: 20 }, (_, id) => ({
    id,
    text: 'message ' + id
  }))
)

const scroll = ref(null)

const count = computed(() => messages.value.length)

function scrollDown() {
  setTimeout(() => {
    scroll.value.setScrollPercentage('vertical', 1)
  }, 0)
}

watch(count, () => {
  scrollDown()
})

let timer = null

onMounted(() => {
  scrollDown()

  timer = setInterval(() => {
    const id = messages.value.length

    messages.value = [...messages.value, { id, text: 'New message ' + id }]
  }, 2000)
})

onBeforeUnmount(() => {
  clearInterval(timer)
})
</script>
