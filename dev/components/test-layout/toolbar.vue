<template>
  <div>
    <div class="layout-padding">
      <p class="caption">
        Toolbars are mainly used in Layout headers and footers, but they can be used
        in your Page view too.
      </p>

      <div class="toolbar">
        <q-btn class="left-drawer-opener">
          <q-icon name="menu" />
        </q-btn>
        <q-toolbar-title :padding="1">
          Toolbar
        </q-toolbar-title>
        <q-btn class="right-drawer-opener">
          <q-icon name="more_vert" />
        </q-btn>
      </div>

      <p class="caption">
        They come in all colors.
      </p>

      <div class="toolbar secondary">
        <q-btn><q-icon name="assignment_ind" /></q-btn>
        <q-toolbar-title :padding="2">
          Toolbar
        </q-toolbar-title>
        <q-btn><q-icon name="sim_card" /></q-btn>
        <q-btn><q-icon name="gamepad" /></q-btn>
      </div>
      <div class="toolbar orange">
        <q-btn><q-icon name="mail" /></q-btn>
        <q-toolbar-title :padding="3">
          Long title for Toolbar. Very very very very very very long title.
        </q-toolbar-title>
        <q-btn><q-icon name="alarm" /></q-btn>
        <q-btn><q-icon name="router" /></q-btn>
        <q-btn><q-icon name="keyboard" /></q-btn>
      </div>
      <div class="toolbar dark">
        <q-btn><q-icon name="menu" /></q-btn>
        <q-btn><q-icon name="security" /></q-btn>
        <q-toolbar-title :padding="2">
          Toolbar
        </q-toolbar-title>
        <q-btn><q-icon name="headset" /></q-btn>
        <q-btn><q-icon name="tv" /></q-btn>
      </div>

      <p class="caption">
        And also "inverted".
      </p>
      <div class="toolbar purple inverted">
        <q-btn><q-icon name="menu" /></q-btn>
        <q-toolbar-title :padding="2">
          Toolbar
        </q-toolbar-title>
        <q-btn><q-icon name="supervisor_account" /></q-btn>
        <q-btn><q-icon name="more_vert" /></q-btn>
      </div>
      <div class="toolbar amber inverted">
        <q-btn><q-icon name="menu" /></q-btn>
        <q-toolbar-title :padding="2">
          Toolbar
        </q-toolbar-title>
        <q-btn><q-icon name="supervisor_account" /></q-btn>
        <q-btn><q-icon name="more_vert" /></q-btn>
      </div>
      <div class="toolbar red inverted">
        <q-btn><q-icon name="menu" /></q-btn>
        <q-toolbar-title :padding="2">
          Toolbar
        </q-toolbar-title>
        <q-btn><q-icon name="supervisor_account" /></q-btn>
        <q-btn><q-icon name="more_vert" /></q-btn>
      </div>
    </div>
  </div>
</template>
