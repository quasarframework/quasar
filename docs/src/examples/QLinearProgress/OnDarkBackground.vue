<template>
  <div class="q-pa-md bg-grey-10 text-white">
    <q-linear-progress dark size="10px" :value="progress1" color="warning" />

    <q-linear-progress dark stripe rounded size="20px" :value="progress2" color="red" class="q-mt-sm" />

    <q-linear-progress dark rounded indeterminate color="secondary" class="q-mt-sm" />

    <q-linear-progress dark query color="cyan" class="q-mt-sm" />
  </div>
</template>

<script>
export default {
  setup () {
    return {
      progress1: 0.4,
      progress2: 0.62
    }
  }
}
</script>
