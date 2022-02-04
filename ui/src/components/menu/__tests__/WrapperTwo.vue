<template>
  <div style="margin: 200px auto" class="row justify-center">
    <q-btn color="primary" data-cy="wrapper" label="Wrapper" style="width: 100px;">
      <q-menu v-bind="$attrs" data-cy="menu" ref="menuRef">
        <q-form data-cy="div" style="height: 200px">
          <q-input label="input" data-cy="input"></q-input>
          <q-input label="input" data-cy="input-2" autofocus></q-input>
        </q-form>
      </q-menu>
    </q-btn>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  inheritAttrs: false,
  setup () {
    const menuRef = ref(null)

    function toggle () {
      menuRef.value.toggle()
    }

    function focusMethod () {
      menuRef.value.focus()
    }

    function updatePosition () {
      menuRef.value.updatePosition()
    }

    return { menuRef, toggle, focusMethod, updatePosition }
  }
})

</script>
