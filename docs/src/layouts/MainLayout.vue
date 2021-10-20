<template>
  <q-layout view="hHh lpR fFf">

    <q-header class="bg-h-dark homepage-header">
      <q-toolbar>
        <q-toolbar-title>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg">
          </q-avatar>
          QUASAR
        </q-toolbar-title>
        <q-space />

        <q-tabs v-model="tab" active-color="white" class="homepage-header__navigation" dense indicator-color="transparent" shrink>
          <q-tab name="tab1" label="Home" />
          <q-tab name="tab2" label="Features" />
          <q-tab name="tab3" label="Services" />
          <q-tab name="tab4" label="Components" />
          <q-tab name="tab5" label="Become Sponsor" />
          <q-tab name="tab6" label="About" />
          <q-tab name="tab7" label="Blog" />
        </q-tabs>
        <q-btn color="h-primary" flat icon="search" round padding="none" />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer class="bg-grey-8 text-white">
      <q-toolbar>
        <q-toolbar-title>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg">
          </q-avatar>
          <div>Title</div>
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>

  </q-layout>
</template>

<script lang='ts'>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'MainLayout',
  setup () {
    const tab = ref('tab1')

    return {
      tab
    }
  }
})
</script>

<style scoped lang="scss">
.homepage-header {
  padding: 1rem 2rem;
  border-bottom: 1px solid $homepage-primary;
  &__navigation {
    color: #979797;
  }
}
</style>
