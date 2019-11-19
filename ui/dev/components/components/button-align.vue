<template>
  <div class="q-layout-padding">
    <div class="row no-wrap q-col-gutter-x-md">
      <div v-for="type in ['a', 'button']" :key="type" class="col q-gutter-y-md">
        <div v-for="(prop, i) in props" :key="i" class="q-gutter-y-md">
          <div class="row q-gutter-md items-center">
            <q-btn :type="type" v-bind="prop" round icon="clear" color="primary" />
            <q-btn :type="type" v-bind="prop" icon="clear" color="primary" />
            <q-btn :type="type" v-bind="prop" icon="clear" color="primary" style="max-width: 0; min-height: 0" />
            <q-btn :type="type" v-bind="prop" icon="clear" label="Label" color="primary" />
            <q-btn :type="type" v-bind="prop" label="Label" color="primary" />
            <q-btn :type="type" v-bind="prop" size="sm" no-caps label="Label" color="primary" />
          </div>
          <q-btn :type="type" v-bind="prop" icon="clear" label="Label" color="primary" class="full-width" />
          <q-btn :type="type" v-bind="prop" icon="clear" label="Label" color="primary" class="full-width" align="left" />
          <q-btn :type="type" v-bind="prop" icon="clear" label="Label" color="primary" class="full-width" align="right" />
          <q-btn :type="type" v-bind="prop" icon-right="clear" label="Label" color="primary" class="full-width" />
          <q-btn :type="type" v-bind="prop" icon-right="clear" label="Label" color="primary" class="full-width" align="left" />
          <q-btn :type="type" v-bind="prop" icon-right="clear" label="Label" color="primary" class="full-width" align="right" />
          <q-btn :type="type" v-bind="prop" label="Label" color="primary" class="full-width" />
          <q-btn :type="type" v-bind="prop" label="Label" color="primary" class="full-width" align="left" />
          <q-btn :type="type" v-bind="prop" label="Label" color="primary" class="full-width" align="right" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      props: [
        {},
        { outline: true },
        { unelevated: true },
        { push: true },
        { flat: true }
      ]
    }
  }
}
</script>
