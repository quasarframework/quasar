<template>
  <div class="q-layout-padding">
    <span v-if="$q.screen.lt.md">lt-md</span>
    <span v-if="$q.screen.md">md</span>
    <span v-if="$q.screen.gt.md">gt-md</span>
    <div>
      <span class="lt-md">lt-md</span>
      <span class="md">md</span>
      <span class="gt-md">gt-md</span>
    </div>
    <pre>{{ screen }}</pre>
  </div>
</template>

<script>
export default {
  computed: {
    screen () {
      const { width, height, name, sizes, lt, gt, xs, sm, md, lg, xl } = this.$q.screen
      return { width, height, name, sizes, lt, gt, xs, sm, md, lg, xl }
    }
  },
  watch: {
    '$q.screen.gt.md' (state) {
      console.log('watcher $q.screen.gt.md', state)
    }
  } /* ,
  beforeCreate () {
    this.$q.screen.setSizes({
      sm: 300,
      md: 500,
      lg: 700,
      xl: 900
    })
  },
  mounted () {
    this.$q.screen.setSizes({
      sm: 400,
      md: 600,
      lg: 800,
      xl: 1000
    })
  } */
}
</script>
