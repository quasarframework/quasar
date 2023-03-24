<template>
  <div class="page-docs column justify-center text-center">
    <div class="heading heading--large normal-line-height">Welcome to Quasar docs</div>
    <div class="letter-spacing-300 text-size-16 text-weight-bold q-mb-md">
      Here you can find everything you need to start working with Quasar.
    </div>

    <div class="row">
      <div class="col-12 col-md text-center page-docs__text letter-spacing-40 text-size-16 q-ma-md">
        In the top navigation bar there is a search function that helps you find
        what you need and also many other pages that you can explore, like beginner
        resources and other cool content about the Quasar galaxy. Don't forget to check
        our page to
        <a
          class="text-brand-accent"
          href="https://donate.quasar.dev"
          target="_blank"
        >become a sponsor</a>!
      </div>

      <div class="gt-sm q-px-md" />

      <div class="col-12 col-md text-center page-docs__text letter-spacing-40 text-size-16 q-ma-md">
        If you are an experienced explorer get right into
        action: use the navigation drawer on the left to navigate through our most important
        technical resources.
      </div>
    </div>

    <div class="row">
      <div class="col-12 col-md row justify-center q-gutter-sm q-py-lg">
        <div class="text-center full-width text-size-24 text-weight-bolder letter-spacing-450 text-brand-primary text-uppercase">
          Most Used
        </div>

        <doc-card-link
          v-for="(entry, pageIndex) in mostUsedPages"
          :key="pageIndex"
          :to="entry.path"
        >
          <q-card
            class="page-docs__card column justify-center items-center cursor-pointer"
            flat
          >
            <q-icon
              :name="entry.icon"
              class="q-mb-sm"
              color="brand-primary"
            />
            <div class="page-docs__card-label text-size-12 letter-spacing-100">
              {{ entry.name }}
            </div>
          </q-card>
        </doc-card-link>
      </div>

      <div class="gt-sm q-px-md row justify-center">
        <q-separator vertical />
      </div>

      <div class="col-12 col-md row cards-container-width justify-center q-gutter-sm q-py-lg">
        <div class="text-center full-width text-size-24 text-weight-bolder letter-spacing-450 text-brand-primary text-uppercase">
          Discover Also
        </div>

        <doc-card-link
          v-for="(entry, pageIndex) in pagesToDiscover"
          :key="pageIndex"
          :to="entry.path"
        >
          <q-card
            class="page-docs__card column justify-center items-center cursor-pointer"
            flat
          >
            <q-icon
              :name="entry.icon"
              class="q-mb-sm"
              color="brand-primary"
            />
            <div class="page-docs__card-label text-center text-size-12 letter-spacing-100">
              {{ entry.name }}
            </div>
          </q-card>
        </doc-card-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import DocCardLink from 'components/DocCardLink.vue'
import { mostUsedPages, pagesToDiscover } from 'src/assets/docs-homepage.js'
</script>

<style lang="sass">
.page-docs

  &__text
    max-width: 500px

  &__card
    width: 110px
    height: 110px
    border: solid 1px rgba($brand-secondary, 0.54)
    border-radius: 8px
    transition: transform $header-quick-transition, box-shadow $header-quick-transition

    &-label
      color: $cold-black

    &:hover
      // !important needed when used with flat cards
      box-shadow: 0 8px 8px 0 rgba($dark, 0.2) !important
      transform: scale(1.03)

    .q-icon
      font-size: 36px

body.body--dark .page-docs
  &__card:hover
    box-shadow: 0 4px 8px 0 rgba($brand-primary, 0.8) !important
  &__card-label
    color: #fff
</style>
