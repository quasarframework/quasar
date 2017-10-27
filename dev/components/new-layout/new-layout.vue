<template>
  <q-new-layout :view="view" @scroll="onScroll">
    <q-layout-header v-model="header" :reveal="headerReveal">
      <q-toolbar>
        <q-btn flat icon="menu" />
        <q-toolbar-title>
          Header
          <span slot="subtitle">The Subtiiiitleeee</span>
        </q-toolbar-title>
        <q-btn flat icon="menu" />
      </q-toolbar>
      <q-toolbar>
        <q-btn flat icon="menu" />
        <q-toolbar-title>
          Header
          <span slot="subtitle">The Subtiiiitleeee</span>
        </q-toolbar-title>
        <q-btn flat icon="menu" />
      </q-toolbar>
      <!--
      <q-tabs>
        <q-route-tab slot="title" icon="view_quilt" to="/test-layout/about" replace hide="icon" label="About" />
        <q-route-tab slot="title" icon="view_day" to="/test-layout/toolbar" replace hide="label" label="Toolbar" />
        <q-route-tab slot="title" icon="view_day" to="/test-layout/tabs" replace label="Tabs" />
        <q-route-tab slot="title" icon="input" to="/test-layout/drawer" replace label="Drawer" />
      </q-tabs>
      -->
    </q-layout-header>

    <q-layout-footer v-model="footer" :reveal="footerReveal">
      <q-toolbar>
        <q-btn flat icon="menu" />
        <q-toolbar-title>
          Footer
        </q-toolbar-title>
        <q-btn flat icon="menu" />
      </q-toolbar>
      <q-toolbar>
        <q-btn flat icon="menu" />
        <q-toolbar-title>
          Footer
        </q-toolbar-title>
        <q-btn flat icon="menu" />
      </q-toolbar>
    </q-layout-footer>

    <q-layout-drawer v-model="left">
      <q-scroll-area style="width: 100%; height: 100%;" :thumb-style="{right: '4px', borderRadius: '2px', background: 'blue', opacity: .6, width: '4px'}">
        <div v-for="n in 60">{{n}} Left drawer</div>
      </q-scroll-area>
    </q-layout-drawer>

    <q-page-container>
      <!--
      <q-layout-drawer right-side v-model="right">
        sdsfs
        <div v-for="n in 60">{{n}} Right drawer</div>
      </q-layout-drawer>
    -->
      <q-page padding class="bg-yellow text-right">
        <q-toggle v-model="header" label="Header" /><br>
        <q-toggle v-model="footer" label="Footer" /><br>
        <q-toggle v-model="left" label="Left Drawer" /><br>
        <q-toggle v-model="right" label="Right Drawer" /><br>
        <q-toggle v-model="headerReveal" label="Header Reveal" /><br>
        <q-toggle v-model="footerReveal" label="Footer Reveal" /><br>
        <q-toggle v-model="scrolling" label="Scrolling Page" /><br>

        <div class="flex justify-center">
          <div style="width: 400px; max-width: 90vw">
            <q-card>
              <q-card-title class="text-center">
                Layout View
                <q-chip slot="subtitle" tag color="primary" style="margin-top: 15px">
                  view: {{ view }}
                </q-chip>
              </q-card-title>
              <q-card-separator />
              <q-card-main>
                <div class="doc-layout-grid row justify-center">
                  <div class="doc-row-definition row flex-center no-border">
                    Header
                  </div>
                  <div class="col column group flex-center">
                    <q-radio color="orange" v-model="topleft" val="l" label="l" />
                    <q-radio color="orange" v-model="topleft" val="h" label="h" />
                  </div>
                  <div class="col column group flex-center">
                    <q-radio v-model="topcenter" val="h" label="h" />
                    <q-radio v-model="topcenter" val="H" label="H" />
                  </div>
                  <div class="col column group flex-center">
                    <q-radio color="secondary" v-model="topright" val="r" label="r" />
                    <q-radio color="secondary" v-model="topright" val="h" label="h" />
                  </div>
                </div>

                <div class="doc-layout-grid row justify-center">
                  <div class="doc-row-definition row flex-center no-border">
                    Middle
                  </div>
                  <div class="col column group flex-center">
                    <q-radio color="orange" v-model="middleleft" val="l" label="l" />
                    <q-radio color="orange" v-model="middleleft" val="L" label="L" />
                  </div>
                  <div class="col column group flex-center">
                    <q-radio v-model="middlecenter" val="p" label="p" />
                  </div>
                  <div class="col column group flex-center">
                    <q-radio color="secondary" v-model="middleright" val="r" label="r" />
                    <q-radio color="secondary" v-model="middleright" val="R" label="R" />
                  </div>
                </div>

                <div class="doc-layout-grid row justify-center">
                  <div class="doc-row-definition row flex-center no-border">
                    Footer
                  </div>
                  <div class="col column group flex-center">
                    <q-radio color="orange" v-model="bottomleft" val="l" label="l" />
                    <q-radio color="orange" v-model="bottomleft" val="f" label="f" />
                  </div>
                  <div class="col column group flex-center">
                    <q-radio v-model="bottomcenter" val="f" label="f" />
                    <q-radio v-model="bottomcenter" val="F" label="F" />
                  </div>
                  <div class="col column group flex-center">
                    <q-radio color="secondary" v-model="bottomright" val="r" label="r" />
                    <q-radio color="secondary" v-model="bottomright" val="f" label="f" />
                  </div>
                </div>

                <div class="doc-layout-grid row justify-center">
                  <div class="doc-row-definition no-border">&nbsp;</div>
                  <div class="col no-border row justify-center">
                    Left
                  </div>
                  <div class="col no-border row justify-center">
                    Center
                  </div>
                  <div class="col no-border row justify-center">
                    Right
                  </div>
                </div>
              </q-card-main>
            </q-card>
          </div>
        </div>
        <template v-if="scrolling">
          <div v-for="n in 50">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </div>
        </template>

        <q-page-sticky position="bottom-right" :offset="[18, 18]" class="bg-black">
          <q-btn round color="primary" icon="map" />
        </q-page-sticky>
      </q-page>
    </q-page-container>
  </q-new-layout>
</template>

<script>
export default {
  data () {
    const v = 'hHh lpr fFf'
    return {
      header: true,
      footer: true,
      left: true,
      right: true,

      headerReveal: false,
      footerReveal: false,

      scrolling: true,

      topleft: v[0],
      topcenter: v[1],
      topright: v[2],
      middleleft: v[4],
      middlecenter: v[5],
      middleright: v[6],
      bottomleft: v[8],
      bottomcenter: v[9],
      bottomright: v[10]
    }
  },
  computed: {
    view () {
      const
        top = `${this.topleft}${this.topcenter}${this.topright}`,
        middle = `${this.middleleft}${this.middlecenter}${this.middleright}`,
        bottom = `${this.bottomleft}${this.bottomcenter}${this.bottomright}`

      return `${top} ${middle} ${bottom}`
    }
  },
  methods: {
    onScroll (data) {
      // console.log('scroll', data.position)
    }
  }
}
</script>
