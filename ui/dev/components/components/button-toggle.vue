<template>
  <div class="q-layout-padding button-toggle-group-test">
    <p class="caption">
      <span>Model: </span>
      <strong>{{ model }}</strong>
    </p>

    <q-btn-toggle v-model="model" toggle-color="primary"
                  unelevated rounded
                  :options="[
                    {label: 'One', value: 'one'},
                    {label: 'Two', value: 'two'},
                    {label: 'Three', value: 'three'}
                  ]"
    />

    <q-btn-toggle v-model="model" toggle-color="primary" color="white" text-color="black"
                  spread no-caps
                  :options="[
                    {label: 'One', value: 'one'},
                    {label: 'Two', value: 'two'},
                    {label: 'Three', value: 'three'}
                  ]"
    />

    <q-btn-toggle v-model="model" toggle-color="primary"
                  outline rounded
                  :options="[
                    {label: 'One tooltip', value: 'one', slot: 'one'},
                    {label: 'Two tooltip', value: 'two', slot: 'two'},
                    {label: 'Three tooltip', value: 'three', slot: 'three'}
                  ]"
    >
      <template v-slot:one>
        <q-tooltip>One!</q-tooltip>
      </template>

      <template v-slot:two>
        <q-tooltip>Two!</q-tooltip>
      </template>

      <template v-slot:three>
        <q-tooltip>Three!</q-tooltip>
      </template>
    </q-btn-toggle>

    <q-btn-toggle v-model="model" toggle-color="primary"
                  push rounded
                  :options="[
                    {value: 'one', slot: 'one'},
                    {value: 'two', slot: 'two'},
                    {value: 'three', slot: 'three'}
                  ]"
    >
      <template v-slot:one>
        <div class="row items-center no-wrap">
          <q-icon left name="map" />
          <div class="text-center">
            Option<br>One
          </div>
        </div>
      </template>

      <template v-slot:two>
        <div class="row items-center no-wrap">
          <q-icon left name="map" />
          <div class="text-center">
            Option<br>Two
          </div>
        </div>
      </template>

      <template v-slot:three>
        <div class="row items-center no-wrap">
          <q-icon left name="map" />
          <div class="text-center">
            Option<br>Three
          </div>
        </div>
      </template>
    </q-btn-toggle>
  </div>
</template>

<script>
export default {
  data () {
    return {
      model: '',
      options: [true, false],
      sizes: ['sm', 'md', 'lg']
    }
  },
  methods: {
    log (name, data) {
      console.log(name, JSON.stringify(data))
    }
  }
}
</script>

<style lang="stylus">
.button-toggle-group-test .q-btn-toggle
  margin 15px
</style>
