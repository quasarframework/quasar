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

      <quasar-tabs>
        <quasar-tab icon="mail">Mails</quasar-tab>
        <quasar-tab icon="alarm">Alarms</quasar-tab>
        <quasar-tab icon="movie">Movies</quasar-tab>
        <quasar-tab icon="mail">Mails</quasar-tab>
        <quasar-tab icon="alarm">Alarms</quasar-tab>
        <quasar-tab icon="movie">Movies</quasar-tab>
        <quasar-tab icon="mail">Mails</quasar-tab>
        <quasar-tab icon="alarm">Alarms</quasar-tab>
        <quasar-tab icon="movie">Movies</quasar-tab>
        <quasar-tab icon="mail">Mails</quasar-tab>
        <quasar-tab icon="alarm">Alarms</quasar-tab>
        <quasar-tab icon="movie">Movies</quasar-tab>
        <quasar-tab icon="mail">Mails</quasar-tab>
        <quasar-tab icon="alarm">Alarms</quasar-tab>
        <quasar-tab icon="movie">Movies</quasar-tab>
        <quasar-tab icon="mail">Mails</quasar-tab>
        <quasar-tab icon="alarm">Alarms</quasar-tab>
        <quasar-tab icon="movie">Movies</quasar-tab>
      </quasar-tabs>

      <p class="caption">
        They come in all colors.
      </p>
      <div class="group">
        <quasar-tabs class="primary">
          <quasar-tab icon="mail">Mails</quasar-tab>
          <quasar-tab icon="alarm">Alarms</quasar-tab>
          <quasar-tab icon="movie">Movies</quasar-tab>
        </quasar-tabs>
        <quasar-tabs class="amber clear">
          <quasar-tab icon="mail">Mails</quasar-tab>
          <quasar-tab icon="alarm">Alarms</quasar-tab>
          <quasar-tab icon="movie">Movies</quasar-tab>
        </quasar-tabs>
        <quasar-tabs class="secondary">
          <quasar-tab icon="mail">Mails</quasar-tab>
          <quasar-tab icon="alarm">Alarms</quasar-tab>
          <quasar-tab icon="movie">Movies</quasar-tab>
        </quasar-tabs>
      </div>

      <p class="caption">
        And also "inverted".
      </p>
      <div class="group">
        <quasar-tabs class="orange inverted">
          <quasar-tab icon="mail">Mails</quasar-tab>
          <quasar-tab icon="alarm">Alarms</quasar-tab>
          <quasar-tab icon="movie">Movies</quasar-tab>
        </quasar-tabs>
        <quasar-tabs class="secondary inverted">
          <quasar-tab icon="mail">Mails</quasar-tab>
          <quasar-tab icon="alarm">Alarms</quasar-tab>
          <quasar-tab icon="movie">Movies</quasar-tab>
        </quasar-tabs>
        <quasar-tabs class="dark inverted">
          <quasar-tab icon="mail">Mails</quasar-tab>
          <quasar-tab icon="alarm">Alarms</quasar-tab>
          <quasar-tab icon="movie">Movies</quasar-tab>
        </quasar-tabs>
      </div>

      <p class="caption">
        <span class="desktop-only">Click</span>
        <span class="mobile-only">Tap</span>
        on next Tabs to see target below them swapping views.
      </p>

      <div class="shadow-1">
        <quasar-tabs
          :refs="$refs"
          default-tab="tab-4"
          class="primary shadow-1"
          style="padding-top: 5px"
        >
          <quasar-tab name="tab-1" icon="message">Tab 1</quasar-tab>
          <quasar-tab name="tab-2" disable icon="fingerprint">Tab 2</quasar-tab>
          <quasar-tab name="tab-3" icon="alarm">Tab 3</quasar-tab>
          <quasar-tab name="tab-4" icon="accessibility">Tab 4</quasar-tab>
          <quasar-tab name="tab-5" hidden icon="accessibility">Tab 5</quasar-tab>
        </quasar-tabs>

        <div style="padding: 15px;">
          <div ref="tab-1">
            <div v-for="n in 5">Tab 1</div>
          </div>
          <div ref="tab-2">
            <div v-for="n in 10">Tab 2</div>
          </div>
          <div ref="tab-3">
            <div v-for="n in 7">Tab 3</div>
          </div>
          <div ref="tab-4">
            <div v-for="n in 4">Tab 4</div>
          </div>
          <div ref="tab-5">
            <div v-for="n in 2">Tab 5</div>
          </div>
        </div>
      </div>

      <br><br>
      <div class="shadow-1">
        <quasar-tabs
          :refs="$refs"
          v-model="xTabsModel"
          class="orange shadow-1"
          style="padding-top: 5px"
        >
          <quasar-tab name="xtab-1" icon="message">Tab 1</quasar-tab>
          <quasar-tab name="xtab-2" icon="alarm">Tab 2</quasar-tab>
          <quasar-tab name="xtab-3" icon="accessibility">Tab 3</quasar-tab>
        </quasar-tabs>

        <div style="padding: 15px;">
          <div class="flex items-baseline">
            <div style="margin-right: 10px">Programmatic select tab:</div>
            <quasar-select type="radio" v-model="xTabsModel" :options="xTabsOptions"></quasar-select>
          </div>

          <div ref="xtab-1">
            <div v-for="n in 5">Tab 1</div>
          </div>
          <div ref="xtab-2">
            <div v-for="n in 7">Tab 2</div>
          </div>
          <div ref="xtab-3">
            <div v-for="n in 4">Tab 3</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
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
