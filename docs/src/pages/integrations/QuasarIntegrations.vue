<template>
  <div class="page-integrations column justify-center text-center doc-brand">
    <h1 class="heading heading--large normal-line-height"
      >All platforms in one go</h1
    >
    <div
      class="letter-spacing-300 text-size-16 text-weight-bold text-center q-mb-md"
    >
      Focus only on your mission and forget about the spaceship.
    </div>

    <div class="row justify-center">
      <div
        class="page-integrations__text letter-spacing-40 text-size-16 q-mb-xl"
      >
        Combine the power of Quasar UI with Quasar CLI. One source code for all
        platforms simultaneously with all the latest and greatest best practices
        out of the box.
      </div>
    </div>

    <div
      class="page-integrations__platforms q-gutter-lg"
      role="img"
      aria-label="Runs in browsers and on mobile and desktop platforms"
    >
      <q-icon
        v-for="(iconName, platformIndex) in platformIcons"
        :key="platformIndex"
        color="brand-secondary"
        :name="iconName"
      />
    </div>

    <h2 class="heading heading--medium q-mb-lg normal-line-height">
      With an awesome set of build tools
    </h2>

    <div class="row justify-center q-gutter-md q-mb-xl">
      <DocCardLink
        v-for="(entry, cardIndex) in buildTargets"
        :key="cardIndex"
        :to="entry.path"
        :label="entry.name"
        :icon="entry.icon"
        icon-color="brand-accent"
      />
    </div>

    <h2 class="heading heading--medium q-mb-lg normal-line-height">
      Discover Quasar's Ecosystem
    </h2>

    <template v-for="(part, partIndex) in ecosystemParts" :key="partIndex">
      <div
        class="page-integrations__about q-mb-md text-size-16 letter-spacing-40 primary-line-height"
      >
        {{ part.about }}
      </div>

      <div class="row justify-center q-gutter-md q-mb-lg">
        <DocCardLink
          v-for="(entry, cardIndex) in part.options"
          :key="cardIndex"
          :to="entry.path"
          :label="entry.label"
          :icon="entry.icon"
          :icon-color="entry.iconColor"
        />
      </div>
    </template>
  </div>
</template>

<script setup>
import DocCardLink from '@/components/DocCardLink.vue'
import {
  buildTargets,
  ecosystemParts,
  platformIcons
} from '@/assets/links.integrations.js'
</script>

<style lang="sass">
.page-integrations
  &__platforms
    font-size: 60px
    margin-bottom: 60px
</style>
