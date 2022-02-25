<template>
  <q-page class="column justify-center q-px-xl font-monserrat">
    <h1
      class="lp-heading lp-heading--large landing__title normal-line-height"
    >Welcome to quasar docs</h1>
    <p
      class="letter-spacing-300 text-size-16 text-weight-bold text-center"
    >Here you can find everything you need to start working with Quasar.</p>
    <p class="letter-spacing-40 text-size-16 text-center">
      In the top navigation bar there is a search function that helps you find what you need and also
      <br v-if="$q.screen.gt.sm" />many other pages that you can explore, like beginner resources and other cool content
      about
      <br v-if="$q.screen.gt.sm" />the Quasar galaxy. Don’t forget to check our page to
      <a
        class="text-lp-accent"
        href="https://github.com/sponsors/rstoenescu"
        target="_blank"
      >become a sponsor</a>!
    </p>
    <p class="letter-spacing-40 text-size-16 text-center">
      If you are an experienced explorer get right into
      action: use the navigation drawer on the left
      <br v-if="$q.screen.gt.sm" />to navigate through our most important
      technical resources.
    </p>
    <h2
      class="lp-heading lp-heading--medium q-mb-lg normal-line-height"
    >Have a look at Our most used pages</h2>
    <div class="cards-grid lp-mb--large">
      <q-card
        v-for="({ path, label, icon }, cardIndex) in quickNavCards"
        :key="cardIndex"
        class="raise-on-hover card column justify-end items-center cursor-pointer"
        flat
        background="grey-10"
        @click="$router.push(`/${path}`)"
      >
        <q-card-section class="q-pa-none q-mb-lg">
          <q-icon :name="icon" class="card__icon" color="lp-primary" />
        </q-card-section>

        <q-card-section class="q-pa-none">
          <q-btn
            :label="label"
            :to="path"
            class="q-mb-md text-size-16 text-weight-bold letter-spacing-300"
            color="lp-deep-dark"
            flat
            no-caps
            padding="sm"
          />
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'
import { useMeta } from 'quasar'

import { useDocStore } from 'assets/doc-store.js'

export default defineComponent({
  name: 'Landing',

  setup () {
    useMeta({
      title: 'Documentation'
    })

    const $store = useDocStore()
    $store.toc = []

    const quickNavCards = [
      {
        label: 'Layout Gallery',
        icon: 'view_quilt',
        path: 'layout/gallery'
      },
      {
        label: 'Options & Helpers',
        icon: 'tune',
        path: 'options'
      },
      {
        label: 'Color Palette',
        icon: 'style',
        path: 'style/color-palette'
      },
      {
        label: 'Typography',
        icon: 'view_quilt',
        path: '#'
      },
      {
        label: 'Layout Gallery',
        icon: 'view_quilt',
        path: 'layout/gallery'
      },
      {
        label: 'Layout Gallery',
        icon: 'view_quilt',
        path: 'layout/gallery'
      },
      {
        label: 'Layout Gallery',
        icon: 'view_quilt',
        path: 'layout/gallery'
      },
      {
        label: 'Layout Gallery',
        icon: 'view_quilt',
        path: 'layout/gallery'
      }
    ]
    return { quickNavCards }
  }
})

</script>

<style lang="scss" scoped>
.landing {
  &__title {
    margin-top: 72px;
  }
}

.cards-grid {
  display: grid;
  gap: 24px;
  justify-content: center;
  justify-items: center;
  grid-template-columns: repeat(auto-fit, 240px);
  grid-auto-rows: 240px;

  @media screen and (min-width: $breakpoint-md-max) {
    grid-template-columns: repeat(4, 240px);
  }

  &-title {
    margin-top: 100px;
  }
}

.card {
  height: 240px;
  width: 240px;
  border-radius: 8px;
  border: solid 1px rgba(0, 0, 0, 0.12);

  &__icon {
    font-size: 100px;
  }
}

.raise-on-hover {
  transition: transform 0.3s, box-shadow 0.3s;

  &:hover {
    // !important needed when used with flat cards
    box-shadow: 0 8px 8px 0 rgba($lp-dark, 0.2) !important;
    transform: scale(1.03);
  }
}
</style>
