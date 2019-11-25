<template lang="pug">

.row
  q-toggle(v-model="model1" label="Label")
  q-toggle(v-model="model2")

</template>

<script>

export default {
  data () {
    return {
      model1: true,
      model2: false
    }
  }
}

</script>
