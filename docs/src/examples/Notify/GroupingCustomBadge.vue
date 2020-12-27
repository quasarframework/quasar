<template>
  <div class="q-pa-md">
    <q-btn no-caps color="primary" @click="triggerTwice" label="Trigger twice with custom badge" />
  </div>
</template>

<script>
export default {
  methods: {
    triggerTwice () {
      this.$q.notify({
        message: 'Jim pinged you.',
        color: 'purple',
        badgeColor: 'yellow',
        badgeTextColor: 'dark',
        badgeClass: 'shadow-3 glossy my-badge-class'
      })

      this.$q.notify({
        message: 'Jim pinged you.',
        color: 'purple',
        badgeColor: 'yellow',
        badgeTextColor: 'dark',
        badgeClass: 'shadow-3 glossy my-badge-class'
      })
    }
  }
}
</script>

<style lang="sass">
.my-badge-class
  border: 1px solid #ccc
</style>
