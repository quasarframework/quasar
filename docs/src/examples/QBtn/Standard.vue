<template>
  <div class="q-pa-sm">
    <q-btn color="white" text-color="black" label="Standard" />
    <q-btn color="primary" label="Primary" />
    <q-btn color="secondary" label="Secondary" />
    <q-btn color="amber" label="Amber" />
    <q-btn color="brown-5" label="Brown 5" />
    <q-btn color="deep-orange" label="Deep Orange" />
    <q-btn color="purple" label="Purple" />
    <q-btn color="black" label="Black" />
  </div>
</template>

<script>
export default {
  name: 'gigi',

  methods: {
    some () {
      return 'wow'
    }
  }
}
</script>

<style lang="stylus" scoped>
.q-btn
  margin 5px
</style>
