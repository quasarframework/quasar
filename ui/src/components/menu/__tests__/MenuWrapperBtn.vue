<template>
  <div style="margin: 150px auto" class="row justify-center">
    <q-btn color="primary" data-cy="wrapper" label="Wrapper" style="width: 100px;">
      <q-menu v-bind="$attrs" data-cy="menu">
        <q-list style="min-width: 120px">
          <q-item clickable v-close-popup data-cy="close-popup">
            <q-item-section>VClosePopup</q-item-section>
          </q-item>
          <q-item clickable data-cy="keep-open">
            <q-item-section>KeepOpen</q-item-section>
          </q-item>
        </q-list>
      </q-menu>
    </q-btn>
  </div>
  <div data-cy="other-target" class="col-12 other-target bg-red q-pa-lg text-white">Other target</div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  inheritAttrs: false,
  setup () {

  }
})

</script>
