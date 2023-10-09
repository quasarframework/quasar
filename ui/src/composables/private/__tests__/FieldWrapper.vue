<template>
  <div style="margin: 150px auto" class="row justify-center" data-cy="wrapper">
    <q-select data-cy="select" class="select-root" ref="compRef" v-bind="$attrs" style="min-width: 300px">
      <template v-for="(_, name) in $slots" #[name]>
        <slot :name="name" />
      </template>
    </q-select>
  </div>
  <q-btn class="hidden" data-cy="method-show" @click="show" />
  <q-btn class="hidden" data-cy="method-hide" @click="hide" />
  <q-btn class="hidden" data-cy="method-toggle" @click="toggle" />
  <q-btn class="hidden" data-cy="method-focus" @click="focusMethod" />
</template>

<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  inheritAttrs: false,
  setup () {
    const compRef = ref(null)

    function show () {
      compRef.value.show()
    }

    function hide () {
      compRef.value.hide()
    }

    function toggle () {
      compRef.value.toggle()
    }

    function focusMethod () {
      compRef.value.focus()
    }

    function blur () {
      compRef.value.blur()
    }

    function validate () {
      compRef.value.validate()
    }

    function resetValidation () {
      compRef.value.resetValidation()
    }
    return { compRef, show, hide, toggle, focusMethod, blur, validate, resetValidation }
  }
})

</script>
