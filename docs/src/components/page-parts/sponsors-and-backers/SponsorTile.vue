<template>
  <!-- `doc-img` forces a background when in dark mode -->
  <div class="sponsor doc-img">
    <a v-if="href" :href="href" target="_blank" class="cursor-pointer block full-height">
      <q-img :src="logoUrl" :alt="name" height="100%" fit="contain" />
    </a>
    <q-img v-else :src="logoUrl" :alt="name" height="100%" fit="contain" />
  </div>
</template>

<script>
import { computed, defineComponent } from 'vue'

export default defineComponent({
  name: 'SponsorTile',
  props: {
    src: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    href: {
      type: String,
      default: undefined
    },
    cdn: {
      type: Boolean,
      default: true
    }
  },
  setup (props) {
    const logoUrl = computed(() => `${props.cdn ? 'https://cdn.quasar.dev/sponsors/' : 'sponsor-logos'}/${props.src}`)

    return { logoUrl }
  }
})
</script>

<style lang="scss">
@use 'sass:map';

// Increases specificity to avoid 'doc-img' class to override the defined padding
.sponsor.sponsor.sponsor {
  box-sizing: content-box;
  max-height: 80px;
  max-width: 200px;
  padding: map.get($space-md, 'x');
  width: 100%;

  @media (min-width: $breakpoint-sm-min) {
    max-height: 120px;
  }
}
</style>
