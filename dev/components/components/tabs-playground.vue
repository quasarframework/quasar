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
      <q-input-group
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
      <q-tab selected slot="title" label="Gigiiiiiiiii sdfsdfs aadsf asfsda" />
    </q-tabs>

    <q-tabs inverted>
      <q-tab alert slot="title" v-if="third" label="Oaua" />
      <q-tab count="5" slot="title" label="Gogu" />
      <q-tab slot="title" label="Some Tab" />
      <q-tab slot="title" label="Other Tab" />
      <q-tab selected slot="title" label="Gigiiiiiiiii sdfsdfs aadsf asfsda" />
    </q-tabs>

    <p>Two lines</p>
    <q-tabs align="center" two-lines>
      <q-tab alert slot="title" v-if="third" label="Oaua" />
      <q-tab count="5" slot="title" label="Gogu" />
      <q-tab slot="title" label="Some Tab" />
      <q-tab slot="title" label="Other Tab" />
      <q-tab selected slot="title" label="Gigiiiiiiiii sdfsdfs aadsf asfsda" />
    </q-tabs>

    <q-tabs align="right">
      <q-tab alert slot="title" v-if="third" label="Oaua" />
      <q-tab count="5" slot="title" label="Gogu" />
      <q-tab slot="title" label="Some Tab" />
      <q-tab slot="title" label="Other Tab" />
      <q-tab selected slot="title" label="Gigiiiiiiiii sdfsdfs aadsf asfsda" />
    </q-tabs>

    <q-tabs color="brown" position="bottom">
      <q-tab selected slot="title" v-if="third" name="three" label="Oaua" />
      <q-tab slot="title" name="one" label="Gogu" />
      <q-tab slot="title" name="two" label="Gigiiiiiiiii sdfsdfs aadsf asfsda" />

      <q-tab-pane name="one">Tab One</q-tab-pane>
      <q-tab-pane name="two">Tab Two</q-tab-pane>
      <q-tab-pane name="three">Tab Three</q-tab-pane>
    </q-tabs>

    <q-tabs v-model="tab">
      <q-tab alert slot="title" v-if="third" name="three" label="Oaua" />
      <q-tab count="5" slot="title" name="one" label="Gogu" />
      <q-tab selected slot="title" name="two" label="Gigiiiiiiiii sdfsdfs aadsf asfsda" />

      <q-tab-pane name="one">Tab One</q-tab-pane>
      <q-tab-pane name="two">Tab Two</q-tab-pane>
      <q-tab-pane name="three">Tab Three</q-tab-pane>
    </q-tabs>

    <q-tabs
      v-for="align in ['left', 'center', 'right', 'justify']"
      :key="align"
      v-model="tab"
      :align="align"
      color="purple"
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
      :key="align"
      :align="align"
      color="secondary"
    >
      <q-tab :alert="alert" selected slot="title" v-if="third" name="three" icon="bluetooth" />
      <q-tab count="22" alert slot="title" name="one" icon="wifi" />
      <q-tab slot="title" name="two" icon="important_devices" />

      <q-tab-pane name="one">Tab One</q-tab-pane>
      <q-tab-pane name="two">Tab Two</q-tab-pane>
      <q-tab-pane name="three">Tab Three</q-tab-pane>
    </q-tabs>

    <q-tabs
      v-for="align in ['left', 'center', 'right', 'justify']"
      :key="align"
      :align="align"
      color="amber"
    >
      <q-tab :alert="alert" selected slot="title" v-if="third" name="three" label="Oaua" icon="bluetooth" />
      <q-tab color="red" alert slot="title" name="one" label="Gogu" icon="wifi" />
      <q-tab color="black" alert slot="title" name="two" label="Gigiiiiiiiii sdfsdfs aadsf asfsda" icon="important_devices" />

      <q-tab-pane name="one">Tab One</q-tab-pane>
      <q-tab-pane name="two">Tab Two</q-tab-pane>
      <q-tab-pane name="three">Tab Three</q-tab-pane>
    </q-tabs>

    <q-tabs v-model="tab" inverted>
      <q-tab alert slot="title" v-if="third" name="three" label="Oaua" />
      <q-tab count="5" slot="title" name="one" label="Gogu" />
      <q-tab color="red" selected slot="title" name="two" label="Gigiiiiiiiii sdfsdfs aadsf asfsda" />

      <q-tab-pane name="one">Tab One</q-tab-pane>
      <q-tab-pane name="two">Tab Two</q-tab-pane>
      <q-tab-pane name="three">Tab Three</q-tab-pane>
    </q-tabs>

    <q-tabs inverted position="bottom">
      <q-tab alert slot="title" v-if="third" name="three" label="Oaua" />
      <q-tab count="5" slot="title" name="one" label="Gogu" />
      <q-tab selected slot="title" name="two" label="Gigiiiiiiiii sdfsdfs aadsf asfsda" />

      <q-tab-pane name="one">Tab One</q-tab-pane>
      <q-tab-pane name="two">Tab Two</q-tab-pane>
      <q-tab-pane name="three">Tab Three</q-tab-pane>
    </q-tabs>

    <q-tabs
      v-for="align in ['left', 'center', 'right', 'justify']"
      :key="align"
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
      :key="align"
      :align="align"
      color="secondary"
      inverted
    >
      <q-tab :alert="alert" selected slot="title" v-if="third" name="three" icon="bluetooth" />
      <q-tab count="22" alert slot="title" name="one" icon="wifi" />
      <q-tab color="red" alert slot="title" name="two" icon="important_devices" />

      <q-tab-pane name="one">Tab One</q-tab-pane>
      <q-tab-pane name="two">Tab Two</q-tab-pane>
      <q-tab-pane name="three">Tab Three</q-tab-pane>
    </q-tabs>

    <q-tabs
      v-for="align in ['left', 'center', 'right', 'justify']"
      :key="align"
      :align="align"
      color="amber"
      inverted
    >
      <q-tab :alert="alert" selected slot="title" v-if="third" name="three" label="Oaua" icon="bluetooth" />
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
      alert: true
    }
  }
}
</script>

<style lang="styl">
.tabs-playground .q-tabs
  margin-bottom 25px
</style>
