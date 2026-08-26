<template>
  <!-- a real link: keyboard focusable and announced with its target -->
  <q-card
    class="full-width column tutorial-link cursor-pointer"
    flat
    bordered
    tag="a"
    :href="props.u"
    target="_blank"
    rel="noopener"
  >
    <q-card-section class="col tutorial-link__title">
      <h3 class="text-subtitle1 text-weight-bold q-ma-none">{{ props.t }}</h3>
      <div class="q-mt-xs">{{ props.d }}</div>
    </q-card-section>

    <q-separator />

    <q-img :src="props.i" class="bg-white" />
  </q-card>
</template>

<script setup>
const props = defineProps(['t', 'd', 'u', 'i'])
</script>

<style lang="sass">
.tutorial-link
  color: inherit
  text-decoration: none

  &__title
    background: rgba(0,0,0,.05)

@media (any-hover: hover)
  .tutorial-link
    transition: background-color $header-quick-transition
    &:hover
      background-color: rgba(0,0,0,.02)
</style>
