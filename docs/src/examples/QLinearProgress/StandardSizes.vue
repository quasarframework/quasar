<template>
  <div class="q-pa-md q-gutter-md">
    <q-linear-progress
      v-for="size in ['xs', 'sm', 'md', 'lg', 'xl']"
      :key="size"
      :size="size"
      :value="progress"
      color="primary"
      @click="randomize"
      label="Change Model"
    />
  </div>
</template>

<script>
export default {
  data () {
    return {
      progress: 0.65
    }
  },

  methods: {
    randomize () {
      this.progress = Math.random()
    }
  }
}
</script>
