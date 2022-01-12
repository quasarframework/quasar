<template>
  <q-card class="q-pa-lg text-center column justify-between items-center full-height shadow-bottom-large">
    <q-card-section class="q-pa-none">
      <q-icon size="xl" :name="icon"/>
      <div class="text-uppercase text-bold text-lp-primary text-size-24 q-py-md">
        {{ title }}
      </div>
      <div class="text-lp-dark text-size-16 text-weight-medium q-pb-md">
        {{ body }}
      </div>
    </q-card-section>

    <q-card-section class="q-pa-none">
      <q-btn
          outline
          class="call-to-action-btn"
          color="lp-accent"
          :label="btnLabel"
          :to="btnLink"
      />
    </q-card-section>
  </q-card>
</template>
<script>
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    icon: {
      required: true,
      type: String
    },
    title: {
      required: true,
      type: String
    },
    body: {
      required: true,
      type: String
    },
    btnLabel: {
      required: true,
      type: String
    },
    btnLink: {
      required: true,
      type: String
    }
  },
  name: 'WhyQuasarCard'
})
</script>
