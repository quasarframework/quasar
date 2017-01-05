<template>
  <div>
    <div class="layout-padding">
      <div class="label bg-secondary text-white">
        Model <span class="right-detail"><em>{{model}}</em></span>
      </div>

      <p class="caption">Default</p>
      <q-knob
        v-model="model"
        :min="min"
        :max="max"
      ></q-knob>

      <p class="caption">With Step</p>
      <div class="group">
        <q-knob
          v-model="model"
          :min="min"
          :max="max"
          :step="10"
        ></q-knob>

        <p class="caption">Styling</p>
        <q-knob
          v-model="model"
          size="150px"
          color="red"
          line-width="2px"
          track-color="white"
          :min="min"
          :max="max"
          :placeholder="'$ ' + model"
        ></q-knob>

        <q-knob
          v-model="model"
          style="font-size: 3rem"
          color="#26a69a"
          :min="min"
          :max="max"
          :step="5"
        ></q-knob>

        <q-knob
          v-model="model"
          size="120px"
          style="font-size: 1.5rem"
          color="rgba(0, 0, 0, .8)"
          track-color="yellow"
          line-width="5px"
          :min="min"
          :max="max"
          :step="5"
          :placeholder="'<i>euro_symbol</i> ' + model"
        ></q-knob>
      </div>

      <p class="caption">Readonly state</p>
      <q-knob
        v-model="model"
        :min="min"
        :max="max"
        :placeholder="'<i>volume_up</i> ' + model"
        readonly
      ></q-knob>

      <p class="caption">Disabled state</p>
      <q-knob
        v-model="model"
        :min="min"
        :max="max"
        :placeholder="'<i>volume_up</i> ' + model"
        disable
      ></q-knob>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      model: 30,
      min: 0,
      max: 50
    }
  }
}
</script>
