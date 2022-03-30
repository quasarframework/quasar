<template>
  <q-page class="column justify-center items-center text-center q-px-xl font-monserrat landing-mb--large">
    <h1 class="page-title landing-heading landing-heading--large normal-line-height">All platforms in one go</h1>
    <p class="letter-spacing-300 text-size-16 text-weight-bold text-center">
      Focus only on your mission and forget about the spaceship.
    </p>
    <p class="letter-spacing-40 text-size-16 q-mb-xl">
      Combine the power of Quasar UI with Quasar CLI. One source code for all platforms<br v-if="$q.screen.gt.sm">
      simultaneously with all the latest and greatest best practices out of the box.
    </p>
    <div class="platform-icons q-gutter-lg">
      <q-icon
        v-for="(iconName, platformIndex) in platformIcons"
        :key="`platform-${platformIndex}`"
        color="brand-secondary"
        :name="iconName"
      />
    </div>
    <h2
      class="landing-heading landing-heading--medium q-mb-lg normal-line-height"
    >With an awesome set of build tools</h2>
    <div class="row justify-center q-gutter-md q-mb-xl">
      <card-link
        v-for="({path, label, icon, name}, cardIndex) in buildTargets"
        :key="cardIndex"
        :to="path"
      >
        <q-card
          class="card raise-on-hover column justify-center items-center cursor-pointer border-color-brand-secondary"
        >
          <q-icon
            :name="icon"
            class="text-size-24 q-my-sm"
            color="brand-accent"
          />
          <div class="text-size-14 text-weight-bold letter-spacing-263 text-brand-primary">
            {{ label }}
          </div>
          <div class="text-size-12 q-px-sm letter-spacing-100 text-brand-secondary">
            {{ name }}
          </div>
        </q-card>
      </card-link>
    </div>
    <h2 class="landing-heading landing-heading--medium q-mb-lg normal-line-height">Discover Quasar's Ecosystem</h2>
    <template v-for="({about, options}, partIndex) in ecosystemParts" :key="`part-${partIndex}`">
      <p class="text-size-16 letter-spacing-40 primary-line-height text-brand-secondary">{{ about }}</p>
      <div class="row justify-center q-gutter-md margin-bottom-36">
        <card-link
          v-for="({icon, label, path, isInternal, iconColor}, cardIndex) in options"
          :key="cardIndex"
          :to="path"
          :external="!isInternal"
        >
          <q-card
            class="card card--bordered raise-on-hover column justify-center items-center cursor-pointer"
            flat
          >
            <q-icon
              :name="icon"
              class="text-size-36 q-my-sm"
              :color="iconColor || 'brand-primary'"
            />
            <div class="text-size-12 q-px-sm letter-spacing-100 text-brand-secondary">
              {{ label }}
            </div>
          </q-card>
        </card-link>
      </div>
    </template>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'
import { useMeta } from 'quasar'
import { useDocStore } from 'assets/doc-store.js'
import CardLink from 'components/CardLink.vue'
import { platformIcons, buildTargets, ecosystemParts } from 'assets/integration'

export default defineComponent({
  name: 'QuasarIntegrations',
  components: { CardLink },

  setup () {
    useMeta({
      title: 'Integrations'
    })

    const $store = useDocStore()
    $store.toc = []

    return {
      platformIcons,
      buildTargets,
      ecosystemParts
    }
  }
})

</script>

<style lang="scss" scoped>
.card {
  height: 120px;
  width: 120px;
  border-radius: 4px;

  &--bordered {
    border-radius: 8px;
    border: solid 1px rgba($brand-secondary, 0.54);
  }
}

.raise-on-hover {
  transition: transform .3s, box-shadow 0.3s;

  &:hover {
    // !important needed when used with flat cards
    box-shadow: 0 8px 8px 0 rgba($dark, .2);
    transform: scale(1.03)
  }
}

.platform-icons {
  font-size: 60px;
  margin-bottom: 60px;
}

.page-title {
  margin-top: 72px;
}

.margin-bottom-36 {
  margin-bottom: 36px;
}

.border-color-brand-secondary {
  border-color: $brand-secondary;
}
</style>
