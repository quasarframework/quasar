<template>
  <div class="q-pa-md q-gutter-sm">
    <q-btn to="/docs" label="To Docs index" outline color="secondary" />
    <q-btn to="/docs" label="To Docs index in 2s" @click="linkClick" glossy color="secondary" />

    <q-btn type="a" href="/docs" label="Type 'a'" push color="secondary" />
    <q-btn type="a" href="/docs" target="_blank" label="Type 'a' - external" color="secondary" />
  </div>
</template>

<script>
export default {
  methods: {
    linkClick (e, go) {
      e.navigate = false // we choose when we navigate

      console.log('triggering navigation in 2s')
      setTimeout(() => {
        console.log('navigating as promised 2s ago')
        go()
      }, 2000)
    }
  }
}
</script>
