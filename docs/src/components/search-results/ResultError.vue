<template lang="pug">
.q-my-lg.q-mx-md.q-pa-md.text-center
  q-icon(:name="mdiAlert" color="negative" size="4em")
  .q-mt-md.text-weight-thin It's not you, it's me.
  .text-weight-thin Could not connect with our search service...
</template>

<script>
import { mdiAlert } from '@quasar/extras/mdi-v5'

export default {
  name: 'ResultError',
  setup () {
    return { mdiAlert }
  }
}
</script>
