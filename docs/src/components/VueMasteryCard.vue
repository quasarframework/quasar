<template>
  <!-- TODO: we're waiting for answers from VueMastery about some details of theirs affiliate program, enable to see the GUI -->
  <q-card v-if="false" class="font-monserrat bg-dark full-width">
    <q-card-section :horizontal="$q.screen.gt.xs">
      <q-card-section :class="$q.screen.xs? 'row justify-between' : 'column justify-center items-center'">
        <a href="https://www.vuemastery.com/">
          <img src="~assets/vuemastery-logo.svg" width="93" class="q-mb-sm" alt="Vue Mastery Logo">
        </a>
        <q-btn label="Know More" color="brand-accent" rounded class="text-size-10 text-weight-bold" padding="2px sm" :href="to" target="_blank"/>
      </q-card-section>

      <q-separator :vertical="$q.screen.gt.xs" color="white-12" />

      <q-card-section class="text-size-14 padding-y-12">
        <p class="q-mb-none text-brand-primary letter-spacing-263 text-weight-bold text-size-14 primary-line-height">
          Do you want to know more about {{ subject }}?
        </p>
        <p class="q-mb-sm letter-spacing-25 text-white">
          Learn it faster with our partner Vue Mastery and get into Quasar at light-speed
        </p>
        <div class="text-size-12 text-brand-accent letter-spacing-40">
          By attending this course, you will even support our beloved open source framework!
        </div>
      </q-card-section>
    </q-card-section>
  </q-card>
</template>

<script>
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'VueMasteryCard',
  props: {
    to: {
      type: String,
      required: true
    },
    subject: {
      type: String,
      required: true
    }
  }
})
</script>

<style lang="scss" scoped>
.margin-y-12 {
  margin-bottom: 12px;
  margin-top: 12px;
}
.padding-y-12 {
  padding-bottom: 12px;
  padding-top: 12px;
}
</style>
