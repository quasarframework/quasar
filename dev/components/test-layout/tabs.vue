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
        Keeping Tabs Alive
      </p>
      <q-toggle v-model="toggleA" label="Keep A alive" />
      <q-toggle v-model="toggleB" label="Keep B live" />
      <br><br>
      <q-tabs>
        <q-tab slot="title" name="tab-1" icon="message" label="Tab 1" />
        <q-tab default slot="title" name="tab-2" icon="fingerprint" label="Tab 2" />

        <q-tab-pane name="tab-1" :keep-alive="toggleA">
          <comp-a></comp-a>
        </q-tab-pane>
        <q-tab-pane name="tab-2" :keep-alive="toggleB">
          <comp-b></comp-b>
        </q-tab-pane>
      </q-tabs>
      <br><br>

      <p>
        Check Layout source code to see how you can link
        tabs to navigation routes.
      </p>

      <q-tabs>
        <q-tab slot="title" icon="mail" label="Mails" />
        <q-tab slot="title" icon="alarm" disable label="Alarms" />
        <q-tab slot="title" icon="movie" label="Movies" />
        <q-tab slot="title" icon="mail" label="Mails" />
        <q-tab slot="title" icon="alarm" label="Alarms" />
        <q-tab slot="title" icon="movie" label="Movies" />
        <q-tab slot="title" icon="mail" label="Mails" />
        <q-tab slot="title" icon="alarm" label="Alarms" />
        <q-tab slot="title" icon="movie" label="Movies" />
        <q-tab slot="title" icon="mail" label="Mails" />
        <q-tab slot="title" icon="alarm" label="Alarms" />
        <q-tab slot="title" icon="movie" label="Movies" />
        <q-tab slot="title" icon="mail" label="Mails" />
        <q-tab slot="title" icon="alarm" label="Alarms" />
        <q-tab slot="title" icon="movie" label="Movies" />
        <q-tab slot="title" icon="mail" label="Mails" />
        <q-tab slot="title" icon="alarm" label="Alarms" />
        <q-tab slot="title" icon="movie" label="Movies" />
      </q-tabs>

      <br>
      <q-tabs>
        <q-tab slot="title" label="Mails" />
        <q-tab slot="title" label="Alarms" />
        <q-tab slot="title" label="Movies" />
      </q-tabs>

      <br>
      <q-tabs>
        <q-tab slot="title" icon="mail" />
        <q-tab slot="title" icon="alarm" />
        <q-tab slot="title" icon="movie" />
      </q-tabs>

      <p class="caption">
        They come in all colors.
      </p>
      <div class="group">
        <q-tabs color="secondary">
          <q-tab slot="title" icon="mail" label="Mails" />
          <q-tab slot="title" icon="alarm" label="Alarms" />
          <q-tab slot="title" icon="movie" label="Movies" />
        </q-tabs>
        <q-tabs color="amber">
          <q-tab slot="title" icon="mail" label="Mails" />
          <q-tab slot="title" icon="alarm" label="Alarms" />
          <q-tab slot="title" icon="movie" label="Movies" />
        </q-tabs>
        <q-tabs color="tertiary">
          <q-tab slot="title" icon="mail" label="Mails" />
          <q-tab slot="title" icon="alarm" label="Alarms" />
          <q-tab slot="title" icon="movie" label="Movies" />
        </q-tabs>
        <q-tabs color="tertiary">
          <q-tab slot="title" label="Mails" />
          <q-tab slot="title" label="Alarms" />
          <q-tab slot="title" label="Movies" />
        </q-tabs>
      </div>

      <p class="caption">
        And also "inverted".
      </p>
      <div class="group">
        <q-tabs color="secondary" inverted>
          <q-tab slot="title" icon="mail" label="Mails" />
          <q-tab slot="title" icon="alarm" label="Alarms" />
          <q-tab slot="title" icon="movie" label="Movies" />
        </q-tabs>
        <q-tabs color="amber" inverted>
          <q-tab slot="title" icon="mail" label="Mails" />
          <q-tab slot="title" icon="alarm" label="Alarms" />
          <q-tab slot="title" icon="movie" label="Movies" />
        </q-tabs>
        <q-tabs color="tertiary" inverted>
          <q-tab slot="title" icon="mail" label="Mails" />
          <q-tab slot="title" icon="alarm" label="Alarms" />
          <q-tab slot="title" icon="movie" label="Movies" />
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
        <q-tab slot="title" icon="mail" label="Mails" />
        <q-tab slot="title" icon="alarm" label="Alarms" />
        <q-tab slot="title" icon="movie" label="Movies" />
      </q-tabs>

      <p class="caption">
        <span class="desktop-only">Click</span>
        <span class="mobile-only">Tap</span>
        on next Tabs to see target below them swapping views.
      </p>

      <q-tabs>
        <q-tab slot="title" name="tab-1" icon="message" label="Tab 1" />
        <q-tab slot="title" name="tab-2" disable icon="fingerprint" label="Tab 2" />
        <q-tab slot="title" name="tab-3" icon="alarm" label="Tab 3" />
        <q-tab slot="title" default name="tab-4" icon="accessibility" label="Tab 4" />
        <q-tab slot="title" name="tab-5" hidden icon="accessibility" label="Tab 5" />

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
      <div class="row items-center">
        <div style="margin-right: 10px">Programmatic select tab:</div>
        <q-select v-model="xTabsModel" :options="xTabsOptions" />
      </div>
      <q-tabs
        v-model="xTabsModel"
        color="orange"
      >
        <q-tab slot="title" name="xtab-1" icon="message" label="Tab 1" />
        <q-tab slot="title" name="xtab-2" icon="alarm" label="Tab 2" />
        <q-tab slot="title" name="xtab-3" icon="accessibility" label="Tab 3" />

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
  components: {
    CompA: {
      name: 'comp-a',
      created () {
        console.log('creating A')
      },
      beforeDestroy () {
        console.log('destroying A')
      },
      render (h) {
        return h('div', {staticClass: 'comp-a'}, 'Tab A')
      }
    },
    CompB: {
      name: 'comp-a',
      created () {
        console.log('creating B')
      },
      beforeDestroy () {
        console.log('destroying B')
      },
      render (h) {
        return h('div', {staticClass: 'comp-b'}, 'Tab B')
      }
    }
  },
  data () {
    return {
      toggleA: true,
      toggleB: false,
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
