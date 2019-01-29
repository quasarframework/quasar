<template>
  <div class="q-gutter-sm">
    <div
      v-for="color in brandColors"
      :key="color"
      class="brand-color shadow-1 text-center row inline flex-center text-white rounded-borders"
      :class="`bg-${color}`"
    >
      <div class="col">{{ color }}</div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      brandColors: [
        'primary',
        'secondary',
        'accent',
        'positive',
        'negative',
        'info',
        'warning'
      ]
    }
  }
}
</script>

<style lang="stylus" scoped>
.brand-color
  width 130px
  height 40px
</style>
