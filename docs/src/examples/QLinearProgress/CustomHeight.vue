<template>
  <div class="q-pa-md">
    <q-linear-progress size="10px" :value="progress" />

    <q-linear-progress rounded size="20px" :value="progress" color="warning" class="q-mt-sm" />

    <q-linear-progress rounded size="15px" :value="progress" color="secondary" class="q-mt-sm" />

    <q-linear-progress size="25px" :value="progress" color="accent" class="q-mt-sm" />
  </div>
</template>

<script>
export default {
  setup () {
    return {
      progress: 0.4
    }
  }
}
</script>
