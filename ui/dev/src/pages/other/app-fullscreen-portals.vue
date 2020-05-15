<template>
  <q-card flat class="bg-grey-2">
    <q-card-section class="text-center q-pt-xl">
      <q-btn
        icon="aspect_ratio"
        label="Fullscreen all"
        flat
        color="primary"
        @click="fullscreenAll"
      />

      <q-btn
        icon="aspect_ratio"
        label="Fullscreen tooltip"
        flat
        color="primary"
        @click="fullscreenTooltip"
      />

      <q-btn
        icon="aspect_ratio"
        label="Fullscreen none"
        flat
        color="primary"
        @click="fullscreenNone"
      />

      <div ref="tooltip">
        <h4 class="text-grey q-mb-sm" @click="fullscreenTooltip">
          Hover to see tooltip
          <q-tooltip>Tooltip</q-tooltip>
        </h4>
      </div>

      <q-btn-dropdown no-caps color="primary" class="q-mt-sm" label="Btn dropdown">
        <q-list dense>
          <q-item clickable v-close-popup class="text-caption text-weight-bold">
            <q-item-section>
              <q-item-label>Item type 1</q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable v-close-popup class="text-caption text-weight-bold">
            <q-item-section>
              <q-item-label>Item type 2</q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable v-close-popup class="text-caption text-weight-bold">
            <q-item-section>
              <q-item-label>Item type 3</q-item-label>
            </q-item-section>
          </q-item>
          <div class="column">
            <q-btn
              stretch
              icon="aspect_ratio"
              label="Fullscreen All"
              flat
              color="primary"
              @click="fullscreenAll"
            />
          </div>
          <div class="column">
            <q-btn
              stretch
              icon="aspect_ratio"
              label="Fullscreen Tooltip"
              flat
              color="primary"
              @click="fullscreenTooltip"
            />
          </div>
          <div class="column">
            <q-btn
              stretch
              icon="aspect_ratio"
              label="Fullscreen None"
              flat
              color="primary"
              @click="fullscreenNone"
            />
          </div>
        </q-list>
      </q-btn-dropdown>

      <q-select
        v-model="model"
        :options="options"
        label="Select"
      />
    </q-card-section>
  </q-card>
</template>

<script>
export default {
  data () {
    return {
      model: null,
      options: ['Option 1', 'Option 2', 'Option 3']
    }
  },
  methods: {
    fullscreenAll () {
      this.$q.fullscreen
        .exit()
        .catch(() => {})
        .then(() => {
          setTimeout(() => {
            this.$q.fullscreen
              .request(this.$el)
              .catch(() => {})
          })
        })
    },

    fullscreenTooltip () {
      this.$q.fullscreen
        .exit()
        .catch(() => {})
        .then(() => {
          setTimeout(() => {
            this.$q.fullscreen
              .request(this.$refs.tooltip)
              .catch(() => {})
          })
        })
    },

    fullscreenNone () {
      this.$q.fullscreen.exit()
    }
  }
}
</script>
