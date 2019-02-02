<template>
  <div class="q-pa-md" style="max-width: 300px">
    <q-input
      v-model="text"
      filled
      autogrow
    />
  </div>
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
