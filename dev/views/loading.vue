<template>
  <button class="primary push" @click="loading1()">
    Loading
  </button>
  <button class="primary push" @click="loading2()">
    Loading with Message
  </button>
</template>

<script>
import { Loading } from 'quasar'

export default {
  methods: {
    loading1 () {
      Loading.show()
      setTimeout(Loading.hide, 7000)
    },
    loading2 () {
      Loading.show({message: 'Global Progress is a feature that you can use to display an overlay with a spinner on top of your Apps content to inform the user that a background operation is taking place.'})
      setTimeout(Loading.hide, 7000)
    }
  }
}
</script>
