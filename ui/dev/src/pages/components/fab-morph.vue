<template>
  <q-layout view="hHh lpr fFf">
    <q-header reveal elevated class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo/svg/quasar-logo.svg">
          </q-avatar>
          Header
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <q-page padding>
        <div class="row q-gutter-md">
          <q-select class="col" v-model="fabDirection" :options="fabDirections" label="FAB open direction" />
          <q-select class="col" v-model="fabAlign" :options="fabAligns" label="FAB align" />
          <q-toggle v-model="fabExtended" label="Extended FAB" />
          <q-toggle v-model="fabActionsExtended" label="Extended FAB action" />
        </div>
        <div v-for="i in 300" :key="i" class="q-pa-sm">
          Row {{ i }}
        </div>

        <q-page-sticky :position="stickyConfig.position" :offset="stickyConfig.offset">
          <q-fab
            :style="fabStyle"
            :direction="fabDirection"
            color="primary"
            icon="center_focus_weak"
            active-icon="center_focus_weak"
            :label="`Actions aligned ${fabAlign}`"
            :left-label="fabAlign === 'right'"
            :extended="fabExtended"
            :align="fabAlign"
          >
            <q-fab-action
              class="white"
              color="red"
              icon="center_focus_weak"
              label="Aligned left"
              :left-label="fabAlign === 'right'"
              :extended="fabActionsExtended"
              align="left"
            />
            <q-fab-action
              class="white"
              color="blue"
              icon="center_focus_weak"
              label="Aligned center"
              :left-label="fabAlign === 'right'"
              :extended="fabActionsExtended"
              align="center"
            />
            <q-fab-action
              class="white"
              color="deep-orange"
              icon="center_focus_weak"
              label="Aligned right"
              :left-label="fabAlign !== 'right'"
              :extended="fabActionsExtended"
              align="right"
            />
            <q-fab-action
              class="white"
              color="green"
              icon="center_focus_weak"
              label="Aligned default"
              :left-label="fabAlign !== 'right'"
              :extended="fabActionsExtended"
            />
            <q-fab-action
              class="white"
              color="purple"
              icon="center_focus_weak"
              label="Aligned default"
              :left-label="fabAlign === 'right'"
              :extended="fabActionsExtended"
            />
            <q-fab-action
              class="white"
              color="blue"
              icon="center_focus_weak"
              align="left"
            />
            <q-fab-action
              class="white"
              color="deep-orange"
              icon="center_focus_weak"
              align="right"
            />
            <q-fab-action
              class="white"
              color="red"
              icon="center_focus_weak"
              align="center"
            />
            <q-fab-action
              class="white"
              color="green"
              icon="center_focus_weak"
            />
          </q-fab>
        </q-page-sticky>
      </q-page>
    </q-page-container>

    <q-footer reveal elevated class="bg-grey-8 text-white">
      <q-toolbar>
        <q-toolbar-title>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo/svg/quasar-logo.svg">
          </q-avatar>
          Footer
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script>
export default {
  data () {
    return {
      fabDirection: 'up',
      fabAlign: 'center',
      fabExtended: false,
      fabActionsExtended: false,

      fabDirections: [ 'up', 'right', 'down', 'left' ],
      fabAligns: [ 'left', 'center', 'right' ]
    }
  },

  computed: {
    stickyConfig () {
      if (this.fabDirection === 'up') {
        return {
          position: 'bottom' + (this.fabAlign === 'center' ? '' : '-' + this.fabAlign),
          offset: [ this.fabAlign === 'center' ? 0 : 18, 18 ]
        }
      }

      if (this.fabDirection === 'down') {
        return {
          position: 'top' + (this.fabAlign === 'center' ? '' : '-' + this.fabAlign),
          offset: [ this.fabAlign === 'center' ? 0 : 18, 18 ]
        }
      }

      if (this.fabDirection === 'left') {
        return {
          position: 'right',
          offset: [ 18, 0 ]
        }
      }

      return {
        position: 'left',
        offset: [ 18, 0 ]
      }
    },

    fabStyle () {
      if (this.fabExtended === true && this.fabAlign === 'center') {
        return {
          minWidth: '350px'
        }
      }
    }
  },

  methods: {
    logEvt (evt) {
      console.log(`@${evt.type}`, evt)
    }
  }
}
</script>
