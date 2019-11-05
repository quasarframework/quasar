<template>
  <div>
    <div class="q-layout-padding">
      <div class="label bg-secondary text-white">
        Model <span class="right-detail"><em>{{ model }}</em></span>
      </div>

      <p class="caption">
        Default (@input, @change)
      </p>
      <div class="q-gutter-sm">
        <q-knob
          v-model="model"
          :min="min"
          :max="max"
          @change="onChange"
          @input="onInput"
        />
        <q-knob
          v-model="model"
          :min="min"
          :max="max"
          :angle="90"
          @change="onChange"
        />
        <q-knob
          :value="model"
          :min="min"
          :max="max"
          :angle="90"
          @change="val => { model = val; onChange(val) }"
          @input="onInput"
        />
      </div>

      <p class="caption">
        With Step ({{ min }} to {{ max }}, step 10)
      </p>
      <q-knob
        v-model="model"
        :min="min"
        :max="max"
        :step="10"
      />

      <p class="caption">
        With Step ({{ min }} to {{ maxSmall }}, step 0.01)
      </p>
      <q-knob
        v-model="modelSmall"
        :min="min"
        :max="maxSmall"
        :step="0.01"
      />

      <p class="caption">
        With Step ({{ min }} to {{ max }}, step 0) -- {{ modelZero }}
      </p>
      <q-knob
        v-model="modelZero"
        :min="min"
        :max="max"
        :step="0"
      />

      <p class="caption">
        Styling
      </p>
      <div class="q-gutter-md">
        <q-knob
          v-model="model"
          size="150px"
          font-size="38px"
          color="red"
          :thickness="0.05"
          track-color="white"
          :min="min"
          :max="max"
        >
          $ {{ model }}
        </q-knob>

        <q-knob
          class="text-white"
          v-model="model"
          color="amber-7"
          track-color="transparent"
          center-color="grey-8"
          :thickness="0.2"
          :min="min"
          :max="max"
          :step="5"
        />

        <q-knob
          class="text-white"
          v-model="model"
          size="120px"
          font-size="42px"
          color="secondary"
          track-color="accent"
          :thickness="0.3"
          :min="min"
          :max="max"
          :step="5"
        >
          <q-icon name="euro_symbol" /> {{ model }}
        </q-knob>
      </div>

      <p class="caption">
        Readonly state
      </p>
      <q-knob
        v-model="model"
        :min="min"
        :max="max"
        color="primary"
        readonly
      >
        <q-icon name="volume_up" /> {{ model }}
      </q-knob>

      <p class="caption">
        Disabled state
      </p>
      <q-knob
        v-model="model"
        :min="min"
        :max="max"
        disable
      >
        <q-icon name="volume_up" /> {{ model }}
      </q-knob>

      <p class="caption">
        Icon and value added with default slot
      </p>
      <q-knob
        v-model="model"
        :thickness="0.15"
        color="blue-10"
        track-color="blue-3"
        :min="min"
        :max="max"
        size="75px"
        font-size="18px"
        show-value
        no-motion
      >
        <q-icon name="volume_up" /> {{ model }}
      </q-knob>

      <p class="caption">
        Inside Field
      </p>
      <q-field>
        <q-knob
          v-model="model"
          :min="min"
          :max="max"
        >
          <q-icon name="volume_up" /> {{ model }}
        </q-knob>

        <q-icon slot="before" name="cake" />
        <div slot="message">
          Touch to change
        </div>
      </q-field>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      model: 30,
      modelZero: 20.03,
      modelSmall: 1.1,
      min: 0,
      max: 50,
      maxSmall: 2
    }
  },
  watch: {
    model (val, old) {
      console.log(`Changed from ${JSON.stringify(old)} to ${JSON.stringify(val)}`)
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
