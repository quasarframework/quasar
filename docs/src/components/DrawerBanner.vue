<template>
  <q-banner class="bg-dark text-size-14 font-monserrat q-py-md">
    <div v-if="icon" class="row justify-center q-mb-md">
      <img :src="icon" width="200" height="24" />
    </div>
    <p class="text-uppercase q-mb-xs text-brand-primary text-weight-bold letter-spacing-225 primary-line-height">
      {{ title }}
    </p>
    <p class="q-mb-md text-white letter-spacing-25">
      <slot />
    </p>
    <q-btn :label="buttonLabel" color="brand-accent" rounded padding="xs" class="text-size-10 text-weight-bold letter-spacing-40 full-width" />
  </q-banner>
  <q-separator color="brand-secondary"/>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'DrawerBanner',
  props: {
    title: {
      type: String,
      required: true
    },
    buttonLabel: {
      type: String,
      required: true
    },
    to: {
      type: String,
      required: true
    },
    icon: {
      type: String
    }
  }
})
</script>
