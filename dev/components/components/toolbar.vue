<template>
  <div class="layout-padding row justify-center">
    <div style="width: 500px; max-width: 90vw;">
      <p class="caption">
        Toolbars are mainly used in Layout headers and footers, but they can be used
        in your Page view too.
      </p>

      <q-toolbar>
        <q-btn flat round dense>
          <q-icon name="menu" />
        </q-btn>
        <q-toolbar-title>
          Toolbar
        </q-toolbar-title>
        <q-btn flat round dense>
          <q-icon name="more_vert" />
        </q-btn>
      </q-toolbar>

      <br>

      <q-toolbar inverted>
        <q-btn flat round dense icon="menu" />
        <q-toolbar-title>
          Toolbar
        </q-toolbar-title>
        <q-btn flat round dense icon="more_vert" />
      </q-toolbar>

      <p class="caption">
        They come in all colors.
      </p>

      <q-toolbar color="secondary">
        <q-btn flat round dense icon="assignment_ind" />
        <q-toolbar-title>
          Toolbar
        </q-toolbar-title>
        <q-btn flat round dense icon="sim_card" />
        <q-btn flat round dense icon="gamepad" />
      </q-toolbar>
      <q-toolbar color="yellow" class="text-dark">
        <q-btn flat round dense icon="assignment_ind" />
        <q-toolbar-title>
          Toolbar
          <span slot="subtitle">Subtitle</span>
        </q-toolbar-title>
        <q-btn flat round dense icon="sim_card" />
        <q-btn flat round dense icon="gamepad" />
      </q-toolbar>
      <q-toolbar color="orange">
        <q-btn flat round dense icon="mail" />
        <q-toolbar-title>
          Long title for Toolbar. Very very very very very very long title.
        </q-toolbar-title>
        <q-btn flat round dense icon="alarm" />
        <q-btn flat round dense icon="router" />
        <q-btn flat round dense icon="keyboard" />
      </q-toolbar>
      <q-toolbar color="dark">
        <q-btn flat round dense icon="menu" />
        <q-btn flat round dense icon="security" />
        <q-toolbar-title>
          Toolbar
        </q-toolbar-title>
        <q-btn flat round dense icon="headset" />
        <q-btn flat round dense icon="tv" />
      </q-toolbar>

      <p class="caption">
        And inverted:
      </p>

      <q-toolbar inverted color="secondary">
        <q-btn flat round dense icon="assignment_ind" />
        <q-toolbar-title>
          Toolbar
        </q-toolbar-title>
        <q-btn flat round dense icon="sim_card" />
        <q-btn flat round dense icon="gamepad" />
      </q-toolbar>
      <q-toolbar inverted color="purple">
        <q-btn flat round dense icon="assignment_ind" />
        <q-toolbar-title>
          Toolbar
          <span slot="subtitle">Subtitle</span>
        </q-toolbar-title>
        <q-btn flat round dense icon="sim_card" />
        <q-btn flat round dense icon="gamepad" />
      </q-toolbar>
      <q-toolbar inverted color="orange">
        <q-btn flat round dense icon="mail" />
        <q-toolbar-title>
          Long title for Toolbar. Very very very very very very long title.
        </q-toolbar-title>
        <q-btn flat round dense icon="alarm" />
        <q-btn flat round dense icon="router" />
        <q-btn flat round dense icon="keyboard" />
      </q-toolbar>
      <q-toolbar inverted color="dark">
        <q-btn flat round dense icon="menu" />
        <q-btn flat round dense icon="security" />
        <q-toolbar-title>
          Toolbar
        </q-toolbar-title>
        <q-btn flat round dense icon="headset" />
        <q-btn flat round dense icon="tv" />
      </q-toolbar>
    </div>
  </div>
</template>
