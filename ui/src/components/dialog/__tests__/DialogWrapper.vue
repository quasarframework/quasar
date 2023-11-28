<template>
  <div data-cy="dialog-page">
    <q-dialog ref="dialogRef" v-bind="$attrs" data-cy="dialog-form">
      <q-card data-cy="dialog-card">
        <q-card-section>
          <div class="text-h6">
            Dialog section
          </div>
        </q-card-section>

        <q-card-section>
          <q-btn label="Dialog Button" data-cy="dialog-button"/>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-input data-cy="input-field"/>
  </div>
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
