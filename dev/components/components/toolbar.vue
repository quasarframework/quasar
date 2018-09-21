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

      <q-toolbar class="bg-transparent text-primary q-my-md">
        <q-btn flat round dense icon="menu" />
        <q-toolbar-title>
          Toolbar
        </q-toolbar-title>
        <q-btn flat round dense icon="more_vert" />
      </q-toolbar>

      <q-toolbar class="bg-secondary q-my-md">
        <q-btn flat round dense icon="assignment_ind" />
        <q-toolbar-title>
          Toolbar
        </q-toolbar-title>
        <q-btn flat round dense icon="sim_card" class="q-mr-xs" />
        <q-btn flat round dense icon="gamepad" />
      </q-toolbar>

      <q-toolbar class="bg-red q-my-md">
        <q-btn flat round dense icon="assignment_ind" />
        <q-toolbar-title>
          Toolbar g
          <span slot="subtitle">Subtitle g</span>
        </q-toolbar-title>
        <q-btn flat round dense icon="sim_card" class="q-mr-xs" />
        <q-btn flat round dense icon="gamepad" />
      </q-toolbar>

      <q-toolbar class="bg-grey-2 text-grey-9 q-my-md">
        <q-btn flat round dense icon="assignment_ind" />
        <q-toolbar-title>
          Toolbar g
          <span slot="subtitle">Subtitle g</span>
        </q-toolbar-title>
        <q-btn flat round dense icon="sim_card" class="q-mr-xs" />
        <q-btn flat round dense icon="gamepad" />
      </q-toolbar>

      <q-toolbar class="bg-orange q-my-md">
        <q-btn flat round dense icon="mail" />
        <q-toolbar-title>
          Long title for Toolbar. Very very very very very very long title.
        </q-toolbar-title>
        <q-btn flat round dense icon="alarm" class="q-mr-xs" />
        <q-btn flat round dense icon="router" class="q-mr-xs" />
        <q-btn flat round dense icon="keyboard" />
      </q-toolbar>

      <q-toolbar class="bg-black q-my-md">
        <q-btn flat round dense icon="menu" class="q-mr-xs" />
        <q-btn flat round dense icon="security" />
        <q-toolbar-title>
          Toolbar
        </q-toolbar-title>
        <q-btn flat round dense icon="headset" class="q-mr-xs" />
        <q-btn flat round dense icon="tv" />
      </q-toolbar>

      <p class="caption">
        Spacing, Separators
      </p>

      <q-toolbar class="q-my-sm shadow-2">
        <q-btn flat round dense icon="menu" class="q-mr-sm" />
        <q-separator dark vertical inset />
        <q-btn class="self-stretch" flat label="Link" />

        <q-space />

        <q-btn-dropdown stretch flat label="Dropdown">
          <q-list link>
            <q-item-label header>Folders</q-item-label>
            <q-item v-for="n in 3" :key="`x.${n}`" clickable v-close-overlay tabindex="0">
              <q-item-section avatar>
                <q-avatar icon="folder" color="secondary" text-color="white" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Photos</q-item-label>
                <q-item-label caption>February 22, 2016</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-icon name="info" />
              </q-item-section>
            </q-item>
            <q-separator inset />
            <q-item-label header>Files</q-item-label>
            <q-item v-for="n in 3" :key="`y.${n}`" clickable v-close-overlay tabindex="0">
              <q-item-section avatar>
                <q-avatar icon="assignment" color="primary" text-color="white" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Vacation</q-item-label>
                <q-item-label caption>February 22, 2016</q-item-label>
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

      <q-toolbar class="q-my-sm shadow-2">
        <div class="text-h5">My Blog</div>
        <q-separator vertical inset dark class="q-mx-sm" />
        <div class="text-subtitle1">Articles</div>

        <q-space />

        <q-btn stretch flat label="Link" />
        <q-separator dark vertical />
        <q-btn stretch flat label="Link" />
        <q-separator dark vertical />
        <q-btn stretch flat label="Link" />
      </q-toolbar>

      <q-toolbar class="bg-secondary q-my-sm shadow-2">
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

      <q-toolbar class="q-my-sm shadow-2">
        <q-btn flat label="Homepage" />
        <q-space />
        <q-tabs>
          <q-tab slot="title" label="Tab 1" />
          <q-tab slot="title" label="Tab 2" />
          <q-tab slot="title" label="Tab 3" />
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
