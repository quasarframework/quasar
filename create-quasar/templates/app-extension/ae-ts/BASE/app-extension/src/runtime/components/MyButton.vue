<template>
  <q-btn v-bind="$props">
    <!-- QBtn has no scoped slots -->
    <template v-for="(_, slotName) in $slots" #[slotName]>
      <slot :name="slotName" />
    </template>
  </q-btn>
</template>

<script lang="ts">
import { defineComponent, SlotsType } from 'vue';
import { QBtn, QBtnProps, QBtnSlots } from 'quasar';
import { PropOptions } from './types';

export default defineComponent({
  name: 'MyButton',
  props: {
    ...(QBtn['props'] as PropOptions<QBtnProps>),
    dense: {
      type: Boolean,
      default: true,
    },
    outline: {
      type: Boolean,
      default: true,
    },
  },
  slots: Object as SlotsType<QBtnSlots>,
});
</script>
