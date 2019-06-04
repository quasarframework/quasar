<template lang="pug">
  q-layout.w-layout(view="hHh LpR fFf")
    w-header.header(elevated)
      w-toolbar
        w-btn(v-if="hasLeftDrawer" flat dense round @click="toggleLeftDrawer()" aria-label="Menu" :icon="leftDrawerOpen && !leftDrawerMini ? 'ao-times' : 'mdi-equal'")
        w-logotype.gt-sm.q-ma-md(:text="productName" orientation="horizontal" :class="{ 'cursor-pointer': logotypeClickable }" @click.native="$emit('logotype-click')")
        w-toolbar-title {{toolbarTitle}}
        slot(name="toolbar-right")
    w-drawer(v-if="hasLeftDrawer" v-model="leftDrawerOpen" :mini="leftDrawerMini" elevated content-class="left-drawer")
      slot(name="left-drawer")
    w-page-container
      router-view
</template>

<script>
import { QLayout, WHeader, WToolbar, WToolbarTitle, WDrawer, WPageContainer } from "quasar";

export default {
  components: { QLayout },
  name: "WLayout",
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
  computed: {
    hasLeftDrawer() {
      return !!this.$slots["left-drawer"];
    },
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
