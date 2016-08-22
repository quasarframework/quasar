<template>
  <div class="video">
    <iframe :src="src" frameborder="0" allowfullscreen></iframe>
  </div>
</template>

<script>
export default {
  props: ['src']
}
</script>
