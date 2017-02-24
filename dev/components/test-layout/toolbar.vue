<template>
  <div>
    <div class="layout-padding">
      <p class="caption">
        Toolbars are mainly used in Layout headers and footers, but they can be used
        in your Page view too.
      </p>

      <div class="toolbar">
        <q-btn class="left-drawer-opener">
          <i>menu</i>
        </q-btn>
        <q-toolbar-title :padding="1">
          Toolbar
        </q-toolbar-title>
        <q-btn class="right-drawer-opener">
          <i>more_vert</i>
        </q-btn>
      </div>

      <p class="caption">
        They come in all colors.
      </p>

      <div class="toolbar secondary">
        <q-btn><i>assignment_ind</i></q-btn>
        <q-toolbar-title :padding="2">
          Toolbar
        </q-toolbar-title>
        <q-btn><i>sim_card</i></q-btn>
        <q-btn><i>gamepad</i></q-btn>
      </div>
      <div class="toolbar orange">
        <q-btn><i>mail</i></q-btn>
        <q-toolbar-title :padding="3">
          Long title for Toolbar. Very very very very very very long title.
        </q-toolbar-title>
        <q-btn><i>alarm</i></q-btn>
        <q-btn><i>router</i></q-btn>
        <q-btn><i>keyboard</i></q-btn>
      </div>
      <div class="toolbar dark">
        <q-btn><i>menu</i></q-btn>
        <q-btn><i>security</i></q-btn>
        <q-toolbar-title :padding="2">
          Toolbar
        </q-toolbar-title>
        <q-btn><i>headset</i></q-btn>
        <q-btn><i>tv</i></q-btn>
      </div>

      <p class="caption">
        And also "inverted".
      </p>
      <div class="toolbar purple inverted">
        <q-btn><i>menu</i></q-btn>
        <q-toolbar-title :padding="2">
          Toolbar
        </q-toolbar-title>
        <q-btn><i>supervisor_account</i></q-btn>
        <q-btn><i>more_vert</i></q-btn>
      </div>
      <div class="toolbar amber inverted">
        <q-btn><i>menu</i></q-btn>
        <q-toolbar-title :padding="2">
          Toolbar
        </q-toolbar-title>
        <q-btn><i>supervisor_account</i></q-btn>
        <q-btn><i>more_vert</i></q-btn>
      </div>
      <div class="toolbar red inverted">
        <q-btn><i>menu</i></q-btn>
        <q-toolbar-title :padding="2">
          Toolbar
        </q-toolbar-title>
        <q-btn><i>supervisor_account</i></q-btn>
        <q-btn><i>more_vert</i></q-btn>
      </div>
    </div>
  </div>
</template>
