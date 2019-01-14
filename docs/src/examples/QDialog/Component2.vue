<template>
  <div class="q-layout-padding q-mx-auto">
    <div class="row justify-center">
      <div class="q-gutter-md" style="max-width: 700px">
        <q-btn label="Bar 2" flat color="primary" @click="bar2 = true" />
        <q-btn label="Toolbar" flat color="primary" @click="toolbar = true" />
        <q-btn label="Scroll" flat color="primary" @click="scroll = true" />
        <q-btn label="Scroll 2" flat color="primary" @click="scroll2 = true" />
        <q-btn label="Maximized" flat color="primary" @click="maximized = true" />
        <q-btn label="Positioned" flat color="primary" @click="positioned = true" />
      </div>
    </div>

    <q-dialog v-model="bar2" persistent transition-show="flip-down" transition-hide="flip-up">
      <q-card class="bg-primary text-white">
        <q-bar>
          <q-icon name="network_wifi" />
          <q-icon name="network_cell" />
          <q-icon name="battery_full" />
          <div>9:34</div>

          <q-space />

          <q-btn dense flat icon="close" v-close-dialog>
            <q-tooltip content-class="bg-white text-primary">Close</q-tooltip>
          </q-btn>
        </q-bar>

        <q-card-section>
          <div class="text-h6">Alert</div>
        </q-card-section>

        <q-card-section>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum repellendus sit voluptate voluptas eveniet porro. Rerum blanditiis perferendis totam, ea at omnis vel numquam exercitationem aut, natus minima, porro labore.
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="toolbar">
      <q-card>
        <q-toolbar>
          <q-avatar>
            <img src="statics/quasar-logo.png">
          </q-avatar>

          <q-toolbar-title><span class="text-weight-bold">Quasar</span> Framework</q-toolbar-title>

          <q-btn flat round dense icon="close" v-close-dialog />
        </q-toolbar>

        <q-card-section>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum repellendus sit voluptate voluptas eveniet porro. Rerum blanditiis perferendis totam, ea at omnis vel numquam exercitationem aut, natus minima, porro labore.
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
export default {
  methods: {
    openSpecialPosition (position) {
      this.$q.dialog({
        title: 'Positioned',
        message: `This dialog appears from ${position}.`,
        position
      })
    }
  },

  data () {
    return {
      bar2: false,
      toolbar: false,
      scroll: false,
      scroll2: false,
      maximized: false,
      positioned: false,

      maximizedToggle: true,

      address: '',

      moreContent: true,
      drawer: false,
      drawerR: false,

      slide: 1,
      lorem: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Natus, ratione eum minus fuga, quasi dicta facilis corporis magnam, suscipit at quo nostrum!',

      stars: 3,

      slideVol: 39,
      slideAlarm: 56,
      slideVibration: 63
    }
  },

  computed: {
    contentSize () {
      return this.moreContent ? 150 : 5
    }
  }
}
</script>
