<template lang="pug">
  w-layout.w-layout(view="hHh LpR fFf")
    w-header.header(elevated)
      w-toolbar
        w-btn(flat dense round @click="toggleLeftDrawer()" aria-label="Menu")
          w-icon(:name="leftDrawerOpen && !leftDrawerMini ? 'ao-close' : 'ao-equal'")
        w-logotype.gt-sm.q-ma-md(:text="productName" orientation="horizontal" :class="{ 'cursor-pointer': logotypeClickable }" @click.native="$emit('logotype-click')")
        w-toolbar-title {{toolbarTitle}}
    w-drawer(v-model="leftDrawerOpen" :mini="leftDrawerMini" elevated content-class="left-drawer")
      slot(name="left-drawer")
    w-page-container
      router-view
</template>

<script>
import { WLayout, WHeader, WToolbar, WToolbarTitle, WDrawer, WPageContainer } from "quasar";

export default {
  name: "WAppLayout",
  props: {
    productName: {
      type: String,
      default: null,
    },
    toolbarTitle: {
      type: String,
      default: null,
    },
    logotypeClickable: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      leftDrawerOpen: true,
      leftDrawerMini: false,
    };
  },
  methods: {
    toggleLeftDrawer() {
      if (this.$q.screen.gt.sm) {
        this.leftDrawerOpen = true;
        this.leftDrawerMini = !this.leftDrawerMini;
      } else {
        this.leftDrawerMini = false;
        this.leftDrawerOpen = !this.leftDrawerOpen;
      }
    },
  },
};
</script>
