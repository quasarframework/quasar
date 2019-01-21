<template>
  <div>
    <div class="q-layout-padding" style="max-width: 100%;">

      <q-card style="margin-top: 25px">
        <q-card-section class="text-center">
          <q-btn color="primary" text-color="white" @click="trigger()">Trigger Event</q-btn>
        </q-card-section>
        <q-separator />
        <p class="caption text-center">Try out different combinations to change the Ajax Bar effect.</p>
        <q-card-section>

          <div class="text-subtitle1">Position</div>
          <div class="flex">
            <div class="column">
              <q-radio v-model="position" val="top" label="Top" />
              <q-radio v-model="position" val="bottom" label="Bottom" />
            </div>

            <div class="column">
              <q-radio v-model="position" val="right" label="Right" />
              <q-radio v-model="position" val="left" label="Left" />
            </div>
          </div>

          <div class="text-subtitle1 q-mt-md">Reverse?</div>
          <q-checkbox v-model="reverse" label="Reverse Direction" />

          <div class="text-subtitle1 q-mt-md">Select a Color:</div>
            <q-select
              v-model="selectedColor"
              :options="objectOptions"
            >
              <q-chip
                slot="selected"
                slot-scope="scope"
                color="white"
                text-color="primary"
              >
                <q-avatar rounded :color="scope.opt.value" text-color="white" />
                <span v-html="scope.opt.label" style="color: black;" />
              </q-chip>

              <q-item
                slot="option"
                slot-scope="scope"
                v-bind="scope.itemProps"
                v-on="scope.itemEvents"
              >
                <q-item-section avatar>
                  <q-avatar size="16px" rounded :color="scope.opt.value" />
                </q-item-section>
                <q-item-section>
                  <q-item-label v-html="scope.opt.label" />
                </q-item-section>
              </q-item>
            </q-select>

          <div class="text-subtitle1 q-mt-md">Size</div>
          <q-slider class="q-mt-md" v-model="size" :min="2" :max="20" label-always :label-value="`${size}px`" />
        </q-card-section>
      </q-card>
    </div>
    <q-ajax-bar ref="bar" :color="selectedColor.value" :position="position" :reverse="reverse" :size="computedSize" />
  </div>
</template>

<script>
const objectOptions = [
  {
    label: 'Primary',
    value: 'primary'
  },
  {
    label: 'Secondary',
    value: 'secondary'
  },
  {
    label: 'Tertiary',
    value: 'tertiary'
  },
  {
    label: 'Positive',
    value: 'positive'
  },
  {
    label: 'Negative',
    value: 'negative'
  },
  {
    label: 'Info',
    value: 'info'
  },
  {
    label: 'Warning',
    value: 'warning'
  },
  {
    label: 'Black',
    value: 'black'
  }
]

export default {
  data () {
    return {
      position: 'top',
      reverse: false,
      size: 5,
      objectOptions,

      timeouts: [],
      selectedColor: {
        label: 'Negative',
        value: 'negative'
      }
    }
  },
  computed: {
    computedSize () {
      return this.size + 'px'
    }
  },
  methods: {
    trigger () {
      this.$refs.bar.start()

      setTimeout(() => {
        if (this.$refs.bar) {
          this.$refs.bar.stop()
        }
      }, Math.random() * 3000 + 1000)
    }
  }
}
</script>
