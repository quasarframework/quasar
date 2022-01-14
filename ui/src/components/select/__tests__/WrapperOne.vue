<template>
  <div style="margin: 150px auto" class="row justify-center" data-cy="wrapper">
    <q-select
      data-cy="select"
      class="select-root"
      ref="compRef"
      v-bind="$attrs"
      style="min-width: 300px"
    >
      <template v-for="(_, slot) in $slots" v-slot:[slot]="scope">
        <slot :name="slot" v-bind="{ ...scope }" />
      </template>
    </q-select>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  inheritAttrs: false,
  setup () {
    const compRef = ref(null)

    return { compRef }
  }
})
</script>
