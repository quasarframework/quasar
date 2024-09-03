<template>
  <q-dialog ref="dialogRef" v-bind="$attrs">
    <q-card>
      <q-card-section>
        <q-btn label="Dialog Button" />
      </q-card-section>
    </q-card>
  </q-dialog>

  <input />
</template>

<script setup>
defineOptions({
  inheritAttrs: false
})
</script>
