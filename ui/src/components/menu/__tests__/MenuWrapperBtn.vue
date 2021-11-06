<template>
  <q-btn color="primary" data-cy="wrapper" label="Wrapper">
    <q-menu v-bind="$attrs" data-cy="menu">
      <q-list style="min-width: 100px">
        <q-item clickable v-close-popup data-cy="close-popup">
          <q-item-section>VClosePopup</q-item-section>
        </q-item>
        <q-item clickable data-cy="keep-open">
          <q-item-section>KeepOpen</q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </q-btn>
  <div data-cy="other-target" class="other-target bg-red q-pa-lg text-white">
    Other target
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  inheritAttrs: false,
  setup () {

  }
})

</script>
