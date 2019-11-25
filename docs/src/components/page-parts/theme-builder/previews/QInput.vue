<template lang="pug">
.row.q-col-gutter-md
  q-input.col-12.col-lg-4(v-model="text" label="Standard")
  q-input.col-12.col-lg-4(filled v-model="text" label="Filled")
  q-input.col-12.col-lg-4(outlined v-model="text" label="Outlined")
  q-input.col-12.col-lg-4(standout v-model="text" label="Standout")
  q-input.col-12.col-lg-4(borderless v-model="text" label="Borderless")
  q-input.col-12.col-lg-4(v-model="text" label="With error" :error="true" error-message="Error message")
</template>

<script>

export default {
  data () {
    return {
      text: ''
    }
  }
}

</script>
