<template>
  <q-card class="bg-white card py-32 q-px-lg text-center column justify-between items-center shadow-bottom-large">
    <q-card-section class="q-pa-none">
      <q-icon size="xl" :name="props.icon"/>
      <div :class="{'letter-spacing-40': $q.screen.xs}" class="text-uppercase heading--medium q-py-md">
        {{ props.title }}
      </div>
      <div class="text-dark text-size-16 text-weight-medium q-pb-md letter-spacing-300 primary-line-height">
        {{ props.body }}
      </div>
    </q-card-section>

    <q-card-section class="q-pa-none">
      <q-btn
        outline
        class="call-to-action-btn no-border-radius"
        color="brand-accent"
        :label="props.btnLabel"
        :to="props.btnLink"
      />
    </q-card-section>
  </q-card>
</template>

<script setup>
const props = defineProps({
  icon: String,
  title: String,
  body: String,
  btnLabel: String,
  btnLink: String
})
</script>

<style lang="sass">
$card-side--large: 400px
$card-side--small: 280px

.py-32
  padding-top: 32px
  padding-bottom: 32px

.card
  width: $card-side--small

  @media screen and (min-width: $breakpoint-xs-max)
    width: $card-side--large
    height: $card-side--large
</style>
