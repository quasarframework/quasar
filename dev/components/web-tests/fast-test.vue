<template>
  <div class="layout-padding bg-grey-3">
    <!--
      This is for fast tests.
      Use this page but don't add it into your commits (leave it outside
      of your commit).

      For some test that you think it should be persistent,
      make a new *.vue file here or in another folder under /dev/components.
    -->
    <q-tabs color="primary">
      <q-tab default slot="title" hide="label" name="three" label="Oaua" icon="bluetooth" />
      <q-tab alert slot="title" hide="icon" name="one" label="Gogu" icon="wifi" />
      <q-tab alert slot="title" name="two" label="Gigiiiiiiiii sdfsdfs aadsf asfsda" icon="important_devices" />

      <q-tab-pane name="one" class="no-border bg-primary text-white">Tab One</q-tab-pane>
      <q-tab-pane name="two" class="no-border">Tab Two</q-tab-pane>
      <q-tab-pane name="three" class="no-border">Tab Three</q-tab-pane>
    </q-tabs>
  </div>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  methods: {
  }
}
</script>

<style lang="stylus">
@import '~variables'

</style>
