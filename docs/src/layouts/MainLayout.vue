<template>
  <q-layout view="hHh lpR fff" class="bg-lp-dark">

    <q-header>
      <q-toolbar class="bg-lp-dark q-py-sm q-px-md">
        <q-toolbar-title>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg">
          </q-avatar>
          QUASAR
        </q-toolbar-title>
        <q-space />

        <div class="row items-center">
          <q-btn
            label="Home"
            color="white"
            flat
            class="q-py-sm q-px-md"
          />
          <q-btn
            label="Features"
            color="lp-light"
            flat
            class="q-py-sm q-px-md"
          />
          <q-btn
            color="lp-light"
            flat
            label="Services"
            class="q-py-sm q-px-md"
          />
          <q-btn
            color="lp-light"
            flat
            label="Components"
            class="q-py-sm q-px-md"
          />
          <q-btn
            color="lp-light"
            flat
            label="Become sponsor"
            class="q-py-sm q-px-md"
          />
          <q-btn
            color="lp-light"
            flat
            label="About"
            class="q-py-sm q-px-md"
          />
          <q-btn
            color="lp-light"
            flat
            label="Blog"
            class="q-py-sm q-px-md"
          />
          <q-btn flat round color="lp-primary" class="q-ml-sm" icon="search" padding="xs"/>
        </div>

      </q-toolbar>
      <q-separator color="lp-primary"/>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer class="" style="background-color: #dbe1e5;">
      <div class="row justify-center bg-white">
        <div class="help">
          <q-toolbar>
            <q-tabs v-model="tabs" align="justify" class="text-grey-7">
              <q-tab name="mails" label="Why quasar" class="help__link" />
              <q-tab name="alarms" label="Team" class="help__link" />
              <q-tab
                name="movies"
                label="Video tutorials"
                class="help__link"
              />
              <q-tab
                name="photos"
                label="Quasar brand resources"
                class="help__link"
              />
              <q-tab name="alarms" label="MIT license" class="help__link" />
              <q-tab
                name="alarms"
                label="Privacy policy"
                class="help__link"
              />
            </q-tabs>
          </q-toolbar>
        </div>
      </div>

      <div class="row justify-center q-pt-xl q-mt-md">
        <div class="col-10 row q-pt-md">
          <div class="col">
            <div class="row q-col-gutter-lg q-gutter-y-lg text-size-12 text-capitalize">
              <template v-for="footerItem in footerItems" :key="footerItem.label">
                <div class="col-2">
                  <q-list>
                    <q-item-label class="q-pa-none text-lp-dark"
                    >{{ footerItem.label }}</q-item-label
                    >
                    <q-separator spaced color="lp-primary" />
                    <template v-for="(item, i) in footerItem.items" :key="i">
                      <q-item dense class="q-pa-none" clickable :to="item.to">
                        <q-item-section class="text-lp-dark">
                          {{ item.label }}
                        </q-item-section>
                      </q-item>
                    </template>
                  </q-list>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </q-footer>

  </q-layout>
</template>

<script lang='ts'>
import { defineComponent, ref } from 'vue'
import footerItems from 'assets/landing-page/landing-page-footer.ts'

export default defineComponent({
  name: 'MainLayout',
  setup () {
    const tab = ref('tab1')

    return {
      tab,
      footerItems
    }
  }
})
</script>

<style scoped lang="scss">

</style>
