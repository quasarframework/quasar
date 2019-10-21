<template>
  <div class="q-pa-md">
    <q-linear-progress style="height: 25px" :value="progress" color="accent" class="q-mt-sm q-mt-sm row flex-center">
      <div class="text-black">
        {{ progressLabel }}
      </div>
    </q-linear-progress>
  </div>
</template>

<script>
export default {
  data () {
    return {
      progress: 0.4
    }
  },

  computed: {
    progressLabel () {
      return (this.progress * 100).toFixed(2) + '%'
    }
  }
}
</script>
