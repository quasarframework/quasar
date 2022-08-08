<template>
  <q-toggle
    v-model="colorScheme"
    color="primary"
    checked-icon="nightlight"
    unchecked-icon="light_mode"
    true-value="dark"
    false-value="light"
  />
</template>

<script>
import { defineComponent } from 'vue'
import { useColorScheme } from '../../composables'

export default defineComponent({
  name: 'color-scheme-switcher',
  setup () {
    const { colorScheme } = useColorScheme()

    return {
      colorScheme
    }
  }
})
</script>
