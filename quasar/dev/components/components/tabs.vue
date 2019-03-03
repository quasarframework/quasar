<template>
  <div class="tabs-demo bg-grey-3 q-py-xl">
    <div class="text-primary">
      <div>
        <q-checkbox v-model="dense" label="Dense" />
      </div>

      <q-tabs :dense="dense">
        <q-tab label="Item one" />
        <q-tab label="Item two" />
        <q-tab label="Item three" />
        <q-btn-dropdown stretch flat label="Dropdown">
          <q-list link>
            <q-item-label header>
              Folders
            </q-item-label>
            <q-item v-for="n in 3" :key="`x.${n}`" clickable v-close-menu tabindex="0">
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
            <q-separator inset />
            <q-item-label header>
              Files
            </q-item-label>
            <q-item v-for="n in 3" :key="`y.${n}`" clickable v-close-menu tabindex="0">
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
      </q-tabs>

      <q-tabs :dense="dense" :breakpoint="1000" align="right">
        <q-tab icon="phone" />
        <q-tab icon="favorite" />
        <q-tab icon="location_on" />
      </q-tabs>

      <q-tabs :dense="dense" inline-label>
        <q-tab icon="map">
          <q-badge color="red" floating>
            2
          </q-badge>
        </q-tab>
        <q-tab icon="map" label="Map">
          <q-badge color="red" floating>
            2
          </q-badge>
        </q-tab>
        <q-tab icon="map" alert />
        <q-tab icon="map" label="Map" alert />
        <q-tab icon="location_on" />
      </q-tabs>

      <q-tabs :dense="dense" class="bg-grey-1 text-teal">
        <q-tab icon="phone" label="Item one Item one Item one" />
        <q-tab icon="favorite" label="Item two" />
        <q-tab icon="location_on" label="Item three" />
      </q-tabs>

      <q-toolbar class="bg-purple text-white shadow-2 rounded-borders q-mb-xl">
        <q-btn flat label="Homepage" />
        <q-space />
        <q-tabs inline-label class="col-shrink">
          <q-tab icon="phone" label="Tab 1" />
          <q-tab label="Tab 2" />
          <q-tab icon="location_on" label="Tab 3" />
        </q-tabs>
      </q-toolbar>

      <q-tabs :dense="dense" class="bg-grey-1 text-teal">
        <q-tab icon="phone" label="Item one Item one Item one" />
        <q-tab label="Item two" />
        <q-tab icon="location_on" label="Item three" />
      </q-tabs>

      <q-tabs :dense="dense" narrow-indicator>
        <q-tab icon="phone" label="Item one Item one Item one" />
        <q-tab icon="favorite" label="Item two" />
        <q-tab icon="location_on" label="Item three" />
      </q-tabs>

      <q-tabs :dense="dense" inline-label class="bg-purple text-white">
        <q-tab icon="phone" label="Item one Item one Item one" />
        <q-tab icon="favorite" label="Item two" />
        <q-tab icon="location_on" label="Item three" />
        <q-btn-dropdown stretch flat label="Dropdown">
          <q-list link>
            <q-item-label header>
              Folders
            </q-item-label>
            <q-item v-for="n in 3" :key="`x.${n}`" clickable v-close-menu tabindex="0">
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
            <q-separator inset />
            <q-item-label header>
              Files
            </q-item-label>
            <q-item v-for="n in 3" :key="`y.${n}`" clickable v-close-menu tabindex="0">
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
      </q-tabs>

      <q-tabs :dense="dense" class="bg-teal text-yellow" top-indicator inline-label>
        <q-tab icon="phone" label="Item one" />
        <q-tab icon="favorite" label="-- Top indicator --" />
        <q-tab icon="location_on" label="Item three" />
      </q-tabs>

      <q-tabs :dense="dense" class="bg-white" inline-label active-bg-color="purple" active-color="white" indicator-color="transparent">
        <q-tab icon="phone" label="Item one" />
        <q-tab icon="favorite" label="Item two" />
        <q-tab icon="location_on" label="Item three" />
      </q-tabs>

      <q-tabs :dense="dense" inline-label align="justify" indicator-color="orange">
        <q-tab icon="phone" label="Item one" />
        <q-tab icon="favorite" label="Item two" />
        <q-tab icon="location_on" label="Item three" />
        <q-tab icon="phone" label="Item four" />
        <q-tab icon="favorite" label="Item five" />
        <q-tab icon="location_on" label="Item six" />
      </q-tabs>

      <div class="row q-gutter-xs justify-stretch">
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
      <q-tabs :dense="dense" class="test q-mt-sm">
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
      </q-tabs>

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
      <q-toggle v-model="panelTest" label="Panel test; Swap one with two / Remove tab two" />

      <div class="shadow-1 q-ma-md">
        <q-tabs
          :dense="dense"
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
        </q-tabs>

        <q-tab-panels
          v-model="tab"
          swipeable
          animated
          infinite
          class="text-black text-center"
        >
          <q-tab-panel :name="panelTest ? 'two' : 'one'">
            <q-btn dense round icon="map" class="absolute-bottom-right" />
            Tab One <strong v-if="panelTest">(Swapped)</strong> <br> Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident obcaecati repellendus dolores totam nostrum ut repudiandae perspiciatis est accusamus, eaque natus modi rem beatae optio cumque, velit ducimus autem magnam.
          </q-tab-panel>

          <q-tab-panel :name="panelTest ? 'one' : 'two'">
            Tab Two <strong v-if="panelTest">(Swapped)</strong>  <br> Lorem ipsum dolor sit amet consectetur adipisicing elit. At iusto neque odio porro, animi ducimus iure autem commodi sint, magni voluptatum molestias illo accusamus voluptate ratione aperiam. Saepe, fugiat vel.
          </q-tab-panel>

          <q-tab-panel name="three">
            Tab Three <br> Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis labore inventore accusantium, perferendis eos sapiente culpa consectetur deserunt praesentium cumque distinctio placeat, recusandae id qui odit similique officia? Mollitia, ea!
          </q-tab-panel>

          <q-tab-panel disable name="four">
            Tab Four <br> Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis labore inventore accusantium, perferendis eos sapiente culpa consectetur deserunt praesentium cumque distinctio placeat, recusandae id qui odit similique officia? Mollitia, ea!
          </q-tab-panel>
        </q-tab-panels>
      </div>

      <q-tab-panels
        v-model="tab"
        swipeable
        animated
        transition-prev="scale"
        transition-next="scale"
        class="text-black text-center"
      >
        <q-tab-panel name="one">
          <q-btn dense round icon="map" class="absolute-bottom-right" />
          v-if test Tab One <br> Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident obcaecati repellendus dolores totam nostrum ut repudiandae perspiciatis est accusamus, eaque natus modi rem beatae optio cumque, velit ducimus autem magnam.
        </q-tab-panel>

        <q-tab-panel v-if="!panelTest" name="two">
          v-if test Tab Two <br> Lorem ipsum dolor sit amet consectetur adipisicing elit. At iusto neque odio porro, animi ducimus iure autem commodi sint, magni voluptatum molestias illo accusamus voluptate ratione aperiam. Saepe, fugiat vel.
        </q-tab-panel>

        <q-tab-panel name="three">
          v-if test Tab Three <br> Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis labore inventore accusantium, perferendis eos sapiente culpa consectetur deserunt praesentium cumque distinctio placeat, recusandae id qui odit similique officia? Mollitia, ea!
        </q-tab-panel>

        <q-tab-panel disable name="four">
          v-if test Tab Four <br> Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis labore inventore accusantium, perferendis eos sapiente culpa consectetur deserunt praesentium cumque distinctio placeat, recusandae id qui odit similique officia? Mollitia, ea!
        </q-tab-panel>
      </q-tab-panels>

      <q-tab-panels
        v-model="tab"
        swipeable
        animated
        transition-prev="fade"
        transition-next="fade"
        class="q-mt-lg text-black text-center"
        style="height: 150px"
      >
        <q-tab-panel name="one">
          Tab One <br> Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident obcaecati repellendus dolores totam nostrum ut repudiandae perspiciatis est accusamus, eaque natus modi rem beatae optio cumque, velit ducimus autem magnam.
          <q-input v-model="text" />
          <input v-model="text">
          <q-btn dense round icon="map" class="absolute-bottom-right" />
          Tab One <br> Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident obcaecati repellendus dolores totam nostrum ut repudiandae perspiciatis est accusamus, eaque natus modi rem beatae optio cumque, velit ducimus autem magnam.
        </q-tab-panel>

        <q-tab-panel name="two">
          Tab Two <br> Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident obcaecati repellendus dolores totam nostrum ut repudiandae perspiciatis est accusamus, eaque natus modi rem beatae optio cumque, velit ducimus autem magnam.
          <q-input v-model="text" />
          <input v-model="text">
          <q-btn dense round icon="map" class="absolute-bottom-right" />
          Tab Two <br> Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident obcaecati repellendus dolores totam nostrum ut repudiandae perspiciatis est accusamus, eaque natus modi rem beatae optio cumque, velit ducimus autem magnam.
        </q-tab-panel>

        <q-tab-panel name="three">
          Tab Three <br> Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis labore inventore accusantium, perferendis eos sapiente culpa consectetur deserunt praesentium cumque distinctio placeat, recusandae id qui odit similique officia? Mollitia, ea!
        </q-tab-panel>

        <q-tab-panel disable name="four">
          Tab Four <br> Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis labore inventore accusantium, perferendis eos sapiente culpa consectetur deserunt praesentium cumque distinctio placeat, recusandae id qui odit similique officia? Mollitia, ea!
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      text: '',
      dense: false,
      tab: 'one',
      panelTest: false,
      some: false
    }
  },

  methods: {
    //
  }
}
</script>

<style lang="stylus">
.tabs-demo .q-tabs
  margin-bottom 24px
.tabs-demo .q-toolbar .q-tabs
  margin-bottom 0
</style>
