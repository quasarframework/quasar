<template>
  <q-btn
    v-if="!navItem.subMenu"
    :class="`text-weight-bold letter-spacing-225 ${navItemClass} ${dark? 'white-color-on-hover':''}`"
    :color="setActivePrimaryNavColor($route.path, navItem.path)"
    :href="computeRouteNav(navItem, 'href')"
    :label="navItem.label"
    :padding="padding"
    :target="navItem.href? '_blank':'_self'"
    :to="computeRouteNav(navItem)"
    flat
  />
  <q-btn-dropdown
    v-else
    :class="`${dark? 'white-color-on-hover':''} ${navItemClass}`"
    :color="!dark? 'black-54':''"
    :label="navItem.label"
    :menu-offset="[150, 0]"
    :padding="padding"
    align="left"
    class="text-weight-bold letter-spacing-225 text-size-12 wrap"
    content-class="shadow-bottom-medium"
    dense
    flat
    no-caps
  >
    <nav-dropdown-menu :nav-items="navItem.subMenu"/>
  </q-btn-dropdown>
</template>
<script>
import NavDropdownMenu from 'components/header/NavDropdownMenu'
import { computeRouteNav } from 'assets/landing-page/nav-items.js'

export default {
  name: 'HeaderNavLink',
  components: { NavDropdownMenu },
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
        return props.dark ? 'white' : 'lp-primary'
      }
    }

    return {
      computeRouteNav,
      setActivePrimaryNavColor
    }
  }
}
</script>
