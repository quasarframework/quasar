<template>
  <div class="q-layout-padding row justify-center">
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

      <q-toolbar class="text-primary q-my-md">
        <q-btn flat round dense icon="menu" />
        <q-toolbar-title>
          Toolbar
        </q-toolbar-title>
        <q-btn flat round dense icon="more_vert" />
      </q-toolbar>

      <q-toolbar class="bg-primary text-white q-my-md">
        <q-btn flat round dense icon="menu" class="q-mr-sm" />
        <q-avatar>
          <img src="https://cdn.quasar.dev/logo-v2/128/logo.png">
        </q-avatar>

        <q-toolbar-title>Quasar Framework</q-toolbar-title>

        <q-btn flat round dense icon="whatshot" />
      </q-toolbar>

      <q-toolbar class="bg-purple text-white q-my-md">
        <q-btn flat round dense icon="assignment_ind" />
        <q-toolbar-title>
          Toolbar
        </q-toolbar-title>
        <q-btn flat round dense icon="apps" class="q-mr-xs" />
        <q-btn flat round dense icon="more_vert" />
      </q-toolbar>

      <div class="bg-primary text-white q-my-md">
        <q-toolbar>
          <q-btn flat round dense icon="menu" class="q-mr-sm" />
          <q-space />
          <q-btn flat round dense icon="search" class="q-mr-xs" />
          <q-btn flat round dense icon="group_add" />
        </q-toolbar>
        <q-toolbar inset>
          <q-toolbar-title><strong>Quasar</strong> Framework</q-toolbar-title>
        </q-toolbar>
      </div>

      <q-toolbar class="bg-red text-white q-my-md">
        <q-btn flat round dense icon="assignment_ind" />
        <q-toolbar-title>
          Toolbar
        </q-toolbar-title>
        <q-btn flat round dense icon="sim_card" class="q-mr-xs" />
        <q-btn flat round dense icon="gamepad" />
      </q-toolbar>

      <q-toolbar class="bg-grey-2 text-grey-9 q-my-md">
        <q-btn flat round dense icon="assignment_ind" />
        <q-toolbar-title>
          Toolbar
        </q-toolbar-title>
        <q-btn flat round dense icon="sim_card" class="q-mr-xs" />
        <q-btn flat round dense icon="gamepad" />
      </q-toolbar>

      <div class="bg-cyan text-white q-my-md">
        <q-toolbar>
          <q-btn flat round dense icon="assignment_ind" />

          <q-space />

          <q-btn flat round dense icon="sim_card" class="q-mr-xs" />
          <q-btn flat round dense icon="gamepad" />
        </q-toolbar>

        <q-toolbar inset>
          <q-breadcrumbs active-color="white" style="font-size: 16px">
            <q-breadcrumbs-el label="Home" icon="home" />
            <q-breadcrumbs-el label="Components" icon="widgets" />
            <q-breadcrumbs-el label="Toolbar" />
          </q-breadcrumbs>
        </q-toolbar>
      </div>

      <q-toolbar class="bg-orange text-white q-my-md">
        <q-btn flat round dense icon="mail" />
        <q-toolbar-title>
          Long title for Toolbar. Very very very very very very long title.
        </q-toolbar-title>
        <q-btn flat round dense icon="alarm" class="q-mr-xs" />
        <q-btn flat round dense icon="router" class="q-mr-xs" />
        <q-btn flat round dense icon="keyboard" />
      </q-toolbar>

      <div class="row no-wrap shadow-1">
        <q-toolbar class="col-8 bg-grey-3">
          <q-btn flat round dense icon="menu" />
          <q-toolbar-title>Title</q-toolbar-title>
          <q-btn flat round dense icon="search" />
        </q-toolbar>
        <q-toolbar class="col-4 bg-primary text-white">
          <q-space />
          <q-btn flat round dense icon="bluetooth" class="q-mr-sm" />
          <q-btn flat round dense icon="more_vert" />
        </q-toolbar>
      </div>

      <q-toolbar class="bg-black text-white q-my-md">
        <q-btn flat round dense icon="menu" class="q-mr-xs" />
        <q-btn flat round dense icon="security" />
        <q-toolbar-title>
          Toolbar
        </q-toolbar-title>
        <q-btn flat round dense icon="headset" class="q-mr-xs" />
        <q-btn flat round dense icon="tv" />
      </q-toolbar>

      <q-toolbar class="bg-primary text-white q-my-md shadow-2">
        <q-btn flat round dense icon="menu" class="q-mr-sm" />
        <q-separator dark vertical inset />
        <q-btn stretch flat label="Link" />

        <q-space />

        <q-btn-dropdown stretch flat label="Dropdown">
          <q-list>
            <q-item-label header>
              Folders
            </q-item-label>
            <q-item v-for="n in 3" :key="`x.${n}`" clickable v-close-popup tabindex="0">
              <q-item-section avatar>
                <q-avatar icon="folder" color="secondary" text-color="white" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Photos</q-item-label>
                <q-item-label caption>
                  February 22, 2016
                </q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-icon name="info" />
              </q-item-section>
            </q-item>
            <q-separator inset spaced />
            <q-item-label header>
              Files
            </q-item-label>
            <q-item v-for="n in 3" :key="`y.${n}`" clickable v-close-popup tabindex="0">
              <q-item-section avatar>
                <q-avatar icon="assignment" color="primary" text-color="white" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Vacation</q-item-label>
                <q-item-label caption>
                  February 22, 2016
                </q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-icon name="info" />
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
        <q-separator dark vertical />
        <q-btn stretch flat label="Link" />
        <q-separator dark vertical />
        <q-btn stretch flat label="Link" />
      </q-toolbar>

      <q-toolbar class="bg-secondary text-white q-my-md shadow-2">
        <q-btn flat round dense icon="menu" class="q-mr-sm" />

        <q-space />

        <q-btn-toggle
          v-model="model"
          flat stretch
          toggle-color="yellow"
          :options="[
            {label: 'One', value: 'one'},
            {label: 'Two', value: 'two'},
            {label: 'Three', value: 'three'}
          ]"
        />
      </q-toolbar>

      <q-toolbar class="bg-primary text-white q-my-md shadow-2">
        <q-btn flat label="Homepage" />
        <q-space />
        <q-tabs>
          <q-tab label="Tab 1" />
          <q-tab label="Tab 2" />
          <q-tab label="Tab 3" />
        </q-tabs>
      </q-toolbar>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      model: null
    }
  }
}
</script>
