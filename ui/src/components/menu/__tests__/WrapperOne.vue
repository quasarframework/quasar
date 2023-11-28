<template>
  <div style="margin: 150px auto" class="row justify-center">
    <div data-cy="hidden" v-if="isHidden">
      Menu is hidden
    </div>
    <q-btn color="primary" data-cy="wrapper" label="Wrapper" style="width: 100px;">
      <q-menu v-bind="$attrs" data-cy="menu" ref="menuRef" @show="isHidden = false" @hide="isHidden = true">
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
  <q-btn class="hidden" data-cy="method-show" @click="show"/>
  <q-btn class="hidden" data-cy="method-hide" @click="hide"/>
  <q-btn class="hidden" data-cy="method-toggle" @click="toggle"/>
  <q-btn class="hidden" data-cy="method-focus" @click="focusMethod"/>
</template>

<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  inheritAttrs: false,
  setup () {
    const menuRef = ref(null)
    const isHidden = ref(false)

    function show () {
      menuRef.value.show()
    }

    function hide () {
      menuRef.value.hide()
    }

    function toggle () {
      menuRef.value.toggle()
    }

    function focusMethod () {
      menuRef.value.focus()
    }

    return { menuRef, isHidden, show, hide, toggle, focusMethod }
  }
})

</script>
