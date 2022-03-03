<template>
  <q-list class="shadow-bottom-small font-monserrat letter-spacing-263 q-py-sm">
    <template v-for="(navItem, navIndex) in navItems" :key="`navMenu-${navIndex}`">
      <q-separator v-if="navItem.isSeparator" class="q-mb-sm q-mt-md"/>
      <template v-else>
        <q-item-label v-if="navItem.isHeader" header class="text-lp-accent text-size-12 q-pt-lg q-pb-sm letter-spacing-40">
          {{ navItem.label }}
        </q-item-label>
        <q-item
          v-else-if="!navItem.subMenu"
          clickable v-close-popup
          :to="computeRouteNav(navItem)"
          :href="computeRouteNav(navItem, 'href')"
          :target="navItem.href? '_blank':'_self'"
          class="add-shadow-on-hover"
          @mouseover="closeSubMenusAround(navIndex)"
        >
          <q-item-section avatar v-if="navItem.icon">
            <q-icon :name="navItem.icon" color="lp-primary"/>
          </q-item-section>
          <q-item-section>{{ navItem.label }}</q-item-section>
        </q-item>
        <q-item v-else clickable class="add-shadow-on-hover" @mouseover="openSubMenu(navIndex)">
          <q-item-section>{{ navItem.label }}</q-item-section>
          <q-item-section side>
            <q-icon name="keyboard_arrow_right"/>
          </q-item-section>

          <q-menu v-model="subMenuModel[navIndex]" anchor="top end" self="top start" class="shadow-bottom-medium">
            <nav-dropdown-menu
              :nav-items="navItem.subMenu"
              @mouseover="$emit('submenu-mouseover')"
            />
          </q-menu>
        </q-item>
      </template>
    </template>
  </q-list>
</template>
<script>
import { defineComponent, ref } from 'vue'
import { computeRouteNav } from 'assets/landing-page/nav-items.js'

export default defineComponent({
  name: 'NavDropdownMenu',
  props: {
    navItems: {
      type: Array,
      required: true
    }
  },
  setup () {
    const subMenuModel = ref([])

    function closeSubMenusAround (navIndex) {
      subMenuModel.value[ navIndex + 1 ] = false // submenu after current menu
      subMenuModel.value[ navIndex - 1 ] = false // submenu before current menu
    }

    function openSubMenu (navIndex) {
      subMenuModel.value[ navIndex ] = true

      closeSubMenusAround(navIndex)
    }

    return {
      computeRouteNav,

      subMenuModel,
      openSubMenu,
      closeSubMenusAround
    }
  }
})
</script>

<style lang="scss" scoped>
.add-shadow-on-hover:hover {
  background-color: rgba($lp-primary, 0.08);
}
</style>
