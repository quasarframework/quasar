<template>
  <q-page class="column justify-center q-px-xl font-monserrat landing-mb--large">
    <h1
      class="landing-heading landing-heading--large landing__title normal-line-height"
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
        class="text-brand-accent"
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
    <div :class="{'cards-grid': $q.screen.gt.sm}">
      <div class="row cards-container-width justify-center q-gutter-sm q-py-lg justify-self-end">
        <div class="text-center full-width text-size-24 text-weight-bolder letter-spacing-450 text-brand-primary text-uppercase">
          Most Used
        </div>
        <card-link
          v-for="({icon, img, path, label}, pageIndex) in mostUsedPages"
          :key="`page-${pageIndex}`"
          :to="path"
        >
          <q-card
            class="raise-on-hover card column justify-center items-center cursor-pointer"
            flat
          >
            <q-icon
              :name="img? `img:${img}` : icon"
              class="card__icon"
              color="brand-primary"
            />
            <div class="text-brand-secondary text-size-12 text-weight-bold letter-spacing-100">
              {{ label }}
            </div>
          </q-card>
        </card-link>
      </div>
      <q-separator v-if="$q.screen.gt.sm" vertical class="bg-black-12 justify-self-center"/>
      <div class="row cards-container-width justify-center q-gutter-sm q-py-lg justify-self-start">
        <div class="text-center full-width text-size-24 text-weight-bolder letter-spacing-450 text-brand-primary text-uppercase">
          Discover Also
        </div>
        <card-link
          v-for="({icon, label, path}, pageIndex) in pagesToDiscover"
          :key="`page-${pageIndex}`"
          :to="path"
        >
          <q-card
            class="raise-on-hover card column justify-center items-center cursor-pointer"
            flat
          >
            <q-icon
              :name="icon"
              class="card__icon"
              color="brand-primary"
            />
            <div class="text-brand-secondary text-size-12 text-weight-bold letter-spacing-100">
              {{ label }}
            </div>
          </q-card>
        </card-link>
      </div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'
import { useMeta } from 'quasar'

import { useDocStore } from 'assets/doc-store.js'
import CardLink from 'components/CardLink.vue'
import { mostUsedPages, pagesToDiscover } from 'assets/homepage.js'

export default defineComponent({
  name: 'Homepage',
  components: { CardLink },

  setup () {
    useMeta({
      title: 'Documentation'
    })

    const $store = useDocStore()
    $store.toc = []

    return {
      mostUsedPages,
      pagesToDiscover
    }
  }
})

</script>

<style lang="scss" scoped>
.landing {
  &__title {
    margin-top: 72px;
  }
}

.raise-on-hover {
  transition: transform 0.3s, box-shadow 0.3s;

  &:hover {
    // !important needed when used with flat cards
    box-shadow: 0 8px 8px 0 rgba($dark, 0.2) !important;
    transform: scale(1.03);
  }
}

.cards-grid {
  display: grid;
  grid-template-columns: 1fr 50px 1fr;
}
.card {
  width: 120px;
  height: 120px;
  border: solid 1px rgba(0, 0, 0, 0.12);

  &__icon {
    font-size: 36px;
  }
}
.cards-container-width {
  @media screen and (min-width: $breakpoint-md-max) {
    width: 400px;
  }
}

.justify-self {
  &-start {
    justify-self: start;
  }
  &-center {
    justify-self: center;
  }
  &-end {
    justify-self: end;
  }
}

</style>
