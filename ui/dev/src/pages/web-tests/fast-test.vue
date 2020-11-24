<template>
  <div class="q-layout-padding">
    <!--
      This is for fast tests.
      Use this page but don't add it into your commits (leave it outside
      of your commit).

      For some test that you think it should be persistent,
      make a new *.vue file here or in another folder under /dev/components.
    -->
    <q-tabs v-model="currentTab">
      <q-tab v-for="tab in tabs" :key="tab" :name="tab" :label="tab" />
    </q-tabs>

    <q-tab-panels v-model="currentTab">
      <q-tab-panel key="a" name="a">
        Tab A
      </q-tab-panel>
      <q-tab-panel v-for="tab in tabs" :key="tab" :name="tab">
        Tab {{ tab }}
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>

<script>
/* eslint-disable */

export default {
  data () {
    return {
      currentTab: 'a',
      tabs: [ 'a', 'one', 'two', 'three' ]
    }
  },
  methods: {
  }
}
</script>

<style lang="sass">
</style>
