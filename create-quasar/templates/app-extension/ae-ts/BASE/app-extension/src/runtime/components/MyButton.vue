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

// You can also use <script setup lang="ts">, but it won't work in app-webpack JS apps
// without extra configuration in the app's webpack config
// If https://github.com/unjs/mkdist/pull/210 gets released, you will be able to use
// <script setup lang="ts"> if not using type-only macros, e.g. defineProps<QBtnProps>()
// If you will only use the app-extension by yourself or within your organization, and you
// don't have JS app-webpack apps, then you can freely use <script setup lang="ts">

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
