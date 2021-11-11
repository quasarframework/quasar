<template>
  <q-page class="column items-center q-mt-xl lp-mb--large text-white q-mx-xl">
    <q-input
      label-color="grey-6"
      borderless
      v-model="search"
      label="Search component"
      dense
      dark
      class="relative-position search-field q-mb-lg"
    >
      <template #append>
        <q-icon name="search" size="sm" color="lp-primary" />
      </template>
    </q-input>
    <div class="q-mb-md">
      <q-chip v-for="(filterChip, i) in filterChips" :key="i" color="lp-primary" clickable text-color="white" :label="filterChip"/>
    </div>
    <div class="components">
      <q-card v-for="({name, description}, i) in components" :key="name + i" class="raise-on-hover text-size-16 shadow-bottom-small">
        <img :src="`components-thumbnails/${componentNameToKebabCase(name)}.jpg`" />
        <q-card-section class="text-lp-primary text-weight-medium">
          {{ name }}
        </q-card-section>
        <q-card-section class="text-lp-dark">
          {{ description }}
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref, computed } from 'vue'
import { components } from 'src/assets/landing-page/image-links.js'

const FILTER_CHIPS = [ 'Buttons', 'Inputs', 'Loading', 'Media', 'Navigation', 'Panels & Popups', 'Scroll', 'Tables', 'Others' ]

const componentNameToKebabCase = (componentName) => componentName.replaceAll(' ', '-').toLowerCase()

export default defineComponent({
  name: 'Components',
  setup () {
    const search = ref('')

    computed(search, () => {
      // TODO: implement component filtering
    })

    return {
      search,
      filterChips: FILTER_CHIPS,
      components,
      componentNameToKebabCase
    }
  }
})
</script>

<style lang="scss" scoped>
.components {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 16px;
}

.raise-on-hover {
  transition: transform .3s;

  &:hover {
   box-shadow: $lp-box-shadow--large;
   transform: scale(1.03)
  }
}

.search-field::after {
  content: "";
  position: absolute;
  width: 108%;
  left: -4%;
  border-bottom: 1px solid $lp-primary;
  top: 40px;
}
</style>
