<template>
  <q-btn-dropdown
    v-model="dropdownMenuModel"
    align="left"
    dense
    no-caps
    @mouseover="isMouseOverMenu = true"
    @mouseleave="isMouseOverMenu = false"
  >
    <template #label>
      <slot name="label"/>
    </template>
    <nav-dropdown-menu
      :nav-items="items"
      @mouseover="isMouseOverList = true"
      @mouseleave="isMouseOverList = false"
      @submenu-mouseover="isMouseOverList = true"
    />
  </q-btn-dropdown>
</template>

<script>
import { ref, watch } from 'vue'
import { debounce } from 'quasar'
import { defineComponent } from 'vue'
import NavDropdownMenu from 'components/header/NavDropdownMenu.vue'

export default defineComponent({
  name: 'NavDropdownBtn',
  components: {
    NavDropdownMenu
  },
  props: {
    items: {
      type: Array,
      required: true,
      default: () => []
    }
  },
  setup () {
    const dropdownMenuModel = ref(false)

    const isMouseOverMenu = ref(false)
    const isMouseOverList = ref(false)

    function revealDropdownMenu () {
      dropdownMenuModel.value = isMouseOverMenu.value || isMouseOverList.value
    }

    const debounceRevealDropdownMenu = debounce(revealDropdownMenu, 200)

    watch(isMouseOverMenu, () => {
      debounceRevealDropdownMenu()
    })

    watch(isMouseOverList, () => {
      debounceRevealDropdownMenu()
    })

    return {
      dropdownMenuModel,
      isMouseOverMenu,
      isMouseOverList
    }
  }
})
</script>
