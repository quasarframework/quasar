<template>
  <div class="q-layout-padding">
    <!--
      This is for fast tests.
      Use this page but don't add it into your commits (leave it outside
      of your commit).

      For some test that you think it should be persistent,
      make a new *.vue file here or in another folder under /dev/components.
    -->
    <q-btn-toggle value="off" :options="options" @click="notify" @mouseover="notify" class="q-ma-md" />
  </div>
</template>

<script>
/* eslint-disable */

export default {
  data () {
    return {
      options: [{label:'Popup', value: 'on'}, {label:'No popup', value: 'off'}]
    }
  },
  methods: {
    notify: function () {
      this.$q.notify('Running on Quasar v' + this.$q.version)
    }
  }
}
</script>

<style lang="sass">
</style>
