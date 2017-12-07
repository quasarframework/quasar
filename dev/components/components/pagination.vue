<template>
  <div>
    <div class="layout-padding">
      <div class="label bg-secondary text-white">
        Model <span class="right-detail"><em>{{page}}</em></span>
      </div>

      <p class="caption">
        You can also
        <span class="desktop-only">click</span>
        <span class="mobile-only">tap</span>
        on the Input box and type out another page number
        then hit &lt;ENTER&gt;
      </p>

      <q-pagination @change="onChange" @input="onInput" v-model="page"
        :min="min"
        :max="max"
        :boundaryLinks="boundaryLinks"
        :directionLinks="directionLinks"
        :input="inputType"
      />

      <p class="caption">Disabled State</p>
      <q-pagination @change="onChange" @input="onInput" v-model="page" disable
        :min="min"
        :max="max"
        :boundaryLinks="boundaryLinks"
        :directionLinks="directionLinks"
        :input="inputType"
      />

      <p class="caption">Page buttons</p>
      <q-pagination @change="onChange" @input="onInput" v-model="page" color="red" type="select"
        :min="min"
        :max="max"
        :boundaryLinks="boundaryLinks"
        :boundaryNumbers="boundaryNumbers"
        :directionLinks="directionLinks"
        :ellipses="ellipses"
        :maxPages="maxPages"
        :input="inputType"
      />

      <p class="caption">Page buttons - disabled</p>
      <q-pagination @change="onChange" @input="onInput" v-model="page" color="red" type="select" disable
        :min="min"
        :max="max"
        :boundaryLinks="boundaryLinks"
        :boundaryNumbers="boundaryNumbers"
        :directionLinks="directionLinks"
        :ellipses="ellipses"
        :maxPages="maxPages"
        :input="inputType"
      />

      <p class="caption">Configuration</p>
      <div class="row sm-gutter items-center">
        <div class="col-xs-12 col-sm-6 col-md-4 col-lg-3">
          <q-input type="number" v-model="min" stack-label="Minimum page number" />
        </div>
        <div class="col-xs-12 col-sm-6 col-md-4 col-lg-3">
          <q-input type="number" v-model="max" :min="min" stack-label="Maximum page number" />
        </div>
        <div class="col-xs-12 col-sm-6 col-md-4 col-lg-3">
          <q-select v-model="boundaryLinks" :options="options" stack-label="Show boundary buttons" />
        </div>
        <div class="col-xs-12 col-sm-6 col-md-4 col-lg-3">
          <q-select v-model="directionLinks" :options="options" stack-label="Show direction buttons" />
        </div>
        <div class="col-xs-12 col-sm-6 col-md-4 col-lg-3">
          <q-select v-model="boundaryNumbers" :options="options" stack-label="Always show first and last page" />
        </div>
        <div class="col-xs-12 col-sm-6 col-md-4 col-lg-3">
          <q-select v-model="ellipses" :options="options" stack-label="Show ellipses" />
        </div>
        <div class="col-xs-12 col-sm-6 col-md-4 col-lg-3">
          <q-input type="number" v-model="maxPages" stack-label="Maximum number of page buttons" />
        </div>
        <div class="col-xs-12 col-sm-6 col-md-4 col-lg-3">
          <q-toggle v-model="inputType" label="Input type" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      inputType: false,
      page: 1,
      min: 1,
      max: 17,
      boundaryLinks: null,
      boundaryNumbers: true,
      directionLinks: true,
      ellipses: null,
      maxPages: 5,
      options: [
        {label: 'Yes', value: true},
        {label: 'No', value: false},
        {label: 'Default', value: null}
      ]
    }
  },
  methods: {
    onChange (val) {
      console.log('@change', JSON.stringify(val))
    },
    onInput (val) {
      console.log('@input', JSON.stringify(val))
    }
  }
}
</script>
