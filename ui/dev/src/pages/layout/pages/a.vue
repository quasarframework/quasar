<template>
  <q-page class="bg-yellow page-a-padding">
    <div>Page A</div>

    <br>

    <q-btn @click="$router.push('/layout-quick/a')">
      Go to A
    </q-btn>
    <q-btn @click="$router.push('/layout-quick/b')">
      Go to B
    </q-btn>
    <q-btn @click="$router.push('/layout-quick/c')">
      Go to C
    </q-btn>

    <br><br>

    <q-btn @click="$router.replace('/layout-quick/a')">
      Replace Go to A
    </q-btn>
    <q-btn @click="$router.replace('/layout-quick/b')">
      Replace Go to B
    </q-btn>
    <q-btn @click="$router.replace('/layout-quick/c')">
      Replace Go to C
    </q-btn>

    <div v-for="n in 50" :key="n">
      {{ n }} Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    </div>

    <q-page-sticky position="right" expand class="bg-secondary text-white">
      <div class="fit flex items-center">
        <q-toolbar>
          <q-btn flat round dense icon="map" />
          <q-toolbar-title>Title</q-toolbar-title>
        </q-toolbar>
      </div>
    </q-page-sticky>

    <q-page-sticky position="left" expand class="bg-accent text-white">
      <div class="fit flex items-center">
        <q-toolbar>
          <q-btn flat round dense icon="map" />
          <q-toolbar-title>Title</q-toolbar-title>
        </q-toolbar>
      </div>
    </q-page-sticky>

    <q-page-sticky position="top" expand class="bg-amber">
      <q-toolbar>
        <q-btn flat round dense icon="map" />
        <q-toolbar-title>Title</q-toolbar-title>
      </q-toolbar>
    </q-page-sticky>

    <q-page-sticky position="bottom" expand class="bg-purple text-white">
      <q-toolbar>
        <q-btn flat round dense icon="map" />
        <q-toolbar-title>Title</q-toolbar-title>
      </q-toolbar>
    </q-page-sticky>
  </q-page>
</template>

<script>
export default {
  data () {
    return {}
  },
  created () {
    console.log('A created')
  },
  beforeUnmount () {
    console.log('A beforeUnmount')
  }
}
</script>

<style lang="stylus">
.page-a-padding
  padding 55px 125px
</style>
