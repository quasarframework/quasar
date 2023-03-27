<template>
  <div class="q-gutter-sm">
    <div
      v-for="color in brandColors"
      :key="color"
      class="brand-color text-center row inline flex-center text-white rounded-borders"
      :class="`bg-${color}`"
    >
      <div class="col">{{ color }}</div>
    </div>
  </div>
</template>

<script>
export default {
  setup () {
    return {
      brandColors: [
        'primary',
        'secondary',
        'accent',
        'dark',
        'positive',
        'negative',
        'info',
        'warning'
      ]
    }
  }
}
</script>

<style lang="sass" scoped>
.brand-color
  width: 130px
  height: 40px
</style>
