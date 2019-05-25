<template>
  <div class="q-pa-md">
    <div class="q-gutter-md column" style="max-width: 300px">
      <q-field
        filled
        :hint="`Slider with value ${ slider }`"
        :value="slider"
        @input="val => (val === null && (slider = 50))"
        clearable
      >
        <template v-slot:control>
          <q-slider
            :value="slider"
            @change="val => { slider = val }"
            :min="0"
            :max="100"
            label
            label-always
            class="q-mt-lg"
          />
        </template>
      </q-field>

      <q-field
        filled
        :hint="`Range between ${ range.min } and ${ range.max }`"
        :value="range"
        @input="val => (val === null && (range = { min: 0, max: 100}))"
        clearable
      >
        <template v-slot:control>
          <q-range
            :value="range"
            @change="val => { range = val }"
            :min="0"
            :max="100"
          />
        </template>
      </q-field>

      <q-field
        filled
        :hint="`Knob with value ${ knob }`"
        :value="knob"
        @input="val => (val === null && (knob = 50))"
        clearable
      >
        <template v-slot:control>
          <div class="full-width">
            <q-knob
              :value="knob"
              @change="val => { knob = val }"
              :min="0"
              :max="100"
              size="72px"
              :thickness="1"
              color="light-blue"
              track-color="grey-8"
            />
          </div>
        </template>
      </q-field>

      <q-field filled :hint="`Calendar with value ${ date }`" label="Pick a date" stack-label>
        <template v-slot:control>
          <q-date class="q-mt-sm full-width" minimal v-model="date" />
        </template>
      </q-field>

      <q-field filled :hint="`Time with value ${ time }`" label="Pick a time" stack-label>
        <template v-slot:control>
          <div class="q-mt-sm full-width">
            <q-time v-model="time" />
          </div>
        </template>
      </q-field>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      slider: 50,
      range: {
        min: 10,
        max: 30
      },

      knob: 50,

      time: '',
      date: ''
    }
  }
}
</script>
