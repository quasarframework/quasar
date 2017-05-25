<template>
  <div class="layout-padding">
    <!--
      This is for fast tests.
      Use this page but don't add it into your commits (leave it outside
      of your commit).

      For some test that you think it should be persistent,
      make a new *.vue file here or in another folder under /dev/components.
    -->
    <q-checkbox v-model="enable" />
    <div class="bg-grey-9 relative-position" style="width: 200px; height: 200px" v-ripple></div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      enable: false
    }
  },
  methods: {
  }
}
</script>
