<template>
  <div class="layout-padding">
    <!--
      This is for fast tests.
      Use this page but don't add it into your commits (leave it outside
      of your commit).

      For some test that you think it should be persistent,
      make a new *.vue file here or in another folder under /dev/components.
    -->
    <q-tabs>
      <q-route-tab
        color="red"
        slot="title"
        icon="bug_report"
        replace
        to="/issue-2394"
        label="I Should Be Red"
      />

      <q-tab
        color="red"
        slot="title"
        icon="bug_report"
        replace
        label="Red As Expected"
      />
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
