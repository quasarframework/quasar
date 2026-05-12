<template>
  <q-btn v-bind="$props">
    <!-- QBtn has no scoped slots -->
    <template v-for="(_, slotName) in slots" #[slotName]>
      <slot :name="slotName" />
    </template>
  </q-btn>
</template>

<script setup lang="ts">
import type { QBtnProps, QBtnSlots } from 'quasar';

withDefaults(defineProps<QBtnProps>(), {
  dense: true,
  outline: true,
});

const slots = defineSlots<QBtnSlots>();
</script>
