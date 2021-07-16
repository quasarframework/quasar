<template>
  <div class="q-layout-padding button-toggle-group-test">
    <p class="caption">
      <span>Model: </span>
      <strong>{{ model }}</strong>
    </p>

    <q-btn-toggle
      v-model="model"
      toggle-color="primary"
      unelevated
      rounded
      :options="optionsO1"
    />

    <q-btn-toggle
      v-model="model"
      toggle-color="primary"
      color="white"
      text-color="black"
      spread
      no-caps
      :options="optionsO1"
    />

    <div class="row">
      <q-btn-toggle
        class="col"
        v-model="model"
        toggle-color="primary"
        push
        rounded
        :options="optionsO1"
      />
    </div>

    <div class="row">
      <q-btn-toggle
        class="col"
        v-model="model"
        toggle-color="primary"
        push
        rounded
        :options="optionsO3"
      />
    </div>

    <q-btn-toggle
      v-model="model"
      toggle-color="primary"
      outline
      rounded
      :options="optionsS1"
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

    <q-btn-toggle
      v-model="model"
      toggle-color="primary"
      push
      rounded
      :options="optionsS2"
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

    <q-btn-toggle
      v-model="model"
      :options="optionsO2"
      clearable
    />

    <q-btn-toggle
      :model-value="modelD"
      @update:model-value="updateD"
      toggle-color="primary"
      unelevated
      rounded
      :options="optionsD"
    />
  </div>
</template>

<script>
export default {
  data () {
    return {
      model: '',
      modelD: '',
      options: [ true, false ],
      optionsO1: [
        { label: 'One', value: 'one' },
        { label: 'Two - this one has a longer label', value: 'two' },
        { label: 'Three', value: 'three' }
      ],
      optionsO2: [
        { label: 'One Clearable', value: 'one', size: '32px', attrs: { 'aria-label': 'Button' } },
        { label: 'Two', value: 'two', padding: '32px 64px' }
      ],
      optionsO3: [
        { label: 'One', value: 'one', color: 'green-2', textColor: 'black', class: 'col-grow' },
        { label: 'Two - this one has a longer label', value: 'two', color: 'red-2', textColor: 'black' },
        { label: 'Three', value: 'three', color: 'blue-2', textColor: 'black', class: 'col-grow' }
      ],
      optionsS1: [
        { label: 'One tooltip', value: 'one', slot: 'one' },
        { label: 'Two tooltip', value: 'two', slot: 'two' },
        { label: 'Three tooltip', value: 'three', slot: 'three' }
      ],
      optionsS2: [
        { value: 'one', slot: 'one' },
        { value: 'two', slot: 'two' },
        { value: 'three', slot: 'three' }
      ],
      optionsD: [
        { label: 'One', value: 'one', count: 0 },
        { label: 'Two', value: 'two', count: 0 },
        { label: 'Three', value: 'three', count: 0 }
      ],
      sizes: [ 'sm', 'md', 'lg' ]
    }
  },
  methods: {
    log (name, data) {
      console.log(name, JSON.stringify(data))
    },

    updateD (value, opt) {
      this.modelD = value
      opt.count++
    }
  }
}
</script>

<style lang="sass">
.button-toggle-group-test .q-btn-toggle
  margin: 15px
</style>
