<template>
  <div class="q-pa-md q-gutter-sm">
    <q-btn label="With QBar" color="primary" @click="bar = true" />
    <q-btn label="Another QBar" color="primary" @click="bar2 = true" />

    <q-dialog v-model="bar" persistent>
      <q-card>
        <q-bar>
          <q-icon name="arrow_forward" />
          <div>Your Next Steps</div>

          <q-space />

          <q-btn dense flat icon="close" v-close-dialog>
            <q-tooltip>Close</q-tooltip>
          </q-btn>
        </q-bar>

        <q-card-section>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum repellendus sit voluptate voluptas eveniet porro. Rerum blanditiis perferendis totam, ea at omnis vel numquam exercitationem aut, natus minima, porro labore.
        </q-card-section>

        <q-card-section>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum repellendus sit voluptate voluptas eveniet porro. Rerum blanditiis perferendis totam, ea at omnis vel numquam exercitationem aut, natus minima, porro labore.
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="bar2" persistent transition-show="flip-down" transition-hide="flip-up">
      <q-card class="bg-primary text-white">
        <q-bar>
          <q-icon name="warning" />
          <div>Are you certain?</div>

          <q-space />

          <q-btn dense flat icon="close" v-close-dialog>
            <q-tooltip content-class="bg-white text-primary">Close</q-tooltip>
          </q-btn>
        </q-bar>

        <q-card-section>
          <div class="text-h6">Last Chance!</div>
        </q-card-section>

        <q-card-section>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum repellendus sit voluptate voluptas eveniet porro. Rerum blanditiis perferendis totam, ea at omnis vel numquam exercitationem aut, natus minima, porro labore.
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      bar: false,
      bar2: false
    }
  }
}
</script>
