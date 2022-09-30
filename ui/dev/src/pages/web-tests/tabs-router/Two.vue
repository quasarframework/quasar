<template>
  <div>Tab <mark>two</mark> Content</div>
</template>

<script>
export default {
  name: 'Two',

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
