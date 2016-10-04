<template>
  <button class="circular small raised" @click="closeFAB()">
    <i><slot></slot></i>
  </button>
</template>

<script>
export default {
  methods: {
    closeFAB () {
      this.$dispatch('closeFAB')
    }
  }
}
</script>
