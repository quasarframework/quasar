<template>
  <div>
    <div class="layout-padding">
      <q-input-group v-model="sel" :options="[
        {label: 'A', value: 'a'}, {label: 'B', value: 'b'}, {label: 'C', value: 'c'},
        {label: 'Bogus', value: 'bogus'}
      ]" />

      <span v-if="sel === 'a'" v-move="'#gigi'" tag="span">
        Toolbar A dddX
      </span>
      <span v-else-if="sel === 'b'" v-move="'#gigi'" tag="span">
        Toolbar B
      </span>
      <!--
      <span v-else-if="sel === 'c'" v-move="'#gigi'" tag="span">
        Toolbar C ggg <span class="bg-yellow">Vivi</span>
      </span>
      -->

      <p class="caption">
        Toolbars are mainly used in Layout headers and footers, but they can be used
        in your Page view too.
      </p>

      <div class="q-toolbar">
        <q-btn class="left-drawer-opener">
          <q-icon name="menu" />
        </q-btn>
        <div class="q-toolbar-title">
          Toolbar
        </div>
        <q-btn class="right-drawer-opener">
          <q-icon name="more_vert" />
        </q-btn>
      </div>

      <p class="caption">
        They come in all colors.
      </p>

      <!--
      <q-move selector="#gogu" tag="span">
        Gogu
      </q-move>
      -->

      <div class="q-toolbar bg-secondary">
        <q-btn><q-icon name="assignment_ind" /></q-btn>
        <div class="q-toolbar-title">
          Toolbar
        </div>
        <q-btn><q-icon name="sim_card" /></q-btn>
        <q-btn><q-icon name="gamepad" /></q-btn>
      </div>
      <div class="q-toolbar bg-orange">
        <q-btn><q-icon name="mail" /></q-btn>
        <div class="q-toolbar-title">
          Long title for Toolbar. Very very very very very very long title.
        </div>
        <q-btn><q-icon name="alarm" /></q-btn>
        <q-btn><q-icon name="router" /></q-btn>
        <q-btn><q-icon name="keyboard" /></q-btn>
      </div>
      <div class="q-toolbar bg-dark">
        <q-btn><q-icon name="menu" /></q-btn>
        <q-btn><q-icon name="security" /></q-btn>
        <div class="q-toolbar-title">
          Toolbar
        </div>
        <q-btn><q-icon name="headset" /></q-btn>
        <q-btn><q-icon name="tv" /></q-btn>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      sel: 'a'
    }
  }
}
</script>
