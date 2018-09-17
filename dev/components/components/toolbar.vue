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

      <q-toolbar class="q-my-md">
        <q-btn flat round dense icon="menu" />
        <q-toolbar-title>
          Toolbar
        </q-toolbar-title>
        <q-btn flat round dense icon="more_vert" />
      </q-toolbar>

      <q-toolbar color="secondary" class="q-my-md">
        <q-btn flat round dense icon="assignment_ind" />
        <q-toolbar-title>
          Toolbar
        </q-toolbar-title>
        <q-btn flat round dense icon="sim_card" class="q-mr-xs" />
        <q-btn flat round dense icon="gamepad" />
      </q-toolbar>

      <q-toolbar color="yellow" class="q-my-md text-black">
        <q-btn flat round dense icon="assignment_ind" />
        <q-toolbar-title>
          Toolbar
          <span slot="subtitle">Subtitle</span>
        </q-toolbar-title>
        <q-btn flat round dense icon="sim_card" class="q-mr-xs" />
        <q-btn flat round dense icon="gamepad" />
      </q-toolbar>

      <q-toolbar color="orange" class="q-my-md">
        <q-btn flat round dense icon="mail" />
        <q-toolbar-title>
          Long title for Toolbar. Very very very very very very long title.
        </q-toolbar-title>
        <q-btn flat round dense icon="alarm" class="q-mr-xs" />
        <q-btn flat round dense icon="router" class="q-mr-xs" />
        <q-btn flat round dense icon="keyboard" />
      </q-toolbar>

      <q-toolbar color="black" class="q-my-md">
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
            <q-list-header inset>Folders X</q-list-header>
            <q-item v-for="n in 3" :key="`x.${n}`" v-close-overlay :tabindex="0">
              <q-item-side icon="folder" inverted color="grey-6" />
              <q-item-main>
                <q-item-tile label>Photos</q-item-tile>
                <q-item-tile sublabel>February 22, 2016</q-item-tile>
              </q-item-main>
              <q-item-side right icon="info" />
            </q-item>
            <q-item-separator inset />
            <q-list-header inset>Files</q-list-header>
            <q-item v-for="n in 3" :key="`y.${n}`" v-close-overlay :tabindex="0">
              <q-item-side icon="assignment" inverted color="grey-6" />
              <q-item-main>
                <q-item-tile label>Vacation</q-item-tile>
                <q-item-tile sublabel>February 22, 2016</q-item-tile>
              </q-item-main>
              <q-item-side right icon="info" />
            </q-item>
          </q-list>
        </q-btn-dropdown>
        <q-separator dark vertical />
        <q-btn stretch flat label="Link" />
        <q-separator dark vertical />
        <q-btn stretch flat label="Link" />
      </q-toolbar>

      <q-toolbar class="q-my-sm shadow-2">
        <div class="q-headline">My Blog</div>
        <q-separator class="q-mx-sm" dark vertical inset />
        <div class="q-subheading">Articles</div>

        <q-space />

        <q-btn stretch flat label="Link" />
        <q-separator dark vertical />
        <q-btn stretch flat label="Link" />
        <q-separator dark vertical />
        <q-btn stretch flat label="Link" />
      </q-toolbar>

      <q-toolbar class="q-my-sm shadow-2">
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
