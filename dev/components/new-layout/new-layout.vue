<template>
  <div>
  <q-layout :view="view" @scroll="onScroll">
    <q-layout-header v-model="header" :reveal="headerReveal">
      <q-toolbar>
        <q-btn flat icon="menu" @click="left = !left" />
        <q-toolbar-title>
          Header
          <span slot="subtitle">The Subtiiiitleeee</span>
        </q-toolbar-title>
        <q-btn flat icon="menu" @click="right = !right" />
      </q-toolbar>
      <q-toolbar>
        <q-btn flat icon="menu" @click="left = !left" />
        <q-toolbar-title>
          Header
          <span slot="subtitle">The Subtiiiitleeee</span>
        </q-toolbar-title>
        <q-btn flat icon="menu" @click="right = !right" />
      </q-toolbar>
      <q-tabs>
        <q-route-tab slot="title" icon="view_quilt" to="/layout-quick/default" replace hide="icon" label="Default" />
        <q-route-tab slot="title" icon="view_day" to="/layout-quick/a" replace hide="label" label="A" />
        <q-route-tab slot="title" icon="view_day" to="/layout-quick/b" replace label="B" />
        <q-route-tab slot="title" icon="input" to="/layout-quick/c" replace label="C" />
      </q-tabs>
    </q-layout-header>

    <q-layout-footer v-model="footer" :reveal="footerReveal">
      <q-toolbar>
        <q-btn flat icon="menu" @click="left = !left" />
        <q-toolbar-title>
          Footer
        </q-toolbar-title>
        <q-btn flat icon="menu" @click="right = !right" />
      </q-toolbar>
      <q-toolbar>
        <q-btn flat icon="menu" @click="left = !left" />
        <q-toolbar-title>
          Footer
        </q-toolbar-title>
        <q-btn flat icon="menu" @click="right = !right" />
      </q-toolbar>
    </q-layout-footer>

    <q-layout-drawer v-model="left" :overlay="leftOverlay" :behavior="leftBehavior" :breakpoint="leftBreakpoint">
      <q-scroll-area class="fit bg-green-3 q-pa-sm" :thumb-style="{right: '4px', borderRadius: '2px', background: 'blue', opacity: .6, width: '4px'}">
        <q-btn @click="$router.push('/layout-quick/a')">Go to A</q-btn>
        <q-btn @click="$router.push('/layout-quick/b')">Go to B</q-btn>
        <q-btn @click="$router.push('/layout-quick/c')">Go to C</q-btn>

        <br><br>

        <q-btn @click="$router.replace('/layout-quick/a')">Replace Go to A</q-btn>
        <q-btn @click="$router.replace('/layout-quick/b')">Replace Go to B</q-btn>
        <q-btn @click="$router.replace('/layout-quick/c')">Replace Go to C</q-btn>
        <div v-for="n in 60" :key="n">{{n}} Left drawer</div>
      </q-scroll-area>
    </q-layout-drawer>

    <q-page-container>
      <q-layout-drawer right-side v-model="right" :overlay="rightOverlay" :behavior="rightBehavior" :breakpoint="rightBreakpoint">
        <div class="fit-min bg-orange-3 q-pa-sm">
          <q-btn @click="$router.push('/layout-quick/a')">Go to A</q-btn>
          <q-btn @click="$router.push('/layout-quick/b')">Go to B</q-btn>
          <q-btn @click="$router.push('/layout-quick/c')">Go to C</q-btn>

          <br><br>

          <q-btn @click="$router.replace('/layout-quick/a')">Replace Go to A</q-btn>
          <q-btn @click="$router.replace('/layout-quick/b')">Replace Go to B</q-btn>
          <q-btn @click="$router.replace('/layout-quick/c')">Replace Go to C</q-btn>
          <div v-for="n in 60" :key="n">{{n}} Right drawer</div>
        </div>
      </q-layout-drawer>

      <q-transition enter="fadeIn" leave="fadeOut" mode="out-in">
        <router-view />
      </q-transition>
    </q-page-container>
  </q-layout>

  <div class="fixed-center bg-amber z-fullscreen">
    <div class="row no-wrap">
      <div class="col xs-gutter q-ma-xs">
        <div>
          <q-toggle v-model="header" label="Header" />
        </div>
        <div>
          <q-toggle v-model="headerReveal" label="Header Reveal" />
        </div>
        <div class="q-mt-sm">
          <q-toggle v-model="left" label="Left Drawer" />
        </div>
        <div>
          <q-toggle v-model="leftOverlay" label="Left as Overlay" />
        </div>
        <div>
          <q-select v-model="leftBehavior" :options="drawerBehaviorOptions" class="no-margin" />
        </div>
        <div>
          <q-input type="number" align="right" prefix="Bkpt" placeholder="Bkpt" v-model="leftBreakpoint" class="no-margin" />
        </div>
      </div>
      <div class="col xs-gutter q-ma-xs">
        <div>
          <q-toggle v-model="footer" label="Footer" />
        </div>
        <div>
          <q-toggle v-model="footerReveal" label="Footer Reveal" />
        </div>
        <div class="q-mt-sm">
          <q-toggle v-model="right" label="Right Drawer" />
        </div>
        <div>
          <q-toggle v-model="rightOverlay" label="Right as Overlay" />
        </div>
        <div>
          <q-select v-model="rightBehavior" :options="drawerBehaviorOptions" class="no-margin" />
        </div>
        <div>
          <q-input type="number" align="right" prefix="Bkpt" placeholder="Bkpt" v-model="rightBreakpoint" class="no-margin" />
        </div>
      </div>
    </div>

    <div class="row justify-center q-mt-big">
      <q-chip color="primary">
        view: {{ view }}
      </q-chip>
    </div>
    <div class="flex justify-center">
      <div style="min-width: 400px; max-width: 90vw">
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
        <q-card-separator />

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
        <q-card-separator />

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
      </div>
    </div>
  </div>
</div>
</template>

<style lang="stylus">
  .fit-min
    min-width 100%
    min-height 100%
</style>

<script>
export default {
  data () {
    const v = 'lHh Lpr fFf'
    return {
      header: true,
      footer: true,
      left: true,
      right: true,

      headerReveal: false,
      footerReveal: false,
      leftOverlay: true,
      rightOverlay: true,
      leftBehavior: 'default',
      rightBehavior: 'default',
      leftBreakpoint: 992,
      rightBreakpoint: 992,

      scrolling: true,

      topleft: v[0],
      topcenter: v[1],
      topright: v[2],
      middleleft: v[4],
      middlecenter: v[5],
      middleright: v[6],
      bottomleft: v[8],
      bottomcenter: v[9],
      bottomright: v[10],
      drawerBehaviorOptions: [
        { label: 'Behave Normal', value: 'default' },
        { label: 'Behave Mobile', value: 'mobile' },
        { label: 'Behave Desktop', value: 'desktop' }
      ]
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
