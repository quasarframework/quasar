<template>
  <div class="q-pa-md q-gutter-sm">
    <q-btn to="/start/pick-quasar-flavour" label="To Docs index" outline color="purple" />
    <q-btn to="/start/pick-quasar-flavour" label="To Docs index in 2s" @click="linkClick" glossy color="purple" />

    <q-btn type="a" href="start/pick-quasar-flavour" label="Type 'a'" push color="purple" />
    <q-btn type="a" href="start/pick-quasar-flavour" target="_blank" label="Type 'a' - external" color="purple" />
  </div>
</template>

<script>
export default {
  setup () {
    function linkClick (e, go) {
      e.preventDefault() // we choose when we navigate

      // console.log('triggering navigation in 2s')
      setTimeout(() => {
        // console.log('navigating as promised 2s ago')
        go()
      }, 2000)
    }

    return { linkClick }
  }
}
</script>
