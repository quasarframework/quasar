<template>
  <div class="layout-padding bg-yellow">
    <div>Page A</div>

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
    console.log('A created')
  },
  beforeDestroy () {
    console.log('A beforeDestroy')
  }
}
</script>
