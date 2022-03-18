<template>
  <q-btn
    v-if="!navItem.subMenu"
    :class="`text-weight-bold letter-spacing-225 ${classes}`"
    :color="setActivePrimaryNavColor($route.path, navItem.path)"
    :href="computeRouteNav(navItem, 'href')"
    :label="navItem.label"
    :padding="padding"
    :target="navItem.href ? '_blank' : '_self'"
    :to="computeRouteNav(navItem)"
    flat
  />
  <nav-dropdown-btn
    v-else
    :class="`${classes}`"
    :color="!dark ? 'black-54' : ''"
    :items="navItem.subMenu"
    :label="navItem.label"
    :padding="padding"
    class="text-weight-bold letter-spacing-225 text-size-12 wrap"
    content-class="shadow-bottom-medium"
    flat
    outline
  />
</template>
<script>
import NavDropdownBtn from 'components/header/NavDropdownBtn.vue'
import { computeRouteNav } from 'assets/header/nav-items.js'
import { computed, defineComponent } from 'vue'

export default defineComponent({
  name: 'HeaderNavLink',
  components: { NavDropdownBtn },
  props: {
    dark: {
      type: Boolean,
      default: true
    },
    navItem: {
      type: Object,
      required: true
    },
    navItemClass: {
      type: String,
      default: ''
    },
    padding: {
      type: String,
      default: 'xs md'
    }
  },
  setup (props) {
    function setActivePrimaryNavColor (routePath, navItemPath) {
      if (routePath === `/${navItemPath}`) {
        return props.dark ? 'white' : 'brand-primary'
      }
    }

    // For some reason CSS won't apply correctly "color: inherit" and display the wrong text-color
    // when changing the theme in docs. Force the correct one depending on the provided dark prop
    const classes = computed(() => `${props.navItemClass} ${props.dark ? 'white-color-on-hover text-white-54' : 'text-black-54'}`)

    return {
      classes,
      computeRouteNav,
      setActivePrimaryNavColor
    }
  }
})
</script>

<style lang="scss" scoped>
// Increase specificity to match `text-xxx` one and override them
.white-color-on-hover.white-color-on-hover:hover {
  color: $white !important;
}
</style>
