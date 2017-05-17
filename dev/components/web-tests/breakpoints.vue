<template>
  <div class="layout-padding">
    <div v-for="type in types" :class="type">{{type}}</div>
    <q-window-resize-observable @resize="resize" />
    <p class="caption" :class="`bg-${color}`">{{w}} - {{width}}</p>
  </div>
</template>

<script>
export default {
  data () {
    return {
      width: 0,
      types: ['xs', 'gt-xs', 'lt-sm', 'sm', 'gt-sm', 'lt-md', 'md', 'gt-md', 'lt-lg', 'lg', 'gt-lg', 'lt-xl', 'xl']
    }
  },
  computed: {
    w () {
      if (this.width <= 575) {
        return 'xs'
      }
      if (this.width <= 767) {
        return 'sm'
      }
      if (this.width <= 991) {
        return 'md'
      }
      if (this.width <= 1199) {
        return 'lg'
      }
      return 'xl'
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
  },
  methods: {
    resize ({width}) {
      if (width !== this.width) {
        this.width = width
      }
    }
  }
}
</script>
