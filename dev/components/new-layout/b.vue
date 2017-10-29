<template>
  <div class="layout-padding bg-teal-2">
    <div>Page B</div>

    <br>

    <q-btn @click="$router.push('/back/a')">Go to A</q-btn>
    <q-btn @click="$router.push('/back/b')">Go to B</q-btn>
    <q-btn @click="$router.push('/back/c')">Go to C</q-btn>

    <br><br>

    <q-btn @click="$router.replace('/back/a')">Replace Go to A</q-btn>
    <q-btn @click="$router.replace('/back/b')">Replace Go to B</q-btn>
    <q-btn @click="$router.replace('/back/c')">Replace Go to C</q-btn>
  </div>
</template>

<script>
export default {
  data () {
    return {}
  },
  created () {
    console.log('B created')
  },
  beforeDestroy () {
    console.log('B beforeDestroy')
  }
}
</script>
