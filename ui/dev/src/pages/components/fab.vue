<template>
  <div>
    <div class="q-layout-padding">
      <div class="z-max fixed-top-left">
        <q-toggle v-model="toggleDisabled" />
        <q-toggle v-model="toggle" />
      </div>

      <p class="caption">
        <span class="desktop-only">Click</span>
        <span class="mobile-only">Tap</span>
        on each inline FABs below.
        The one that opens on the right also has a backdrop.
      </p>

      <div class="column items-center" style="margin-top: 100px; margin-bottom: 100px;">
        <q-fab padding="xs xl" v-model="toggle" color="purple" direction="up">
          <q-fab-action color="amber" to="/" @click="notify('alarm')" icon="alarm" />
          <q-fab-action color="amber" @click="notify('alarm')" icon="alarm" />
          <q-fab-action color="amber" @click="notify('alarm')" :icon="mdiMenu" />
        </q-fab>

        <br>

        <q-fab v-model="toggleDisabled" :icon="mdiMenu" direction="left" disable>
          <q-fab-action color="primary" @click="notify('mail')" icon="mail" />
          <q-fab-action color="primary" @click="notify('alarm')" icon="alarm" />
          <q-fab-action color="primary" @click="notify('alarm')" icon="alarm" />
        </q-fab>

        <br>

        <q-fab :model-value="toggle" color="secondary" push :icon="mdiMenu" direction="right">
          <q-fab-action color="primary" @click="notify('mail')" icon="ion-aperture" disable />
          <q-fab-action color="primary" @click="notify('alarm')" icon="mdi-map" />
          <q-fab-action color="primary" @click="notify('alarm')" icon="fas fa-address-book" />
          <q-fab-action color="primary" @click="notify('alarm')" icon="ti-tablet" />
          <q-fab-action color="primary" @click="notify('alarm')" icon="eva-attach-outline" />
        </q-fab>

        <br>

        <q-fab color="accent" glossy icon="keyboard_arrow_down" direction="down">
          <q-fab-action color="amber" @click="notify('mail')" icon="mail" />
          <q-fab-action color="amber" @click="notify('alarm')" icon="alarm" />
        </q-fab>
      </div>

      <p class="caption" style="margin-bottom: 100px;">
        There's also the absolute positioned one on bottom
        right of screen which maintains position on Page scroll.
        It has a click/tap event injected on itself when expanded.
      </p>

      <q-fab
        class="fixed-bottom-right"
        style="right: 18px; bottom: 86px;"
        icon="fas fa-address-book"
        direction="up"
        color="primary"
        @show="openFab"
        @hide="closeFab"
      >
        <q-fab-action color="blue" class="white" icon="person_add">
          <q-tooltip ref="tooltip1" anchor="center left" self="center right" :offset="[20, 0]">
            Add a person
          </q-tooltip>
        </q-fab-action>
        <q-fab-action color="blue" class="white" icon="group_add">
          <q-tooltip ref="tooltip2" anchor="center left" self="center right" :offset="[20, 0]">
            Add a group
          </q-tooltip>
        </q-fab-action>
      </q-fab>

      <div style="height: 1000px">
&nbsp;
      </div>

      <div class="q-gutter-lg">
        <q-btn fab :icon="mdiMenu" />
        <q-btn fab-mini :icon="mdiMenu" />

        <q-btn fab icon="menu" />
        <q-btn fab-mini icon="menu" />
      </div>

      <q-fab
        color="primary"
        direction="up"
        class="fixed-bottom-right"
        :icon="mdiMenu"
        style="right: 18px; bottom: 18px;"
      >
        <template v-slot:tooltip>
          <q-tooltip ref="tooltip0" anchor="center left" self="center right" :offset="[20, 0]">
            Tooltip in FAB
          </q-tooltip>
        </template>

        <q-fab-action color="purple" @click="notify('mail')" icon="mail">
          <q-tooltip anchor="center left" self="center right" :offset="[20, 0]">
            Mail
          </q-tooltip>
        </q-fab-action>
        <q-fab-action color="secondary" @click="notify('alarm')" icon="alarm">
          <q-tooltip anchor="center left" self="center right" :offset="[20, 0]">
            Alarm
          </q-tooltip>
        </q-fab-action>
      </q-fab>
    </div>
  </div>
</template>

<script>
import { mdiMenu } from '@quasar/extras/mdi-v4'

export default {
  created () {
    this.mdiMenu = mdiMenu
  },

  data () {
    return {
      toggle: true,
      toggleDisabled: true
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
