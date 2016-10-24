<template>
  <div>
    <div class="layout-padding">
      <p class="caption">
        Toolbars are mainly used in Layout headers and footers, but they can be used
        in your Page view too.
      </p>

      <div class="toolbar">
        <button class="left-drawer-opener">
          <i>menu</i>
        </button>
        <quasar-toolbar-title :padding="1">
          Toolbar
        </quasar-toolbar-title>
        <button class="right-drawer-opener">
          <i>more_vert</i>
        </button>
      </div>

      <p class="caption">
        They come in all colors.
      </p>

      <div class="toolbar secondary">
        <button><i>assignment_ind</i></button>
        <quasar-toolbar-title :padding="2">
          Toolbar
        </quasar-toolbar-title>
        <button><i>sim_card</i></button>
        <button><i>gamepad</i></button>
      </div>
      <div class="toolbar orange">
        <button><i>mail</i></button>
        <quasar-toolbar-title :padding="3">
          Long title for Toolbar. Very very very very very very long title.
        </quasar-toolbar-title>
        <button><i>alarm</i></button>
        <button><i>router</i></button>
        <button><i>keyboard</i></button>
      </div>
      <div class="toolbar dark">
        <button><i>menu</i></button>
        <button><i>security</i></button>
        <quasar-toolbar-title :padding="2">
          Toolbar
        </quasar-toolbar-title>
        <button><i>headset</i></button>
        <button><i>tv</i></button>
      </div>

      <p class="caption">
        And also "inverted".
      </p>
      <div class="toolbar purple inverted">
        <button><i>menu</i></button>
        <quasar-toolbar-title :padding="2">
          Toolbar
        </quasar-toolbar-title>
        <button><i>supervisor_account</i></button>
        <button><i>more_vert</i></button>
      </div>
      <div class="toolbar amber inverted">
        <button><i>menu</i></button>
        <quasar-toolbar-title :padding="2">
          Toolbar
        </quasar-toolbar-title>
        <button><i>supervisor_account</i></button>
        <button><i>more_vert</i></button>
      </div>
      <div class="toolbar red inverted">
        <button><i>menu</i></button>
        <quasar-toolbar-title :padding="2">
          Toolbar
        </quasar-toolbar-title>
        <button><i>supervisor_account</i></button>
        <button><i>more_vert</i></button>
      </div>
    </div>
  </div>
</template>
