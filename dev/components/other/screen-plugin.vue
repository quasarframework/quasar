<template>
  <div class="layout-padding">
    <span v-if="$q.screen.lt.md">lt-md</span>
    <span v-if="$q.screen.md">md</span>
    <span v-if="$q.screen.gt.md">gt-md</span>
    <div>
      <span class="lt-md">lt-md</span>
      <span class="md">md</span>
      <span class="gt-md">gt-md</span>
    </div>
    <pre>{{ $q.screen }}</pre>
  </div>
</template>

<script>
export default {
  watch: {
    '$q.screen.gt.md' (state) {
      console.log('watcher $q.screen.gt.md', state)
    }
  }
}
</script>
