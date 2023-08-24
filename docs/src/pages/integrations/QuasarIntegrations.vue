<template>
  <div class="page-integrations column justify-center text-center doc-brand">
    <div class="heading heading--large normal-line-height">All platforms in one go</div>
    <div class="letter-spacing-300 text-size-16 text-weight-bold text-center q-mb-md">
      Focus only on your mission and forget about the spaceship.
    </div>

    <div class="row justify-center">
      <div class="page-integrations__text letter-spacing-40 text-size-16 q-mb-xl">
        Combine the power of Quasar UI with Quasar CLI. One source code for all platforms
        simultaneously with all the latest and greatest best practices out of the box.
      </div>
    </div>

    <div class="page-integrations__platforms q-gutter-lg">
      <q-icon
        v-for="(iconName, platformIndex) in platformIcons"
        :key="`platform-${platformIndex}`"
        color="brand-secondary"
        :name="iconName"
      />
    </div>

    <h2 class="heading heading--medium q-mb-lg normal-line-height">
      With an awesome set of build tools
    </h2>

    <div class="row justify-center q-gutter-md q-mb-xl">
      <doc-card-link
        v-for="(entry, cardIndex) in buildTargets"
        :key="cardIndex"
        :to="entry.path"
      >
        <q-card
          class="page-integrations__card column justify-center items-center no-wrap cursor-pointer"
        >
          <q-icon
            :name="entry.icon"
            class="text-size-24 q-my-sm"
            color="brand-accent"
          />
          <div class="text-size-14 text-weight-bold letter-spacing-263 text-brand-primary">
            {{ entry.label }}
          </div>
          <div class="page-integrations__card-description text-size-12 q-px-sm letter-spacing-100">
            {{ entry.name }}
          </div>
        </q-card>
      </doc-card-link>
    </div>

    <h2 class="heading heading--medium q-mb-lg normal-line-height">
      Discover Quasar's Ecosystem
    </h2>

    <template v-for="(part, partIndex) in ecosystemParts" :key="partIndex">
      <div class="page-integrations__about q-mb-md text-size-16 letter-spacing-40 primary-line-height">
        {{ part.about }}
      </div>

      <div class="row justify-center q-gutter-md q-mb-lg">
        <doc-card-link
          v-for="(entry, cardIndex) in part.options"
          :key="cardIndex"
          :to="entry.path"
          :external="!entry.isInternal"
        >
          <q-card
            class="page-integrations__card page-integrations__card--bordered column justify-center items-center cursor-pointer"
            flat
          >
            <q-icon
              :name="entry.icon"
              class="text-size-36 q-my-sm"
              :color="entry.iconColor || 'brand-primary'"
            />
            <div class="page-integrations__card-description text-size-12 q-px-sm letter-spacing-100">
              {{ entry.label }}
            </div>
          </q-card>
        </doc-card-link>
      </div>
    </template>
  </div>
</template>

<script setup>
import DocCardLink from 'components/DocCardLink.vue'
import { platformIcons, buildTargets, ecosystemParts } from 'src/assets/links.integrations.js'
</script>

<style lang="sass">
.page-integrations

  &__platforms
    font-size: 60px
    margin-bottom: 60px

  &__card
    width: 120px
    height: 120px
    border-radius: $generic-border-radius
    transition: transform $header-quick-transition, box-shadow $header-quick-transition

    &--bordered
      border-radius: 8px
      border: solid 1px rgba($brand-secondary, .54)

    &:hover
      // !important needed when used with flat cards
      box-shadow: 0 8px 8px 0 rgba($dark, .2) !important
      transform: scale(1.03)

    .q-icon
      font-size: 36px

  &__card-description,
  &__about
    color: $cold-black

body.body--dark .page-integrations
  &__card
    box-shadow: 0 1px 5px rgba($brand-primary, .2), 0 2px 2px rgba($brand-primary, .14), 0 3px 1px -2px rgba($brand-primary, .12)

    &:hover
      box-shadow: 0 4px 8px 0 rgba($brand-primary, 0.8) !important

  &__card-description,
  &__about
    color: #fff
</style>
