<template lang="pug">
.q-my-lg.q-mx-md.q-pa-md.text-center
  q-icon(:name="mdiTextBoxSearchOutline" color="brand-primary" size="4em")
  .q-mt-md.text-weight-thin We searched for it but could't find it... It may exist and not yet indexed.
  .q-mt-sm Please refine your search terms.
</template>

<script>
import { mdiTextBoxSearchOutline } from '@quasar/extras/mdi-v5'

export default {
  name: 'ResultEmpty',
  created () {
    this.mdiTextBoxSearchOutline = mdiTextBoxSearchOutline
  }
}
</script>
