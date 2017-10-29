<template>
  <div class="layout-padding bg-grey-4">
    <div>Page C</div>

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
    console.log('C created')
  },
  beforeDestroy () {
    console.log('C beforeDestroy')
  }
}
</script>
