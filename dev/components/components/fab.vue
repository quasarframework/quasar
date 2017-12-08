<template>
  <div>
    <div class="layout-padding">
      <p class="caption">
        <span class="desktop-only">Click</span>
        <span class="mobile-only">Tap</span>
        on each inline FABs below.
        The one that opens on the right also has a backdrop.
      </p>

      <div class="column items-center" style="margin-top: 100px; margin-bottom: 100px;">
        <q-fab color="purple" icon="keyboard_arrow_up" direction="up">
          <q-fab-action @click="notify('mail')" icon="mail" />
          <q-fab-action @click="notify('alarm')" icon="alarm" />
          <q-fab-action @click="notify('alarm')" icon="alarm" />
          <q-fab-action @click="notify('alarm')" icon="alarm" />
          <q-fab-action @click="notify('alarm')" icon="alarm" />
        </q-fab>

        <br>

        <q-toggle v-model="toggle" class="z-max fixed-top" />
        <q-fab v-model="toggle" icon="keyboard_arrow_left" direction="left">
          <q-fab-action @click="notify('mail')" icon="mail" />
          <q-fab-action @click="notify('alarm')" icon="alarm" />
          <q-fab-action @click="notify('alarm')" icon="alarm" />
          <q-fab-action @click="notify('alarm')" icon="alarm" />
          <q-fab-action @click="notify('alarm')" icon="alarm" />
          <q-fab-action @click="notify('alarm')" icon="alarm" />
        </q-fab>

        <br>

        <q-fab color="secondary" push icon="keyboard_arrow_right" direction="right">
          <q-fab-action color="primary" @click="notify('mail')" icon="mail" />
          <q-fab-action @click="notify('alarm')" icon="alarm" />
          <q-fab-action @click="notify('alarm')" icon="alarm" />
          <q-fab-action @click="notify('alarm')" icon="alarm" />
          <q-fab-action @click="notify('alarm')" icon="alarm" />
          <q-fab-action @click="notify('alarm')" icon="alarm" />
        </q-fab>

        <br>

        <q-fab color="tertiary" glossy icon="keyboard_arrow_down" direction="down">
          <q-fab-action color="amber" @click="notify('mail')" icon="mail" />
          <q-fab-action color="amber" @click="notify('alarm')" icon="alarm" />
          <q-fab-action color="amber" @click="notify('alarm')" icon="alarm" />
          <q-fab-action color="amber" @click="notify('alarm')" icon="alarm" />
          <q-fab-action color="amber" @click="notify('alarm')" icon="alarm" />
          <q-fab-action color="amber" @click="notify('alarm')" icon="alarm" />
        </q-fab>
      </div>

      <p class="caption" style="margin-bottom: 100px;">
        There's also the absolute positioned one on bottom
        right of screen which maintains position on Page scroll.
        It has a click/tap event injected on itself when expanded.
        You can close it by clicking/tapping on the whitey backdrop.
      </p>

      <q-fab
        class="fixed-bottom-right"
        style="right: 18px; bottom: 86px;"
        icon="add"
        direction="up"
        color="primary"
        @show="openFab"
        @hide="closeFab"
      >
        <q-fab-action color="blue" class="white" icon="person add">
          <q-tooltip ref="tooltip1" anchor="center left" self="center right" :offset="[20, 0]">Add a person</q-tooltip>
        </q-fab-action>
        <q-fab-action color="blue" class="white" icon="group add">
          <q-tooltip ref="tooltip2" anchor="center left" self="center right" :offset="[20, 0]">Add a group</q-tooltip>
        </q-fab-action>
      </q-fab>

      <div style="height: 1000px">&nbsp;</div>

      <q-fab
        color="primary"
        active-icon="alarm"
        direction="up"
        class="fixed-bottom-right"
        style="right: 18px; bottom: 18px;"
      >
        <q-tooltip ref="tooltip0" slot="tooltip" anchor="center left" self="center right" :offset="[20, 0]">Tooltip in FAB</q-tooltip>
        <q-fab-action color="purple" @click="notify('mail')" icon="mail">
          <q-tooltip anchor="center left" self="center right" :offset="[20, 0]">Mail</q-tooltip>
        </q-fab-action>
        <q-fab-action color="secondary" @click="notify('alarm')" icon="alarm">
          <q-tooltip anchor="center left" self="center right" :offset="[20, 0]">Alarm</q-tooltip>
        </q-fab-action>
      </q-fab>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      toggle: false
    }
  },
  methods: {
    alert () {
      this.$q.dialog({
        title: 'FAB',
        message: 'Good job! Keep it going.'
      })
    },
    notify (icon) {
      this.$q.notify({
        icon,
        message: 'So you want your ' + icon + 's, huh?'
      })
    },
    openFab () {
      setTimeout(() => {
        this.$refs.tooltip1.show()
        this.$refs.tooltip2.show()
      }, 300)
    },
    closeFab () {
      this.$refs.tooltip1.hide()
      this.$refs.tooltip2.hide()
    }
  }
}
</script>
