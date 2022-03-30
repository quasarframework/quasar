<template>
  <q-card class="font-monserrat bg-dark full-width">
    <q-card-section :horizontal="$q.screen.gt.xs">
      <q-card-section :class="$q.screen.xs? 'row justify-between' : 'column justify-center items-center'">
        <a href="https://www.vuemastery.com/">
          <img src="~assets/homepage/logo-vue-mastery.png" width="93" class="q-mb-sm" alt="Vue Mastery Logo">
        </a>
        <q-btn label="Know More" color="brand-accent" rounded class="text-size-10" padding="2px sm" :href="to" target="_blank"/>
      </q-card-section>

      <q-separator :vertical="$q.screen.gt.xs" color="white-12" />

      <q-card-section class="text-size-14">
        <p class="q-mb-xs text-brand-primary letter-spacing-263 text-weight-bold text-size-14 primary-line-height">
          Do you want to know more about {{ subject }}?
        </p>
        <p class="q-mb-sm letter-spacing-25 text-white">
          Learn it faster with out partner Vue Mastery and get into quasar at light-speed
        </p>
        <p class="q-mb-none text-size-12 text-brand-accent letter-spacing-40">
          By attending this course, you will even support our beloved open source framework
        </p>
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
</style>
