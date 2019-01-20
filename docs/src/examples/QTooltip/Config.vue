<template>
  <div class="q-pa-md">
    <q-card>
      <q-card-section class="bg-primary text-center">
        <q-btn push color="orange" label="Mouse Hover">
          <q-tooltip :anchor="anchor" :self="self">
            <div>Quasar is <strong>great</strong>!</div>
            <div class="text-center">Try it.</div>
          </q-tooltip>
        </q-btn>
      </q-card-section>

      <q-card-section>
        <p class="text-weight-bold text-center q-my-md">Configure the Tooltip for button above.</p>
        <div class="text-center">
          <q-chip tag color="primary" text-color="white">anchor="{{ anchor }}"</q-chip>
          <q-chip tag color="primary" text-color="white">self="{{ self }}"</q-chip>
        </div>
      </q-card-section>

      <q-card-section class="row">
        <div class="column items-center col-6">
          <p class="text-weight-bold">Anchor Origin</p>
          <div class="flex q-gutter-sm">
            <div class="column">
              <div>Vertical</div>
              <q-radio v-model="anchorOrigin.vertical" val="top" label="Top"/>
              <q-radio v-model="anchorOrigin.vertical" val="center" label="Center"/>
              <q-radio v-model="anchorOrigin.vertical" val="bottom" label="Bottom"/>
            </div>
            <div class="column">
              <div>Horizontal</div>
              <q-radio v-model="anchorOrigin.horizontal" val="left" label="Left"/>
              <q-radio v-model="anchorOrigin.horizontal" val="middle" label="Middle"/>
              <q-radio v-model="anchorOrigin.horizontal" val="right" label="Right"/>
            </div>
          </div>
        </div>

        <div class="column items-center col-6">
          <p class="text-weight-bold">Self Origin</p>
          <div class="flex q-gutter-sm">
            <div class="column">
              <div>Vertical</div>
              <q-radio v-model="selfOrigin.vertical" val="top" label="Top"/>
              <q-radio v-model="selfOrigin.vertical" val="center" label="Center"/>
              <q-radio v-model="selfOrigin.vertical" val="bottom" label="Bottom"/>
            </div>
            <div class="column">
              <div>Horizontal</div>
              <q-radio v-model="selfOrigin.horizontal" val="left" label="Left"/>
              <q-radio v-model="selfOrigin.horizontal" val="middle" label="Middle"/>
              <q-radio v-model="selfOrigin.horizontal" val="right" label="Right"/>
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      anchorOrigin: { vertical: 'bottom', horizontal: 'middle' },
      selfOrigin: { vertical: 'top', horizontal: 'middle' }
    }
  },
  computed: {
    anchor () {
      return `${this.anchorOrigin.vertical} ${this.anchorOrigin.horizontal}`
    },
    self () {
      return `${this.selfOrigin.vertical} ${this.selfOrigin.horizontal}`
    }
  }
}
</script>
