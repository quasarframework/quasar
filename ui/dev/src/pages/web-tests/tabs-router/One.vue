<template>
  <div>Tab <mark>one</mark> Content</div>
</template>

<script>
export default {
  name: 'One',

  props: {
    allowRouteChange: {
      type: Boolean
    }
  },

  beforeRouteLeave (to, from, next) {
    next(this.allowRouteChange)
  }
}
</script>
