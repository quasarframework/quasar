<template>
  <div>
    <div class="layout-padding">
      <p class="caption desktop-only">
        On a real mobile device Tabs look a little different
        in the sense that arrows won't be shown since user can
        pan (touch action) through the menu.
        <br>
      </p>

      <p>
        Check Layout source code to see how you can link
        tabs to navigation routes.
      </p>

      <q-tabs>
        <q-tab slot="title" icon="mail">Mails</q-tab>
        <q-tab slot="title" icon="alarm" disable>Alarms</q-tab>
        <q-tab slot="title" icon="movie">Movies</q-tab>
        <q-tab slot="title" icon="mail">Mails</q-tab>
        <q-tab slot="title" icon="alarm">Alarms</q-tab>
        <q-tab slot="title" icon="movie">Movies</q-tab>
        <q-tab slot="title" icon="mail">Mails</q-tab>
        <q-tab slot="title" icon="alarm">Alarms</q-tab>
        <q-tab slot="title" icon="movie">Movies</q-tab>
        <q-tab slot="title" icon="mail">Mails</q-tab>
        <q-tab slot="title" icon="alarm">Alarms</q-tab>
        <q-tab slot="title" icon="movie">Movies</q-tab>
        <q-tab slot="title" icon="mail">Mails</q-tab>
        <q-tab slot="title" icon="alarm">Alarms</q-tab>
        <q-tab slot="title" icon="movie">Movies</q-tab>
        <q-tab slot="title" icon="mail">Mails</q-tab>
        <q-tab slot="title" icon="alarm">Alarms</q-tab>
        <q-tab slot="title" icon="movie">Movies</q-tab>
      </q-tabs>

      <p class="caption">
        They come in all colors.
      </p>
      <div class="group">
        <q-tabs class="primary">
          <q-tab slot="title" icon="mail">Mails</q-tab>
          <q-tab slot="title" icon="alarm">Alarms</q-tab>
          <q-tab slot="title" icon="movie">Movies</q-tab>
        </q-tabs>
        <q-tabs class="amber clear">
          <q-tab slot="title" icon="mail">Mails</q-tab>
          <q-tab slot="title" icon="alarm">Alarms</q-tab>
          <q-tab slot="title" icon="movie">Movies</q-tab>
        </q-tabs>
        <q-tabs class="secondary">
          <q-tab slot="title" icon="mail">Mails</q-tab>
          <q-tab slot="title" icon="alarm">Alarms</q-tab>
          <q-tab slot="title" icon="movie">Movies</q-tab>
        </q-tabs>
      </div>

      <p class="caption">
        And also "inverted".
      </p>
      <div class="group">
        <q-tabs class="orange inverted">
          <q-tab slot="title" icon="mail">Mails</q-tab>
          <q-tab slot="title" icon="alarm">Alarms</q-tab>
          <q-tab slot="title" icon="movie">Movies</q-tab>
        </q-tabs>
        <q-tabs class="secondary inverted">
          <q-tab slot="title" icon="mail">Mails</q-tab>
          <q-tab slot="title" icon="alarm">Alarms</q-tab>
          <q-tab slot="title" icon="movie">Movies</q-tab>
        </q-tabs>
        <q-tabs class="dark inverted">
          <q-tab slot="title" icon="mail">Mails</q-tab>
          <q-tab slot="title" icon="alarm">Alarms</q-tab>
          <q-tab slot="title" icon="movie">Movies</q-tab>
        </q-tabs>
      </div>

      <div class="row items-center">
        <div style="margin-right: 15px">Align</div>
        <q-select
          v-model="align"
          :options="[
            {label: 'Left', value: 'left'},
            {label: 'Center', value: 'center'},
            {label: 'Right', value: 'right'},
            {label: 'Justify', value: 'justify'}
          ]"
        />
        <div style="margin-left: 15px">on desktop too.</div>
      </div>
      <q-tabs :align="align">
        <q-tab slot="title" icon="mail">Mails</q-tab>
        <q-tab slot="title" icon="alarm">Alarms</q-tab>
        <q-tab slot="title" icon="movie">Movies</q-tab>
      </q-tabs>

      <p class="caption">
        <span class="desktop-only">Click</span>
        <span class="mobile-only">Tap</span>
        on next Tabs to see target below them swapping views.
      </p>

      <q-tabs class="primary">
        <q-tab slot="title" name="tab-1" icon="message">Tab 1</q-tab>
        <q-tab slot="title" name="tab-2" disable icon="fingerprint">Tab 2</q-tab>
        <q-tab slot="title" name="tab-3" icon="alarm">Tab 3</q-tab>
        <q-tab slot="title" selected name="tab-4" icon="accessibility">Tab 4</q-tab>
        <q-tab slot="title" name="tab-5" hidden icon="accessibility">Tab 5</q-tab>

        <q-tab-pane name="tab-1">
          <div v-for="n in 5">Tab 1</div>
        </q-tab-pane>
        <q-tab-pane name="tab-2">
          <div v-for="n in 10">Tab 2</div>
        </q-tab-pane>
        <q-tab-pane name="tab-3">
          <div v-for="n in 7">Tab 3</div>
        </q-tab-pane>
        <q-tab-pane name="tab-4">
          <div v-for="n in 4">Tab 4</div>
        </q-tab-pane>
        <q-tab-pane name="tab-5">
          <div v-for="n in 2">Tab 5</div>
        </q-tab-pane>
      </q-tabs>

      <br><br>
      <div class="flex items-center">
        <div style="margin-right: 10px">Programmatic select tab:</div>
        <q-select v-model="xTabsModel" :options="xTabsOptions" />
      </div>
      <q-tabs
        v-model="xTabsModel"
        class="orange"
      >
        <q-tab slot="title" name="xtab-1" icon="message">Tab 1</q-tab>
        <q-tab slot="title" name="xtab-2" icon="alarm">Tab 2</q-tab>
        <q-tab slot="title" name="xtab-3" icon="accessibility">Tab 3</q-tab>

        <q-tab-pane name="xtab-1">
          <div v-for="n in 5">Tab 1</div>
        </q-tab-pane>
        <q-tab-pane name="xtab-2">
          <div v-for="n in 7">Tab 2</div>
        </q-tab-pane>
        <q-tab-pane name="xtab-3">
          <div v-for="n in 4">Tab 3</div>
        </q-tab-pane>
      </q-tabs>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      align: 'justify',
      xTabsModel: 'xtab-2',
      xTabsOptions: [
        {label: 'Tab 1', value: 'xtab-1'},
        {label: 'Tab 2', value: 'xtab-2'},
        {label: 'Tab 3', value: 'xtab-3'}
      ]
    }
  }
}
</script>
