<template>
  <div class="q-pa-md">
    <q-btn
      color="secondary"
      @click="toggle"
      :icon="$q.fullscreen.isActive ? 'fullscreen_exit' : 'fullscreen'"
      :label="$q.fullscreen.isActive ? 'Exit Fullscreen' : 'Go Fullscreen'"
    />
  </div>
</template>

<script>
export default {
  methods: {
    toggle (e) {
      const target = e.target.parentNode.parentNode.parentNode

      this.$q.fullscreen.toggle(target)
        .then(() => {
          // success!
        })
        .catch((err) => {
          alert(err)
          // uh, oh, error!!
          // console.error(err)
        })
    }
  }
}
</script>
