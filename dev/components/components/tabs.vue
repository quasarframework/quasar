<template>
  <div class="tabs-demo bg-grey-3 q-py-xl">
    <div class="text-primary">
      <q-tabs-bar>
        <q-tab label="Item one" />
        <q-tab label="Item two" />
        <q-tab label="Item three" />
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
      </q-tabs-bar>

      <q-tabs-bar align="right">
        <q-tab icon="phone" />
        <q-tab icon="favorite" />
        <q-tab icon="location_on" />
      </q-tabs-bar>

      <q-tabs-bar inline-label>
        <q-tab icon="map">
          <q-chip color="teal" text-color="white" floating>2</q-chip>
        </q-tab>
        <q-tab icon="map" label="Map">
          <q-chip color="teal" text-color="white" floating>2</q-chip>
        </q-tab>
        <q-tab icon="map" alert />
        <q-tab icon="map" label="Map" alert />
        <q-tab icon="location_on" />
      </q-tabs-bar>

      <q-tabs-bar class="bg-grey-1 text-teal">
        <q-tab icon="phone" label="Item one Item one Item one" />
        <q-tab icon="favorite" label="Item two" />
        <q-tab icon="location_on" label="Item three" />
      </q-tabs-bar>

      <q-tabs-bar narrow-indicator>
        <q-tab icon="phone" label="Item one Item one Item one" />
        <q-tab icon="favorite" label="Item two" />
        <q-tab icon="location_on" label="Item three" />
      </q-tabs-bar>

      <q-tabs-bar inline-label class="bg-primary text-white">
        <q-tab icon="phone" label="Item one Item one Item one" />
        <q-tab icon="favorite" label="Item two" />
        <q-tab icon="location_on" label="Item three" />
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
      </q-tabs-bar>

      <q-tabs-bar inline-label align="justify">
        <q-tab icon="phone" label="Item one" />
        <q-tab icon="favorite" label="Item two" />
        <q-tab icon="location_on" label="Item three" />
        <q-tab icon="phone" label="Item four" />
        <q-tab icon="favorite" label="Item five" />
        <q-tab icon="location_on" label="Item six" />
      </q-tabs-bar>

      <h4>Router tabs</h4>
      <div class="row gutter-xs justify-stretch">
        <div class="col-12 col-sm-6 col-md">
          <q-btn class="fit" size="sm" color="secondary" to="/components/tabs/a#123" label="/tabs/a#123 - select most specific tab" />
        </div>
        <div class="col-12 col-sm-6 col-md">
          <q-btn class="fit" size="sm" color="secondary" to="/components/tabs/a/a#123" label="/tabs/a/a#123 - select most specific tab" />
        </div>
        <div class="col-12 col-sm-6 col-md">
          <q-btn class="fit" size="sm" color="secondary" to="/components/tabs/a/a" label="/tabs/b#123 - select exact tab" />
        </div>
        <div class="col-12 col-sm-6 col-md">
          <q-btn class="fit" size="sm" color="secondary" to="/components/tabs/b#123" label="/tabs/b#123 - select no tab" />
        </div>
      </div>
      <q-tabs-bar class="test q-mt-sm">
        <q-route-tab name="tabs" to="/components/tabs" exact replace label="/tabs" />
        <q-route-tab name="tabs/a" to="/components/tabs/a" exact replace label="/tabs/a" />
        <q-route-tab name="tabs/a *" to="/components/tabs/a" replace label="/tabs/a *" />
        <q-route-tab name="tabs/a#1" to="/components/tabs/a#1" exact replace label="/tabs/a#1" />
        <q-route-tab name="tabs/a/a" to="/components/tabs/a/a" exact replace label="/tabs/a/a" />
        <q-route-tab name="tabs/a/a *" to="/components/tabs/a/a" replace label="/tabs/a/a *" />
        <q-route-tab name="tabs/a/a#1" to="/components/tabs/a/a#1" exact replace label="/tabs/a/a#1" />
        <q-route-tab name="tabs/a/b" to="/components/tabs/a/b" exact replace label="/tabs/a/b" />
        <q-route-tab name="tabs/b" to="/components/tabs/b" exact replace label="/tabs/b" />
        <q-route-tab name="tabs/b/a" to="/components/tabs/b/a" exact replace label="/tabs/b/a" />
        <q-route-tab name="tabs/c" to="/components/tabs/c" exact replace label="/tabs/c" />
      </q-tabs-bar>

      <h4>Tabs content (animated, swipeable)</h4>
      <q-option-group
        type="radio"
        v-model="tab"
        :options="[
          {label: 'One', value: 'one'},
          {label: 'Two', value: 'two'},
          {label: 'Three', value: 'three'},
          {label: 'Bogus', value: 'bogus'}
        ]"
        inline
        class="q-ma-md"
      />

      <div class="shadow-1 q-ma-md">
        <q-tabs-bar
          v-model="tab"
          active-color="white"
          indicator-color="yellow"
          class="bg-cyan text-white"
          style="margin-bottom: 0"
        >
          <q-tab name="one" icon="phone" label="One" />
          <q-tab name="two" icon="favorite" label="Two" />
          <q-tab name="three" icon="location_on" label="Three" />
          <q-tab disable name="four" icon="map" label="Four" />
        </q-tabs-bar>

        <q-tabs-content
          v-model="tab"
          swipeable
          animated
          class="text-black text-center"
        >
          <q-tab-pane name="one">
            Tab One
          </q-tab-pane>

          <q-tab-pane name="two">
            Tab Two
          </q-tab-pane>

          <q-tab-pane name="three">
            Tab Three
          </q-tab-pane>
        </q-tabs-content>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      tab: 'one'
    }
  },

  methods: {
    //
  }
}
</script>

<style lang="stylus">
.tabs-demo .q-tabs-bar
  margin-bottom 24px
</style>
