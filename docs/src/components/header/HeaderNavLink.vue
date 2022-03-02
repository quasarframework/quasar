<template>
  <q-btn
    v-if="!navItem.subMenu"
    :class="`text-weight-bold letter-spacing-225 ${navItemClass} ${dark? 'white-color-on-hover':'text-black-54'}`"
    :color="setActivePrimaryNavColor($route.path, navItem.path)"
    :href="computeRouteNav(navItem, 'href')"
    :label="navItem.label"
    :padding="padding"
    :target="navItem.href? '_blank':'_self'"
    :to="computeRouteNav(navItem)"
    flat
  />
  <nav-dropdown-btn
    v-else
    :items="navItem.subMenu"
    :class="`${dark? 'white-color-on-hover':''} ${navItemClass}`"
    :label="navItem.label"
    class="text-weight-bold letter-spacing-225 text-size-12 wrap"
    content-class="shadow-bottom-medium"
    outline
    flat
    :color="!dark? 'black-54':''"
    :padding="padding"
  />
</template>
<script>
import NavDropdownBtn from 'components/header/NavDropdownBtn.vue'
import { computeRouteNav } from 'assets/landing-page/nav-items.js'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'HeaderNavLink',
  components: {
    NavDropdownBtn
  },
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
})
</script>
