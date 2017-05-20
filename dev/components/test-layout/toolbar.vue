<template>
  <div>
    <div class="layout-padding">
      <q-option-group v-model="sel" :options="[
        {label: 'A', value: 'a'}, {label: 'B', value: 'b'}, {label: 'C', value: 'c'},
        {label: 'Bogus', value: 'bogus'}
      ]" />

      <span v-if="sel === 'a'" v-move="'#gigi'" tag="span">
        Toolbar A dddX
      </span>
      <span v-else-if="sel === 'b'" v-move="'#gigi'" tag="span">
        Toolbar B
      </span>

      <p class="caption">
        Toolbars are mainly used in Layout headers and footers, but they can be used
        in your Page view too.
      </p>

      <q-toolbar>
        <q-btn flat>
          <q-icon name="menu" />
        </q-btn>
        <div class="q-toolbar-title">
          Toolbar
        </div>
        <q-btn flat>
          <q-icon name="more_vert" />
        </q-btn>
      </q-toolbar>

      <br>

      <q-toolbar inverted>
        <q-btn flat>
          <q-icon name="menu" />
        </q-btn>
        <div class="q-toolbar-title">
          Toolbar
        </div>
        <q-btn flat>
          <q-icon name="more_vert" />
        </q-btn>
      </q-toolbar>

      <p class="caption">
        They come in all colors.
      </p>

      <q-toolbar color="secondary">
        <q-btn flat><q-icon name="assignment_ind" /></q-btn>
        <div class="q-toolbar-title">
          Toolbar
        </div>
        <q-btn flat><q-icon name="sim_card" /></q-btn>
        <q-btn flat><q-icon name="gamepad" /></q-btn>
      </q-toolbar>
      <q-toolbar color="orange">
        <q-btn flat><q-icon name="mail" /></q-btn>
        <div class="q-toolbar-title">
          Long title for Toolbar. Very very very very very very long title.
        </div>
        <q-btn flat><q-icon name="alarm" /></q-btn>
        <q-btn flat><q-icon name="router" /></q-btn>
        <q-btn flat><q-icon name="keyboard" /></q-btn>
      </q-toolbar>
      <q-toolbar color="dark">
        <q-btn flat><q-icon name="menu" /></q-btn>
        <q-btn flat><q-icon name="security" /></q-btn>
        <div class="q-toolbar-title">
          Toolbar
        </div>
        <q-btn flat><q-icon name="headset" /></q-btn>
        <q-btn flat><q-icon name="tv" /></q-btn>
      </q-toolbar>

      <p class="caption">
        And inverted:
      </p>

      <q-toolbar inverted color="secondary">
        <q-btn flat><q-icon name="assignment_ind" /></q-btn>
        <div class="q-toolbar-title">
          Toolbar
        </div>
        <q-btn flat><q-icon name="sim_card" /></q-btn>
        <q-btn flat><q-icon name="gamepad" /></q-btn>
      </q-toolbar>
      <q-toolbar inverted color="orange">
        <q-btn flat><q-icon name="mail" /></q-btn>
        <div class="q-toolbar-title">
          Long title for Toolbar. Very very very very very very long title.
        </div>
        <q-btn flat><q-icon name="alarm" /></q-btn>
        <q-btn flat><q-icon name="router" /></q-btn>
        <q-btn flat><q-icon name="keyboard" /></q-btn>
      </q-toolbar>
      <q-toolbar inverted color="dark">
        <q-btn flat><q-icon name="menu" /></q-btn>
        <q-btn flat><q-icon name="security" /></q-btn>
        <div class="q-toolbar-title">
          Toolbar
        </div>
        <q-btn flat><q-icon name="headset" /></q-btn>
        <q-btn flat><q-icon name="tv" /></q-btn>
      </q-toolbar>
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
