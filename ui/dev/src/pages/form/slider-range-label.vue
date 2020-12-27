<template>
  <div class="column no-wrap" style="height: 100vh" :class="dark ? 'bg-black text-white' : ''">
    <div class="q-gutter-x-md row q-pa-xs shadow-2">
      <q-toggle v-model="dark" :dark="dark" :dense="dense" label="Dark" :false-value="null" />
      <q-toggle v-model="dense" :dark="dark" :dense="dense" label="Dense" />
      <q-toggle v-model="defaultLabels" :dark="dark" :dense="dense" label="Default labels" />
      <q-input outlined class="col" v-model="labelLeftTemplate" label="Left label template - use {model}" />
      <q-input outlined class="col" v-model="labelRightTemplate" label="Right label template - use {model}" />
    </div>

    <div class="col scroll q-px-lg q-py-xl">
      <div class="q-gutter-y-md">
        <div class="bg-red q-mb-xl">
          <q-badge label="Needed label" />
          <q-range
            :dark="dark"
            :dense="dense"
            v-model="rangeModel"
            :min="0"
            :max="50"
            :step="0"
            label
            left-label-color="light-green-8"
            right-label-color="light-blue-8"
            label-always
            :left-label-value="labelLeftValue(rangeModel.min)"
            :right-label-value="labelRightValue(rangeModel.max)"
          />
        </div>

        <q-range
          :dark="dark"
          :dense="dense"
          v-model="rangeModel"
          :min="0"
          :max="50"
          :step="0"
          label
          left-label-color="light-green-8"
          right-label-color="light-blue-8"
          label-always
          :left-label-value="labelLeftValue(rangeModel.min)"
          :right-label-value="labelRightValue(rangeModel.max)"
        />

        <q-range
          :dark="dark"
          :dense="dense"
          v-model="rangeModel"
          :min="0"
          :max="50"
          :step="0"
          label
          left-label-color="light-green-8"
          right-label-color="light-blue-8"
          :left-label-value="labelLeftValue(rangeModel.min)"
          :right-label-value="labelRightValue(rangeModel.max)"
        />

        <q-range
          :dark="dark"
          :dense="dense"
          v-model="rangeModel"
          :min="0"
          :max="50"
          :step="0"
          color="deep-orange"
          reverse
          label
          label-always
          left-label-color="light-green-8"
          right-label-color="light-blue-8"
          :left-label-value="labelLeftValue(rangeModel.min)"
          :right-label-value="labelRightValue(rangeModel.max)"
        />

        <q-range
          :dark="dark"
          :dense="dense"
          v-model="rangeModel"
          :min="0"
          :max="50"
          :step="0"
          color="deep-orange"
          reverse
          label
          left-label-color="light-green-8"
          right-label-color="light-blue-8"
          :left-label-value="labelLeftValue(rangeModel.min)"
          :right-label-value="labelRightValue(rangeModel.max)"
        />

        <q-range
          :dark="dark"
          :dense="dense"
          v-model="rangeModel"
          :min="0"
          :max="50"
          :step="0"
          label
          label-always
          left-label-color="light-green-8"
          right-label-color="light-blue-8"
        />

        <q-range
          :dark="dark"
          :dense="dense"
          v-model="rangeModel"
          :min="0"
          :max="50"
          :step="0"
          label
          left-label-color="light-green-8"
          right-label-color="light-blue-8"
        />

        <q-range
          :dark="dark"
          :dense="dense"
          v-model="rangeModel"
          :min="0"
          :max="50"
          :step="0"
          color="deep-orange"
          reverse
          label
          label-always
          left-label-color="light-green-8"
          right-label-color="light-blue-8"
        />

        <q-range
          :dark="dark"
          :dense="dense"
          v-model="rangeModel"
          :min="0"
          :max="50"
          :step="0"
          color="deep-orange"
          reverse
          label
          left-label-color="light-green-8"
          right-label-color="light-blue-8"
        />

        <q-range
          :dark="dark"
          :dense="dense"
          v-model="rangeModel"
          :min="0"
          :max="50"
          :step="0"
          label
          label-always
          left-label-color="light-green-8"
          right-label-color="light-blue-8"
          left-label-value="Lorem ipsum dolor sit amet consectetur, adipisicing elit"
          right-label-value="Qui eos possimus modi vel, distinctio incidunt cumque pariatur fugiat"
        />

        <q-range
          :dark="dark"
          :dense="dense"
          v-model="rangeModel"
          :min="0"
          :max="50"
          :step="0"
          label
          left-label-color="light-green-8"
          right-label-color="light-blue-8"
          left-label-value="Lorem ipsum dolor sit amet consectetur, adipisicing elit"
          right-label-value="Qui eos possimus modi vel, distinctio incidunt cumque pariatur fugiat"
        />

        <q-range
          :dark="dark"
          :dense="dense"
          v-model="rangeModel"
          :min="0"
          :max="50"
          :step="0"
          color="deep-orange"
          reverse
          label
          label-always
          left-label-color="light-green-8"
          right-label-color="light-blue-8"
          left-label-value="Lorem ipsum dolor sit amet consectetur, adipisicing elit"
          right-label-value="Qui eos possimus modi vel, distinctio incidunt cumque pariatur fugiat"
        />

        <q-range
          :dark="dark"
          :dense="dense"
          v-model="rangeModel"
          :min="0"
          :max="50"
          :step="0"
          color="deep-orange"
          reverse
          label
          left-label-color="light-green-8"
          right-label-color="light-blue-8"
          left-label-value="Lorem ipsum dolor sit amet consectetur, adipisicing elit"
          right-label-value="Qui eos possimus modi vel, distinctio incidunt cumque pariatur fugiat"
        />

        <q-slider
          :dark="dark"
          :dense="dense"
          v-model="sliderModel"
          :min="0"
          :max="50"
          :step="0"
          label
          label-color="light-green-8"
          label-always
          :label-value="labelLeftValue(sliderModel)"
        />

        <q-slider
          :dark="dark"
          :dense="dense"
          v-model="sliderModel"
          :min="0"
          :max="50"
          :step="0"
          label
          label-color="light-green-8"
          :label-value="labelLeftValue(sliderModel)"
        />

        <q-slider
          :dark="dark"
          :dense="dense"
          v-model="sliderModel"
          :min="0"
          :max="50"
          :step="0"
          color="deep-orange"
          reverse
          label
          label-always
          label-color="light-green-8"
          :label-value="labelLeftValue(sliderModel)"
        />

        <q-slider
          :dark="dark"
          :dense="dense"
          v-model="sliderModel"
          :min="0"
          :max="50"
          :step="0"
          color="deep-orange"
          reverse
          label
          label-color="light-green-8"
          :label-value="labelLeftValue(sliderModel)"
        />

        <q-slider
          :dark="dark"
          :dense="dense"
          v-model="sliderModel"
          :min="0"
          :max="50"
          :step="0"
          label
          label-always
          label-color="light-green-8"
        />
        <q-slider
          :dark="dark"
          :dense="dense"
          v-model="sliderModel"
          :min="0"
          :max="50"
          :step="0"
          label
          label-color="light-green-8"
        />
        <q-slider
          :dark="dark"
          :dense="dense"
          v-model="sliderModel"
          :min="0"
          :max="50"
          :step="0"
          color="deep-orange"
          reverse
          label
          label-always
          label-color="light-green-8"
        />
        <q-slider
          :dark="dark"
          :dense="dense"
          v-model="sliderModel"
          :min="0"
          :max="50"
          :step="0"
          color="deep-orange"
          reverse
          label
          label-color="light-green-8"
        />
        <q-slider
          :dark="dark"
          :dense="dense"
          v-model="sliderModel"
          :min="0"
          :max="50"
          :step="0"
          label
          label-always
          label-color="light-green-8"
          label-value="Lorem ipsum dolor sit amet consectetur, adipisicing elit"
        />

        <q-slider
          :dark="dark"
          :dense="dense"
          v-model="sliderModel"
          :min="0"
          :max="50"
          :step="0"
          label
          label-color="light-green-8"
          label-value="Lorem ipsum dolor sit amet consectetur, adipisicing elit"
        />

        <q-slider
          :dark="dark"
          :dense="dense"
          v-model="sliderModel"
          :min="0"
          :max="50"
          :step="0"
          color="deep-orange"
          reverse
          label
          label-always
          label-color="light-green-8"
          label-value="Lorem ipsum dolor sit amet consectetur, adipisicing elit"
        />

        <q-slider
          :dark="dark"
          :dense="dense"
          v-model="sliderModel"
          :min="0"
          :max="50"
          :step="0"
          color="deep-orange"
          reverse
          label
          label-color="light-green-8"
          label-value="Lorem ipsum dolor sit amet consectetur, adipisicing elit"
        />

        <q-list>
          <q-item>
            <q-item-section avatar>
              <q-icon name="local_atm" />
            </q-item-section>
            <q-item-section>
              <q-range
                :dark="dark"
                :dense="dense"
                v-model="rangeModel"
                :min="0"
                :max="50"
                :step="0"
                label
                left-label-color="light-green-8"
                right-label-color="light-blue-8"
                :left-label-value="labelLeftValue(rangeModel.min)"
                :right-label-value="labelRightValue(rangeModel.max)"
              />
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section avatar>
              <q-icon name="euro_symbol" />
            </q-item-section>
            <q-item-section>
              <q-range
                :dark="dark"
                :dense="dense"
                v-model="rangeModel"
                :min="0"
                :max="50"
                :step="0"
                label
                label-always
                left-label-color="light-green-8"
                right-label-color="light-blue-8"
                :left-label-value="labelLeftValue(rangeModel.min)"
                :right-label-value="labelRightValue(rangeModel.max)"
              />
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section avatar>
              <q-icon name="local_atm" />
            </q-item-section>
            <q-item-section>
              <q-slider
                :dark="dark"
                :dense="dense"
                v-model="sliderModel"
                :min="0"
                :max="50"
                :step="0"
                label
                label-color="light-green-8"
                :label-value="labelLeftValue(sliderModel)"
              />
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section avatar>
              <q-icon name="euro_symbol" />
            </q-item-section>
            <q-item-section>
              <q-slider
                :dark="dark"
                :dense="dense"
                v-model="sliderModel"
                :min="0"
                :max="50"
                :step="0"
                label
                label-always
                label-color="light-green-8"
                :label-value="labelLeftValue(sliderModel)"
              />
            </q-item-section>
          </q-item>
        </q-list>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      dark: null,
      dense: false,

      defaultLabels: false,
      labelLeftTemplate: 'Current left value: {model}',
      labelRightTemplate: 'Current right value: {model}',

      sliderModel: 10,
      rangeModel: {
        min: 10,
        max: 35
      }
    }
  },
  computed: {
    labelLeftValue () {
      return this.defaultLabels === true
        ? () => void 0
        : model => this.labelLeftTemplate.split('{model}').join(model)
    },

    labelRightValue () {
      return this.defaultLabels === true
        ? () => void 0
        : model => this.labelRightTemplate.split('{model}').join(model)
    }
  }
}
</script>
