<template>
  <div class="layout-padding">
    <!--
      This is for fast tests.
      Use this page but don't add it into your commits (leave it outside
      of your commit).

      For some test that you think it should be persistent,
      make a new *.vue file here or in another folder under /dev/components.
    -->
    <div style="height: 300px"></div>

    <q-scroll-area style="width: 400px; height: 500px;" class="bg-yellow">
      <div style="margin-top: 150px"></div>
      <div style="margin-bottom: 25px" v-for="n in number">{{n}} Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. <q-btn>Click</q-btn></div>
    </q-scroll-area>

    <br>
    <q-btn @click="number--">Less</q-btn>
    <q-btn @click="number++">More</q-btn>

    <div style="height: 1000px"></div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      number: 10,
      height: 1
    }
  }
}
</script>
