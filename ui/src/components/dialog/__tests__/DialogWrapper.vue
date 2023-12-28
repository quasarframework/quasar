<template>
<q-dialog ref="dialogRef" v-bind="$attrs">
  <q-card>
    <q-card-section>
      <q-btn label="Dialog Button" data-cy="dialog-button"/>
    </q-card-section>
  </q-card>
</q-dialog>

<q-input data-cy="input-field"/>
</template>

<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  inheritAttrs: false,
  setup () {
    const dialogRef = ref(null)

    function focus () {
      dialogRef.value.focus()
    }

    function shake () {
      dialogRef.value.shake()
    }

    return { dialogRef, focus, shake }
  }
})

</script>
