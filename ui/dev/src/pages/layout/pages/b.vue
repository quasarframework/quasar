<template>
  <q-page padding class="bg-teal-2">
    <div>Page B</div>

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
  </q-page>
</template>

<script>
export default {
  data () {
    return {}
  },
  created () {
    console.log('B created')
  },
  beforeUnmount () {
    console.log('B beforeUnmount')
  }
}
</script>
