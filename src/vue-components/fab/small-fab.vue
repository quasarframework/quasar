<template>
  <button class="circular small raised" @click="$parent.close()">
    <i><slot></slot></i>
  </button>
</template>

<script>
export default {}
</script>
