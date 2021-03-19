<template>
  <div class="q-pa-lg flex flex-center">
    <q-pagination
      v-model="current"
      :max="5"
    />
  </div>
</template>

<script>
export default {
  data () {
    return {
      current: 3
    }
  }
}
</script>
