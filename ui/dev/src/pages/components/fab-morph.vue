<template>
  <q-layout view="hHh lpr fFf">
    <q-header elevated>
      <q-toolbar class="q-gutter-md justify-around">
        <q-avatar>
          <img src="https://cdn.quasar.dev/logo/svg/quasar-logo.svg">
        </q-avatar>
        <q-select dark color="yellow" borderless square v-model="fabDirection" :options="fabDirections" label="FAB open direction" style="min-width: 150px" />
        <q-select dark color="yellow" borderless square v-model="fabAlign" :options="fabAligns" label="FAB align" style="min-width: 150px" />
        <q-toggle dark color="yellow" v-model="fabExtended" label="Extended FAB" />
        <q-toggle dark color="yellow" v-model="fabActionsExtended" label="Extended Actions" />
        <q-toggle dark color="yellow" v-model="fabLeftLabel" label="Left label" />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <q-page padding>

        <div v-for="i in 300" :key="i" class="q-pa-sm">
          Row {{ i }}
        </div>

        <q-page-sticky :position="stickyConfig.position" :offset="stickyConfig.offset">
          <q-fab
            :direction="fabDirection"
            color="primary"
            icon="center_focus_weak"
            active-icon="center_focus_weak"
            :label="`Actions aligned ${fabAlign}`"
            :left-label="fabLeftLabel"
            :extended="fabExtended"
            :actions-vertical-align="fabAlign"
          >
            <q-fab-action
              class="white"
              color="red"
              icon="center_focus_weak"
              label="Left"
              :left-label="fabLeftLabel"
              :extended="fabActionsExtended"
              vertical-align="left"
            />
            <q-fab-action
              class="white"
              color="blue"
              icon="center_focus_weak"
              label="Center"
              :left-label="fabLeftLabel"
              :extended="fabActionsExtended"
              vertical-align="center"
            />
            <q-fab-action
              class="white"
              color="deep-orange"
              icon="center_focus_weak"
              label="Right"
              :left-label="fabLeftLabel"
              :extended="fabActionsExtended"
              vertical-align="right"
            />
            <q-fab-action
              class="white"
              color="green"
              icon="center_focus_weak"
              label="Default"
              :left-label="fabLeftLabel"
              :extended="fabActionsExtended"
            />
            <q-fab-action
              class="white"
              color="purple"
              icon="center_focus_weak"
              label="Default"
              :left-label="fabLeftLabel"
              :extended="fabActionsExtended"
            />
            <q-fab-action
              class="white"
              color="blue"
              icon="center_focus_weak"
              vertical-align="left"
            />
            <q-fab-action
              class="white"
              color="deep-orange"
              icon="center_focus_weak"
              vertical-align="right"
            />
            <q-fab-action
              class="white"
              color="red"
              icon="center_focus_weak"
              vertical-align="center"
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
      fabLeftLabel: false,

      fabDirections: [ 'up', 'right', 'down', 'left' ],
      fabAligns: [ 'left', 'center', 'right' ]
    }
  },

  computed: {
    stickyConfig () {
      if (this.fabDirection === 'up') {
        return {
          position: 'bottom',
          offset: [ this.fabAlign === 'center' ? 0 : 18, 18 ]
        }
      }

      if (this.fabDirection === 'down') {
        return {
          position: 'top',
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
    }
  },

  methods: {
    logEvt (evt) {
      console.log(`@${evt.type}`, evt)
    }
  }
}
</script>
