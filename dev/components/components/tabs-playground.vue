<template>
  <div class="layout-padding tabs-playground">
    <!--
      This is for fast tests.
      Use this page but don't add it into your commits (leave it outside
      of your commit).

      For some test that you think it should be persistent,
      make a new *.vue file here or in another folder under /dev/components.
    -->
    <div class="group">
      <q-option-group
        type="radio"
        v-model="tab"
        :options="[
          {label: 'Oaua', value: 'three'},
          {label: 'Gogu', value: 'one'},
          {label: 'Gigi', value: 'two'},
          {label: 'Bogus', value: 'bogus'}
        ]"
      />
      <q-checkbox v-model="third" />
      <q-checkbox v-model="alert" />
    </div>

    <q-tabs>
      <q-tab alert slot="title" v-if="third" label="Oaua" />
      <q-tab count="5" slot="title" label="Gogu" />
      <q-tab slot="title" label="Some Tab" />
      <q-tab slot="title" label="Other Tab" />
      <q-tab default slot="title" label="Gigiiiiiiiii sdfsdfs aadsf asfsda" />
    </q-tabs>

    <q-tabs>
      <q-tab :alert="alert" default slot="title" hide="label" name="three" label="Oaua" icon="bluetooth" />
      <q-tab alert slot="title" hide="icon" name="one" label="Gogu" icon="wifi" />
      <q-tab alert slot="title" name="two" label="Gigiiiiiiiii sdfsdfs aadsf asfsda" icon="important_devices" />

      <q-tab-pane name="one">Tab One</q-tab-pane>
      <q-tab-pane name="two">Tab Two</q-tab-pane>
      <q-tab-pane name="three">Tab Three</q-tab-pane>
    </q-tabs>

    <p class="caption">Router tabs</p>
    <div class="row gutter-xs justify-stretch">
      <div class="col-12 col-sm-6 col-md">
        <q-btn class="fit" size="sm" color="secondary" @click="$router.push('/tabs/a#123')" label="/tabs/a#123 - select most specific tab" />
      </div>
      <div class="col-12 col-sm-6 col-md">
        <q-btn class="fit" size="sm" color="secondary" @click="$router.push('/tabs/a/a#123')" label="/tabs/a/a#123 - select most specific tab" />
      </div>
      <div class="col-12 col-sm-6 col-md">
        <q-btn class="fit" size="sm" color="secondary" @click="$router.push('/tabs/a/a')" label="/tabs/b#123 - select exact tab" />
      </div>
      <div class="col-12 col-sm-6 col-md">
        <q-btn class="fit" size="sm" color="secondary" @click="$router.push('/tabs/b#123')" label="/tabs/b#123 - select no tab" />
      </div>
    </div>
    <q-tabs class="test q-mt-sm" @input="onEvent('input', 'route', $event)" @select="onEvent('select', 'route', $event)" @click="onEvent('click', 'route', $event)">
      <q-route-tab slot="title" name="tabs" to="/tabs" exact label="/tabs" />
      <q-route-tab slot="title" name="tabs/a" to="/tabs/a" exact label="/tabs/a" />
      <q-route-tab slot="title" name="tabs/a *" to="/tabs/a" label="/tabs/a *" />
      <q-route-tab slot="title" name="tabs/a#1" to="/tabs/a#1" exact label="/tabs/a#1" />
      <q-route-tab slot="title" name="tabs/a/a" to="/tabs/a/a" exact label="/tabs/a/a" />
      <q-route-tab slot="title" name="tabs/a/a *" to="/tabs/a/a" label="/tabs/a/a *" />
      <q-route-tab slot="title" name="tabs/a/a#1" to="/tabs/a/a#1" exact label="/tabs/a/a#1" />
      <q-route-tab slot="title" name="tabs/a/b" to="/tabs/a/b" exact label="/tabs/a/b" />
      <q-route-tab slot="title" name="tabs/b" to="/tabs/b" exact label="/tabs/b" />
      <q-route-tab slot="title" name="tabs/b/a" to="/tabs/b/a" exact label="/tabs/b/a" />
      <q-route-tab slot="title" name="tabs/c" to="/tabs/c" exact label="/tabs/c" />
    </q-tabs>

    <q-tabs inverted>
      <q-tab alert slot="title" v-if="third" label="Oaua" />
      <q-tab count="5" slot="title" label="Gogu" />
      <q-tab slot="title" label="Some Tab" />
      <q-tab slot="title" label="Other Tab" />
      <q-tab default slot="title" label="Gigiiiiiiiii sdfsdfs aadsf asfsda" />
    </q-tabs>

    <p>Two lines</p>
    <q-tabs align="center" two-lines>
      <q-tab alert slot="title" v-if="third" label="Oaua" />
      <q-tab count="5" slot="title" label="Gogu" />
      <q-tab slot="title" label="Some Tab" />
      <q-tab slot="title" label="Other Tab" />
      <q-tab default slot="title" label="Gigiiiiiiiii sdfsdfs aadsf asfsda" />
    </q-tabs>

    <q-tabs align="right">
      <q-tab alert slot="title" v-if="third" label="Oaua" />
      <q-tab count="5" slot="title" label="Gogu" />
      <q-tab slot="title" label="Some Tab" />
      <q-tab slot="title" label="Other Tab" />
      <q-tab default slot="title" label="Gigiiiiiiiii sdfsdfs aadsf asfsda" />
    </q-tabs>

    <q-tabs color="brown" position="bottom">
      <q-tab default slot="title" v-if="third" name="three" label="Oaua" />
      <q-tab slot="title" name="one" label="Gogu" />
      <q-tab slot="title" name="two" label="Gigiiiiiiiii sdfsdfs aadsf asfsda" />

      <q-tab-pane name="one">Tab One</q-tab-pane>
      <q-tab-pane name="two">Tab Two</q-tab-pane>
      <q-tab-pane name="three">Tab Three</q-tab-pane>
    </q-tabs>

    <q-tabs v-model="tab" @select="onEvent('select', 'blue', $event)" @input="onEvent('input', 'blue', $event)">
      <q-tab alert slot="title" v-if="third" name="three" label="Oaua" />
      <q-tab count="5" slot="title" name="one" label="Gogu" />
      <q-tab default slot="title" name="two" label="Gigiiiiiiiii sdfsdfs aadsf asfsda" />

      <q-tab-pane name="one">Tab One</q-tab-pane>
      <q-tab-pane name="two">Tab Two</q-tab-pane>
      <q-tab-pane name="three">Tab Three</q-tab-pane>
    </q-tabs>

    <q-tabs
      v-for="align in ['left', 'center', 'right', 'justify']"
      :key="`${align}1`"
      v-model="tab"
      :align="align"
      color="purple"
      @select="onEvent('select', `purple_${ align }`, $event)" @input="onEvent('input', `purple_${ align }`, $event)"
    >
      <q-tab slot="title" v-if="third" name="three" label="Oaua" />
      <q-tab slot="title" name="one" label="Gogu" />
      <q-tab slot="title" name="two" label="Gigiiiiiiiii sdfsdfs aadsf asfsda" />

      <q-tab-pane name="one">Tab One</q-tab-pane>
      <q-tab-pane name="two">Tab Two</q-tab-pane>
      <q-tab-pane name="three">Tab Three</q-tab-pane>
    </q-tabs>

    <q-tabs
      v-for="align in ['left', 'center', 'right', 'justify']"
      :key="`${align}2`"
      :align="align"
      color="secondary"
    >
      <q-tab :alert="alert" default slot="title" v-if="third" name="three" icon="bluetooth" />
      <q-tab count="22" alert slot="title" name="one" icon="wifi" />
      <q-tab slot="title" name="two" icon="important_devices" />

      <q-tab-pane name="one">Tab One</q-tab-pane>
      <q-tab-pane name="two">Tab Two</q-tab-pane>
      <q-tab-pane name="three">Tab Three</q-tab-pane>
    </q-tabs>

    <q-tabs
      v-for="align in ['left', 'center', 'right', 'justify']"
      :key="`${align}3`"
      :align="align"
      color="amber"
      text-color="dark"
    >
      <q-tab :alert="alert" default slot="title" v-if="third" name="three" label="Oaua" icon="bluetooth" />
      <q-tab color="red" alert slot="title" name="one" label="Gogu" icon="wifi" />
      <q-tab color="black" alert slot="title" name="two" label="Gigiiiiiiiii sdfsdfs aadsf asfsda" icon="important_devices" />

      <q-tab-pane name="one">Tab One</q-tab-pane>
      <q-tab-pane name="two">Tab Two</q-tab-pane>
      <q-tab-pane name="three">Tab Three</q-tab-pane>
    </q-tabs>

    <q-tabs v-model="tab" inverted>
      <q-tab alert slot="title" v-if="third" name="three" label="Oaua" />
      <q-tab color="brown" count="5" slot="title" name="one" label="Gogu" />
      <q-tab color="red" default slot="title" name="two" label="Gigiiiiiiiii sdfsdfs aadsf asfsda" />

      <q-tab-pane name="one">Tab One</q-tab-pane>
      <q-tab-pane name="two">Tab Two</q-tab-pane>
      <q-tab-pane name="three">Tab Three</q-tab-pane>
    </q-tabs>

    <q-tabs inverted position="bottom">
      <q-tab alert slot="title" v-if="third" name="three" label="Oaua" />
      <q-tab count="5" slot="title" name="one" label="Gogu" />
      <q-tab default slot="title" name="two" label="Gigiiiiiiiii sdfsdfs aadsf asfsda" />

      <q-tab-pane name="one">Tab One</q-tab-pane>
      <q-tab-pane name="two">Tab Two</q-tab-pane>
      <q-tab-pane name="three">Tab Three</q-tab-pane>
    </q-tabs>

    <q-tabs
      v-for="align in ['left', 'center', 'right', 'justify']"
      :key="`${align}4`"
      v-model="tab"
      :align="align"
      color="purple"
      inverted
    >
      <q-tab slot="title" v-if="third" name="three" label="Oaua" />
      <q-tab slot="title" name="one" label="Gogu" />
      <q-tab color="red" slot="title" name="two" label="Gigiiiiiiiii sdfsdfs aadsf asfsda" />

      <q-tab-pane name="one">Tab One</q-tab-pane>
      <q-tab-pane name="two">Tab Two</q-tab-pane>
      <q-tab-pane name="three">Tab Three</q-tab-pane>
    </q-tabs>

    <q-tabs
      v-for="align in ['left', 'center', 'right', 'justify']"
      :key="`${align}5`"
      :align="align"
      color="secondary"
      inverted
    >
      <q-tab :alert="alert" default slot="title" v-if="third" name="three" icon="bluetooth" />
      <q-tab count="22" alert slot="title" name="one" icon="wifi" />
      <q-tab color="red" alert slot="title" name="two" icon="important_devices" />

      <q-tab-pane name="one">Tab One</q-tab-pane>
      <q-tab-pane name="two">Tab Two</q-tab-pane>
      <q-tab-pane name="three">Tab Three</q-tab-pane>
    </q-tabs>

    <q-tabs
      v-for="align in ['left', 'center', 'right', 'justify']"
      :key="`${align}6`"
      :align="align"
      color="amber"
      inverted
    >
      <q-tab :alert="alert" default slot="title" v-if="third" name="three" label="Oaua" icon="bluetooth" />
      <q-tab alert slot="title" name="one" label="Gogu" icon="wifi" />
      <q-tab color="red" alert slot="title" name="two" label="Gigiiiiiiiii sdfsdfs aadsf asfsda" icon="important_devices" />

      <q-tab-pane name="one">Tab One</q-tab-pane>
      <q-tab-pane name="two">Tab Two</q-tab-pane>
      <q-tab-pane name="three">Tab Three</q-tab-pane>
    </q-tabs>
  </div>
</template>

<script>
export default {
  data () {
    return {
      tab: 'one',
      third: true,
      alert: true,
      align: 'left',
      position: 'top',
      inverted: true,
      twoLines: false,
      noPaneBorder: false,
      glossy: false,
      tabStyles: {
        height: null,
        minHeight: null,
        maxHeight: null
      },
      tabs: {
        tab1: {
          tabStyles: {
            height: null,
            minHeight: null,
            maxHeight: null
          },
          default: true,
          name: 'Tab 1',
          count: 1
        },
        tab2: {
          tabStyles: {
            height: null,
            minHeight: null,
            maxHeight: null
          },
          name: 'Tab 2',
          count: 10
        },
        tab3: {
          tabStyles: {
            height: null,
            minHeight: null,
            maxHeight: null
          },
          name: 'Tab 3',
          count: 100
        },
        tab4: {
          tabStyles: {
            height: null,
            minHeight: null,
            maxHeight: null
          },
          name: 'Tab4WithVeryLongNameToScroll',
          count: 100
        },
        tab5: {
          tabStyles: {
            height: null,
            minHeight: null,
            maxHeight: null
          },
          name: 'Tab5WithVeryLongNameToScroll',
          count: 100
        },
        tab6: {
          tabStyles: {
            height: null,
            minHeight: null,
            maxHeight: null
          },
          name: 'Tab6WithVeryLongNameToScroll',
          count: 100
        },
        tab7: {
          tabStyles: {
            height: null,
            minHeight: null,
            maxHeight: null
          },
          name: 'Tab7WithVeryLongNameToScroll',
          count: 100
        }
      }
    }
  },
  methods: {
    onEvent (event, source, payload) {
      console.log(source, event, payload)
    }
  }
}
</script>

<style lang="stylus">
  .tabs-playground .q-tabs
    margin-bottom 25px
  .test
    .q-router-link-active, .q-router-link-exact-active
      &:after
        position absolute
        top 0
    .q-router-link-active:after
      content '=='
      color #f99
    .q-router-link-exact-active:after
      content '==='
      color #0f0
</style>
