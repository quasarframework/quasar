<template>
  <div class="q-pa-md q-gutter-md">
    <q-btn
      push
      color="teal"
      label="Toggle"
      @click="toggle"
    />

    <!-- using v-if so you can see the effect -->
    <q-img
      v-if="url !== null"
      :src="url"
      :ratio="1"
      class="q-mt-md"
      style="width: 150px"
      placeholder-src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAACWBAMAAADOL2zRAAAAG1BMVEXMzMyWlpaqqqq3t7fFxcW+vr6xsbGjo6OcnJyLKnDGAAAACXBIWXMAAA7EAAAOxAGVKw4bAAABAElEQVRoge3SMW+DMBiE4YsxJqMJtHOTITPeOsLQnaodGImEUMZEkZhRUqn92f0MaTubtfeMh/QGHANEREREREREREREtIJJ0xbH299kp8l8FaGtLdTQ19HjofxZlJ0m1+eBKZcikd9PWtXC5DoDotRO04B9YOvFIXmXLy2jEbiqE6Df7DTleA5socLqvEFVxtJyrpZFWz/pHM2CVte0lS8g2eDe6prOyqPglhzROL+Xye4tmT4WvRcQ2/m81p+/rdguOi8Hc5L/8Qk4vhZzy08DduGt9eVQyP2qoTM1zi0/uf4hvBWf5c77e69Gf798y08L7j0RERERERERERH9P99ZpSVRivB/rgAAAABJRU5ErkJggg=="
    />
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    const url = ref(null)

    return {
      url,
      toggle () {
        url.value = url.value === null
          ? 'https://picsum.photos/500/300?t=' + Math.random()
          : null
      }
    }
  }
}
</script>
