<template lang="pug">

.row
  q-checkbox(v-model="model1" label="Label")
  q-checkbox(v-model="model2")
  q-checkbox(v-model="model3")

</template>

<script>

export default {
  data () {
    return {
      model1: true,
      model2: false,
      model3: null
    }
  }
}

</script>
