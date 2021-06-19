<template>
  <div class="q-layout-padding">
    <div v-for="type in types" :key="type" :class="type">
      {{ type }}
    </div>
    <p class="caption" :class="`bg-${color}`">
      {{ w }} - {{ $q.screen.sizes[w] }} - {{ $q.screen.width }}
    </p>
  </div>
</template>

<script>
export default {
  data () {
    return {
      types: [ 'xs', 'gt-xs', 'lt-sm', 'sm', 'gt-sm', 'lt-md', 'md', 'gt-md', 'lt-lg', 'lg', 'gt-lg', 'lt-xl', 'xl' ]
    }
  },

  computed: {
    w () {
      const screen = this.$q.screen
      if (screen.xl) { return 'xl' }
      if (screen.lg) { return 'lg' }
      if (screen.md) { return 'md' }
      if (screen.sm) { return 'sm' }
      return 'xs'
    },
    color () {
      if (this.w === 'xs') {
        return 'yellow-2'
      }
      if (this.w === 'sm') {
        return 'yellow-4'
      }
      if (this.w === 'md') {
        return 'yellow-6'
      }
      if (this.w === 'lg') {
        return 'yellow-8'
      }
      return 'yellow-10'
    }
  }
}
</script>
