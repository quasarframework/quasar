<template>
  <div class="video">
    <iframe :src="source" frameborder="0" allowfullscreen></iframe>
  </div>
</template>

<script>
export default {
  props: ['src']
}
</script>
