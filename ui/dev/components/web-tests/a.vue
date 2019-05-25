<template>
  <div class="q-layout-padding">
    <div>{{ $q.screen.height }} / {{ $q.screen.width }}</div>
    <q-btn @click="$router.replace('/web-tests/b')">
      Go to B
    </q-btn>
  </div>
</template>

<script>
export default {
  data () {
    return {}
  }
}
</script>
