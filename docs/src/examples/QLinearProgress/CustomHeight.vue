<template>
  <div class="q-pa-md">
    <q-linear-progress style="height: 10px" :value="progress" />

    <q-linear-progress rounded style="height: 20px" :value="progress" color="warning" class="q-mt-sm" />

    <q-linear-progress rounded style="height: 15px" :value="progress" color="secondary" class="q-mt-sm" />

    <q-linear-progress style="height: 25px" :value="progress" color="accent" class="q-mt-sm" />
  </div>
</template>

<script>
export default {
  data () {
    return {
      progress: 0.4
    }
  }
}
</script>
