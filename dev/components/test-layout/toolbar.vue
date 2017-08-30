<template>
  <div class="layout-padding">
    <p class="caption">
      Toolbars are mainly used in Layout headers and footers, but they can be used
      in your Page view too.
    </p>

    <q-toolbar>
      <q-btn flat icon="menu" />
      <q-toolbar-title>
        Toolbar
      </q-toolbar-title>
      <q-btn flat icon="more_vert" />
    </q-toolbar>

    <br>

    <q-toolbar inverted>
      <q-btn flat icon="menu" />
      <q-toolbar-title>
        Toolbar
      </q-toolbar-title>
      <q-btn flat icon="more_vert" />
    </q-toolbar>

    <p class="caption">
      They come in all colors.
    </p>

    <q-toolbar color="secondary">
      <q-btn flat icon="assignment_ind" />
      <q-toolbar-title>
        Toolbar
      </q-toolbar-title>
      <q-btn flat icon="sim_card" />
      <q-btn flat icon="gamepad" />
    </q-toolbar>
    <q-toolbar color="yellow" class="text-dark">
      <q-btn flat icon="assignment_ind" />
      <q-toolbar-title>
        Toolbar
        <span slot="subtitle">Subtitle</span>
      </q-toolbar-title>
      <q-btn flat icon="sim_card" />
      <q-btn flat icon="gamepad" />
    </q-toolbar>
    <q-toolbar color="orange">
      <q-btn flat icon="mail" />
      <q-toolbar-title>
        Long title for Toolbar. Very very very very very very long title.
      </q-toolbar-title>
      <q-btn flat icon="alarm" />
      <q-btn flat icon="router" />
      <q-btn flat icon="keyboard" />
    </q-toolbar>
    <q-toolbar color="dark">
      <q-btn flat icon="menu" />
      <q-btn flat icon="security" />
      <q-toolbar-title>
        Toolbar
      </q-toolbar-title>
      <q-btn flat icon="headset" />
      <q-btn flat icon="tv" />
    </q-toolbar>

    <p class="caption">
      And inverted:
    </p>

    <q-toolbar inverted color="secondary">
      <q-btn flat icon="assignment_ind" />
      <q-toolbar-title>
        Toolbar
      </q-toolbar-title>
      <q-btn flat icon="sim_card" />
      <q-btn flat icon="gamepad" />
    </q-toolbar>
    <q-toolbar inverted color="grey">
      <q-btn flat icon="assignment_ind" />
      <q-toolbar-title>
        Toolbar
        <span slot="subtitle">Subtitle</span>
      </q-toolbar-title>
      <q-btn flat icon="sim_card" />
      <q-btn flat icon="gamepad" />
    </q-toolbar>
    <q-toolbar inverted color="orange">
      <q-btn flat icon="mail" />
      <q-toolbar-title>
        Long title for Toolbar. Very very very very very very long title.
      </q-toolbar-title>
      <q-btn flat icon="alarm" />
      <q-btn flat icon="router" />
      <q-btn flat icon="keyboard" />
    </q-toolbar>
    <q-toolbar inverted color="dark">
      <q-btn flat icon="menu" />
      <q-btn flat icon="security" />
      <q-toolbar-title>
        Toolbar
      </q-toolbar-title>
      <q-btn flat icon="headset" />
      <q-btn flat icon="tv" />
    </q-toolbar>
  </div>
</template>
