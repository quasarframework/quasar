<template>
  <q-layout :view="view">
    <q-header
      v-if="pick.header"
      v-model="play.header"
      :reveal="cfg.headerReveal"
      :elevated="cfg.headerSep === 'elevated'"
      :bordered="cfg.headerSep === 'bordered'"
      height-hint="98"
    >
      <q-toolbar>
        <q-btn v-if="pick.left" dense flat round :icon="mdiMenu" @click="play.left = !play.left" />

        <q-toolbar-title>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg">
          </q-avatar>
          Layout Builder
        </q-toolbar-title>

        <q-btn v-if="pick.right" dense flat round :icon="mdiMenu" @click="play.right = !play.right" />
      </q-toolbar>

      <q-tabs v-if="pick.navtabs" v-model="navTabModel" align="left">
        <q-tab name="tab1" label="Tab One" />
        <q-tab name="tab2" label="Tab Two" />
        <q-tab name="tab3" label="Tab Three" />
      </q-tabs>
    </q-header>

    <q-page-container>
      <q-page padding class="flex justify-center items-start">
        <q-stepper
          animated
          header-nav
          flat
          bordered
          alternative-labels
          :contracted="isContracted"
          color="secondary"
          v-model="step"
          ref="stepper"
          style="max-width: 600px"
        >
          <q-step name="pick" title="Pick Layout Parts" :icon="mdiViewDashboard">
            <div class="column">
              <q-toggle v-model="pick.header" label="I want a QHeader" />
              <q-toggle v-model="pick.footer" label="I want a QFooter" />
              <q-toggle v-model="pick.left" label="I want a left-side QDrawer" />
              <q-toggle v-model="pick.right" label="I want a right-side QDrawer" />
              <q-toggle :disable="!pick.header" v-model="pick.navtabs" label="I want navigation tabs (requires QHeader)" />
            </div>
          </q-step>

          <q-step name="cfg" title="Configure Layout Parts" :icon="mdiCog" class="q-pb-lg">
            <div class="q-mb-md text-grey-8">Layout "View"</div>

            <div class="q-mb-lg rounded-borders overflow-hidden shadow-2">
              <div class="row">
                <div class="col-3 q-pa-md flex flex-center" :class="topL === 'h' ? 'bg-primary text-white' : 'bg-orange text-grey-9'">
                  <q-option-group
                    inline
                    color="white"
                    keep-color
                    dense
                    v-model="topL"
                    :options="[{ label: 'l', value: 'l'}, { label: 'h', value: 'h'}]"
                  />
                </div>
                <div class="col-6 q-pa-md flex flex-center bg-primary text-white">
                  <q-option-group
                    inline
                    color="white"
                    keep-color
                    dense
                    v-model="topC"
                    :options="[{ label: 'h', value: 'h'}, { label: 'H', value: 'H'}]"
                  />
                </div>
                <div class="col-3 q-pa-md flex flex-center" :class="topR === 'h' ? 'bg-primary text-white' : 'bg-orange text-grey-9'">
                  <q-option-group
                    inline
                    color="white"
                    keep-color
                    dense
                    v-model="topR"
                    :options="[{ label: 'r', value: 'r'}, { label: 'h', value: 'h'}]"
                  />
                </div>
              </div>

              <div class="row">
                <div class="col-3 q-px-md q-py-xl flex flex-center bg-orange text-grey-9">
                  <q-option-group
                    inline
                    color="white"
                    keep-color
                    dense
                    v-model="middleL"
                    :options="[{ label: 'l', value: 'l'}, { label: 'L', value: 'L'}]"
                  />
                </div>
                <div class="col-6 q-px-md q-py-xl flex flex-center">
                  Page
                </div>
                <div class="col-3 q-px-md q-py-xl flex flex-center bg-orange text-grey-9">
                  <q-option-group
                    inline
                    color="white"
                    keep-color
                    dense
                    v-model="middleR"
                    :options="[{ label: 'r', value: 'r'}, { label: 'R', value: 'R'}]"
                  />
                </div>
              </div>

              <div class="row">
                <div class="col-3 q-pa-md flex flex-center" :class="bottomL === 'f' ? 'bg-grey-8 text-white' : 'bg-orange text-grey-9'">
                  <q-option-group
                    inline
                    color="white"
                    keep-color
                    dense
                    v-model="bottomL"
                    :options="[{ label: 'l', value: 'l'}, { label: 'f', value: 'f'}]"
                  />
                </div>
                <div class="col-6 q-pa-md flex flex-center bg-grey-8 text-white">
                  <q-option-group
                    inline
                    color="white"
                    keep-color
                    dense
                    v-model="bottomC"
                    :options="[{ label: 'f', value: 'f'}, { label: 'F', value: 'F'}]"
                  />
                </div>
                <div class="col-3 q-pa-md flex flex-center" :class="bottomR === 'f' ? 'bg-grey-8 text-white' : 'bg-orange text-grey-9'">
                  <q-option-group
                    inline
                    color="white"
                    keep-color
                    dense
                    v-model="bottomR"
                    :options="[{ label: 'r', value: 'r'}, { label: 'f', value: 'f'}]"
                  />
                </div>
              </div>
            </div>

            <template v-if="pick.header">
              <div class="q-pt-lg q-pb-sm text-grey-8">Header</div>

              <div class="q-pl-lg q-gutter-y-sm">
                <q-toggle v-model="cfg.headerReveal" label="Header Reveal" />
                <q-select
                  v-model="cfg.headerSep"
                  label="Separator type"
                  outlined
                  dense
                  options-dense
                  map-options
                  emit-value
                  :options="sepOptions"
                  options-cover
                  style="max-width: 200px"
                />
              </div>
            </template>

            <template v-if="pick.footer">
              <div class="q-pt-lg q-pb-sm text-grey-8">Footer</div>

              <div class="q-pl-lg q-gutter-y-sm">
                <q-toggle v-model="cfg.footerReveal" label="Footer Reveal" />
                <q-select
                  v-model="cfg.footerSep"
                  label="Separator type"
                  outlined
                  dense
                  options-dense
                  map-options
                  emit-value
                  :options="sepOptions"
                  options-cover
                  style="max-width: 200px"
                />
              </div>
            </template>

            <template v-if="pick.left">
              <div class="q-pt-lg q-pb-sm text-grey-8">Left-side Drawer</div>

              <div class="q-pl-lg q-gutter-y-sm">
                <q-toggle v-model="cfg.leftOverlay" label="Overlay mode" />
                <q-select
                  v-model="cfg.leftBehavior"
                  label="Behavior"
                  outlined
                  dense
                  options-dense
                  map-options
                  emit-value
                  :options="drawerBehaviorOptions"
                  options-cover
                  style="max-width: 200px"
                />
                <q-select
                  v-model="cfg.leftSep"
                  label="Separator type"
                  outlined
                  dense
                  options-dense
                  map-options
                  emit-value
                  :options="sepOptions"
                  options-cover
                  style="max-width: 200px"
                />
              </div>
            </template>

            <template v-if="pick.right">
              <div class="q-pt-lg q-pb-sm text-grey-8">Right-side Drawer</div>

              <div class="q-pl-lg q-gutter-y-sm">
                <q-toggle v-model="cfg.rightOverlay" label="Overlay mode" />
                <q-select
                  v-model="cfg.rightBehavior"
                  label="Behavior"
                  outlined
                  dense
                  options-dense
                  map-options
                  emit-value
                  :options="drawerBehaviorOptions"
                  options-cover
                  style="max-width: 200px"
                />
                <q-select
                  v-model="cfg.rightSep"
                  label="Separator type"
                  outlined
                  dense
                  options-dense
                  map-options
                  emit-value
                  :options="sepOptions"
                  options-cover
                  style="max-width: 200px"
                />
              </div>
            </template>
          </q-step>

          <q-step name="play" title="Play with Layout" :icon="mdiPlayCircleOutline">
            <div class="column">
              <q-toggle v-model="play.header" label="Visible Header" />
              <q-toggle v-model="play.footer" label="Visible Footer" />
              <q-toggle v-model="play.left" label="Visible left-side Drawer" />
              <q-toggle v-model="play.right" label="Visible right-side Drawer" />
              <q-toggle v-model="play.scroll" label="Inject Drawer content for scrolling" />
            </div>
          </q-step>

          <template v-slot:navigation>
            <q-stepper-navigation>
              <q-separator spaced />
              <div class="row q-col-gutter-sm">
                <div v-if="step !== 'play'" class="col-12 col-sm-auto">
                  <q-btn class="full-width" color="brand-primary" @click="$refs.stepper.next()" label="Continue" />
                </div>
                <div class="col-12 col-sm-auto">
                  <q-btn class="full-width" color="black" label="Export Layout" @click="exportDialog = true" />
                </div>
              </div>
            </q-stepper-navigation>
          </template>
        </q-stepper>

        <q-dialog v-model="exportDialog">
          <q-card>
            <div class="export-code">
              <doc-code lang="html" :code="layoutExport" />
            </div>

            <q-separator />

            <q-card-actions align="right">
              <q-btn color="brand-primary" flat label="Close" v-close-popup />
            </q-card-actions>
          </q-card>
        </q-dialog>
      </q-page>
    </q-page-container>

    <q-drawer
      v-if="pick.left"
      v-model="play.left"
      show-if-above
      :behavior="cfg.leftBehavior"
      :overlay="cfg.leftOverlay"
      :elevated="cfg.leftSep === 'elevated'"
      :bordered="cfg.leftSep === 'bordered'"
      :breakpoint="1023"
    >
      <q-scroll-area class="fit">
        <q-item-label header>Left Drawer</q-item-label>
        <div v-if="play.scroll" class="text-grey" style="padding: 25px 16px 16px;">
          <p v-for="n in 50" :key="`right-${n}`">
            <em>Left Drawer has intended scroll</em>
          </p>
        </div>
      </q-scroll-area>
    </q-drawer>

    <q-drawer
      v-if="pick.right"
      v-model="play.right"
      show-if-above
      side="right"
      :behavior="cfg.rightBehavior"
      :overlay="cfg.rightOverlay"
      :elevated="cfg.rightSep === 'elevated'"
      :bordered="cfg.rightSep === 'bordered'"
      :breakpoint="1023"
    >
      <q-scroll-area style="height: calc(100% - 204px); margin-top: 204px">
        <q-item-label header>Right Drawer</q-item-label>
        <div v-if="play.scroll" class="text-grey" style="padding: 25px 16px 16px;">
          <p v-for="n in 50" :key="`right-${n}`">
            <em>Right Drawer has intended scroll</em>
          </p>
        </div>
      </q-scroll-area>

      <q-img class="absolute-top" src="https://cdn.quasar.dev/img/material.png" style="height: 204px">
        <div class="absolute-bottom bg-transparent">
          <q-avatar size="56px" class="q-mb-sm">
            <img src="https://cdn.quasar.dev/img/boy-avatar.png">
          </q-avatar>
          <div class="text-weight-bold">Razvan Stoenescu</div>
          <div>@rstoenescu</div>
        </div>
      </q-img>
    </q-drawer>

    <q-footer
      v-if="pick.footer"
      v-model="play.footer"
      class="bg-grey-8"
      :reveal="cfg.footerReveal"
      :elevated="cfg.footerSep === 'elevated'"
      :bordered="cfg.footerSep === 'bordered'"
    >
      <q-toolbar>
        <q-btn v-if="pick.left" dense flat round :icon="mdiMenu" @click="play.left = !play.left" />

        <q-toolbar-title>Quasar</q-toolbar-title>

        <q-btn v-if="pick.right" dense flat round :icon="mdiMenu" @click="play.right = !play.right" />
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script>
import { useMeta, useQuasar } from 'quasar'
import { ref, reactive, computed } from 'vue'

import {
  mdiMenu, mdiViewDashboard, mdiCog, mdiPlayCircleOutline
} from '@quasar/extras/mdi-v5'

import getMeta from 'assets/get-meta.js'

const drawerBehaviorOptions = [
  { label: 'Behave Normal', value: 'default' },
  { label: 'Behave Mobile', value: 'mobile' },
  { label: 'Behave Desktop', value: 'desktop' }
]

const sepOptions = [
  { label: 'None', value: 'none' },
  { label: 'Elevated', value: 'elevated' },
  { label: 'Bordered', value: 'bordered' }
]

export default {
  setup () {
    useMeta({
      title: 'Layout Builder',

      meta: getMeta(
        'Layout Builder | Quasar Framework',
        'Tool to build Quasar layouts. Configure the layout parts then export the code.'
      )
    })

    const $q = useQuasar()

    const topL = ref('h')
    const topC = ref('H')
    const topR = ref('h')
    const middleL = ref('l')
    const middleR = ref('R')
    const bottomL = ref('f')
    const bottomC = ref('F')
    const bottomR = ref('f')

    const pick = reactive({
      header: true,
      footer: true,
      left: true,
      right: true,
      navtabs: true
    })

    const cfg = reactive({
      headerReveal: false,
      headerSep: 'elevated',

      footerReveal: false,
      footerSep: 'elevated',

      leftBehavior: 'default',
      leftOverlay: false,
      leftSep: 'bordered',

      rightBehavior: 'default',
      rightOverlay: false,
      rightSep: 'bordered'
    })

    const play = reactive({
      header: true,
      footer: true,
      left: false,
      right: false,

      scroll: true
    })

    const view = computed(() => {
      const
        top = `${topL.value}${topC.value}${topR.value}`,
        middle = `${middleL.value}p${middleR.value}`,
        bottom = `${bottomL.value}${bottomC.value}${bottomR.value}`

      return `${top} ${middle} ${bottom}`
    })

    return {
      topL,
      topC,
      topR,
      middleL,
      middleR,
      bottomL,
      bottomC,
      bottomR,

      navTabModel: ref('tab1'),
      step: ref('pick'),
      exportDialog: ref(false),

      pick,
      cfg,
      play,

      view,

      drawerBehaviorOptions,
      sepOptions,

      mdiMenu,
      mdiViewDashboard,
      mdiCog,
      mdiPlayCircleOutline,

      isContracted: computed(() => {
        return $q.screen.lt.sm === true || (
          $q.screen.md === true &&
          play.left === true &&
          cfg.leftOverlay === false &&
          play.right === true &&
          cfg.rightOverlay === false
        )
      }),

      layoutExport: computed(() => {
        let code = `<${'template'}>
  <q-layout view="${view.value}">
`

        if (pick.header) {
          code += `
    <q-header ${cfg.headerReveal ? 'reveal ' : ''}${cfg.headerSep !== 'none' ? cfg.headerSep + ' ' : ''}class="bg-primary text-white"${pick.navtabs ? ' height-hint="98"' : ''}>
      <q-toolbar>${pick.left ? `
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />
` : ''}
        <q-toolbar-title>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg">
          </q-avatar>
          Title
        </q-toolbar-title>${pick.right ? `

        <q-btn dense flat round icon="menu" @click="toggleRightDrawer" />` : ''}
      </q-toolbar>${pick.navtabs ? `

      <q-tabs align="left">
        <q-route-tab to="/page1" label="Page One" />
        <q-route-tab to="/page2" label="Page Two" />
        <q-route-tab to="/page3" label="Page Three" />
      </q-tabs>` : ''}
    </q-header>
`
        }

        if (pick.left) {
          code += `
    <q-drawer ${cfg.leftBehavior !== 'mobile' && !cfg.leftOverlay ? 'show-if-above ' : ''}v-model="leftDrawerOpen" side="left"${cfg.leftOverlay ? ' overlay' : ''}${cfg.leftBehavior !== 'default' ? ` behavior="${cfg.leftBehavior}"` : ''}${cfg.leftSep !== 'none' ? ' ' + cfg.leftSep : ''}>
      <!-- drawer content -->
    </q-drawer>
`
        }

        if (pick.right) {
          code += `
    <q-drawer ${cfg.rightBehavior !== 'mobile' && !cfg.rightOverlay ? 'show-if-above ' : ''}v-model="rightDrawerOpen" side="right"${cfg.rightOverlay ? ' overlay' : ''}${cfg.rightBehavior !== 'default' ? ` behavior="${cfg.rightBehavior}"` : ''}${cfg.rightSep !== 'none' ? ' ' + cfg.rightSep : ''}>
      <!-- drawer content -->
    </q-drawer>
`
        }

        code += `
    <q-page-container>
      <router-view />
    </q-page-container>
`

        if (pick.footer) {
          code += `
    <q-footer ${cfg.footerReveal ? 'reveal ' : ''}${cfg.footerSep !== 'none' ? cfg.footerSep + ' ' : ''}class="bg-grey-8 text-white">
      <q-toolbar>
        <q-toolbar-title>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg">
          </q-avatar>
          <div>Title</div>
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>
`
        }

        code += `
  </q-layout>
</${'template'}>${pick.left || pick.right ? `

<${'script'}>
import { ref } from 'vue'

export default {
  setup () {${pick.left ? `
    const leftDrawerOpen = ref(false)` : ''}${pick.right ? `
    const rightDrawerOpen = ref(false)` : ''}

    return {${pick.left ? `
      leftDrawerOpen,
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      }${pick.right ? ',\n' : ''}` : ''}${pick.right ? `
      rightDrawerOpen,
      toggleRightDrawer () {
        rightDrawerOpen.value = !rightDrawerOpen.value
      }` : ''}
    }
  }
}
</${'script'}>` : ''}`

        return code
      })
    }
  }
}
</script>

<style lang="sass">
body
  background: $grey-1

.export-code
  .doc-code__inner
    max-height: 50vh
  .doc-code + div
    right: 22px !important
  .q-badge
    right: 72px !important
</style>
