<template>
  <div class="q-video">
    <iframe :src="src" frameborder="0" allowfullscreen></iframe>
  </div>
</template>

<script>
export default {
  name: 'q-video',
  props: ['src']
}
</script>
