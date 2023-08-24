<template>
  <div class="q-layout-padding">
    <q-toggle v-model="noMiniAnimation">
      No mini animation
    </q-toggle>
    <q-toggle v-model="miniToOverlay">
      Mini to overlay
    </q-toggle>

    <q-layout view="hHh lpr fFf" container :style="containerStyle" class="q-mt-xl shadow-2">
      <q-header class="bg-black">
        <q-toolbar>
          <q-btn flat @click="miniState = !miniState" round dense icon="menu" />
          <q-toolbar-title>Header</q-toolbar-title>
        </q-toolbar>
      </q-header>

      <q-drawer
        side="left"
        :model-value="true"
        :mini="miniState"
        :mini-to-overlay="miniToOverlay"
        :width="200"
        :no-mini-animation="noMiniAnimation"
        :breakpoint="0"
        bordered
      >
      <q-scroll-area class="fit" :horizontal-thumb-style="{ opacity: 0 }">
          <q-list padding>
            <q-item clickable v-ripple>
              <q-item-section avatar>
                <q-icon name="inbox" />
              </q-item-section>

              <q-item-section>
                Inbox
              </q-item-section>
            </q-item>

            <q-item active clickable v-ripple>
              <q-item-section avatar>
                <q-icon name="star" />
              </q-item-section>

              <q-item-section>
                Star
              </q-item-section>
            </q-item>

            <q-item clickable v-ripple>
              <q-item-section avatar>
                <q-icon name="send" />
              </q-item-section>

              <q-item-section>
                Send
              </q-item-section>
            </q-item>

            <q-item clickable v-ripple>
              <q-item-section avatar>
                <q-icon name="drafts" />
              </q-item-section>

              <q-item-section>
                Drafts
              </q-item-section>
            </q-item>
          </q-list>
        </q-scroll-area>
      </q-drawer>

      <q-page-container>
        <q-page padding>
          <div v-for="n in contentSize" :key="n">
            My page My page My page My page My page My page
            My page My page My page My page My page My page {{ n }} / {{ contentSize }}
          </div>
        </q-page>
      </q-page-container>
    </q-layout>
  </div>
</template>

<script>
export default {
  data () {
    return {
      miniState: true,
      miniToOverlay: true,
      width: 1030,
      contentSize: 30,
      noMiniAnimation: false
    }
  },

  computed: {
    containerStyle () {
      return {
        height: '800px',
        width: this.width + 'px'
      }
    }
  }
}
</script>
