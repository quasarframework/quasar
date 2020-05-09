<template>
  <div class="q-layout-padding">
    <!--
      This is for fast tests.
      Use this page but don't add it into your commits (leave it outside
      of your commit).

      For some test that you think it should be persistent,
      make a new *.vue file here or in another folder under /dev/components.
    -->
    <q-knob v-model="gigi" />
    <q-knob v-model="gigi" instant-feedback />
  </div>
</template>

<script>
/* eslint-disable */

export default {
  data () {
    return {
      gigi: 7
    }
  },
  methods: {
  }
}
</script>

<style lang="sass">
</style>
