<template>
  <button class="primary clear" @click="showBackgroundProgress()">
    Show Background Progress
  </button>
</template>

<script>
import { Loading } from 'quasar-framework'

export default {
  methods: {
    showBackgroundProgress () {
      Loading.show()
      setTimeout(Loading.hide, 3000)
    }
  }
}
</script>
