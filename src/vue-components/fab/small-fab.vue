<template>
  <button class="circular small raised" @click="$emit('closeFAB')">
    <i><slot></slot></i>
  </button>
</template>

<script>
export default {}
</script>
