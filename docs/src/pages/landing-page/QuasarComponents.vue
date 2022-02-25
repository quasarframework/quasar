<template>
  <q-page class="q-mt-xl lp-mb--large text-white" :class="{'large-screen-margin': $q.screen.gt.md}">
    <div
      :class="$q.screen.xl? 'justify-between q-ml-lg margin-right-60' : 'justify-around padding-x-100'"
      class="q-pa-lg q-pa-md row no-wrap items-center chips-container bg-lp-dark"
    >
      <q-input
        v-model="search"
        :class="$q.screen.gt.sm? 'q-ml-xl':''"
        label-color="grey-6"
        borderless
        label="Search component"
        dense
        debounce="300"
        dark
        hide-bottom-space
        class="relative-position search-field text-size-16"
      >
        <template #append>
          <q-icon v-if="!search" name="search" size="sm" color="lp-primary" />
          <q-icon v-else name="clear" color="lp-primary" class="cursor-pointer" @click.stop="search = ''" />
        </template>
      </q-input>
      <div class="row justify-start q-ml-xl" v-if="$q.screen.gt.sm">
        <q-chip
          v-for="({label, value}, chipIndex) in filterChips"
          :key="chipIndex"
          :label="label"
          :color="value === filterTag ? 'lp-accent' : 'lp-primary'"
          clickable
          text-color="white"
          @click="setFilterTag(value)"
        />
      </div>
    </div>
    <div
      v-if="filteredComponents.length === 0"
      class="no-search-results row justify-center text-center items-center text-size-20 letter-spacing-225 q-mx-md">
      No components match '{{ search }}'
    </div>
    <div v-else class="components text-size-16">
      <transition-group
        appear
        name="slide-fade"
      >
        <q-card
          v-for="({name, description, path}, i) in filteredComponents"
          :key="name + i"
          class="raise-on-hover text-size-16 shadow-bottom-large cursor-pointer overflow-hidden letter-spacing-300"
          @click="$router.push(componentPath({path, name}))"
        >
          <!-- bg-lp-dark fixes background bleeding of image (top left/right) when q-card is displayed on dark background with a border radius -->
          <!-- See https://github.com/quasarframework/quasar/issues/11665 -->
          <div class="thumbnail-container bg-lp-dark">
            <q-img :src="`components-thumbnails/${componentNameToKebabCase(name)}.jpg`" class="bg-lp-dark" />
          </div>
          <q-card-section class="text-lp-primary text-weight-bold">
            {{ name }}
          </q-card-section>
          <q-card-section class="text-lp-dark q-pt-none">
            {{ description }}
          </q-card-section>
        </q-card>
      </transition-group>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref, computed } from 'vue'
import { components } from 'src/assets/landing-page/image-links.js'
import { useMeta } from 'quasar'

const FILTER_CHIPS = [
  { label: 'Buttons', value: 'button' },
  { label: 'Inputs', value: 'input' },
  { label: 'Loading', value: 'loading' },
  { label: 'Media', value: 'media' },
  { label: 'Navigation', value: 'navigation' },
  { label: 'Panels & Popups', value: 'panel' },
  { label: 'Scroll', value: 'scroll' },
  { label: 'Tables', value: 'table' },
  { label: 'Others', value: 'other' }
]

const componentNameToKebabCase = (componentName) => componentName.replaceAll(' ', '-').toLowerCase()

const componentPath = ({ path, name }) => `/vue-components/${path || componentNameToKebabCase(name)}`

export default defineComponent({
  name: 'Components',
  setup () {
    useMeta({
      title: 'Components'
    })
    const search = ref('')
    const filterTag = ref()

    const filteredComponents = computed(() => {
      const needle = search.value.toLowerCase()
      return components.filter(({ name, description, tag }) =>
        (name.toLowerCase().includes(needle) || description.toLowerCase().includes(needle)) &&
        (filterTag.value === undefined || tag === filterTag.value)
      )
    })

    function setFilterTag (filterChipValue) {
      // if the filter tag is the same as the one we are trying to set, then we reset the filter tag
      filterTag.value = filterTag.value === filterChipValue ? undefined : filterChipValue
    }

    return {
      search,
      filterChips: FILTER_CHIPS,
      filterTag,
      filteredComponents,
      componentNameToKebabCase,
      setFilterTag,
      componentPath
    }
  }
})
</script>

<style lang="scss" scoped>

.components {
  display: grid;
  grid-template-columns: repeat(auto-fit, 300px);
  gap: 24px;
  margin: 48px 24px 100px 24px;
  justify-content: center;
}

.thumbnail-container {
  position: relative;

  &::after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-image: linear-gradient(to bottom, rgba($white, 0) 50%, rgba($black, 0.28));
  }
}

.raise-on-hover {
  transition: transform .3s, box-shadow 0.3s;

  &:hover {
   box-shadow: 0 24px 24px 0 rgba(0, 180, 255, 0.4);
   transform: scale(1.03)
  }
}

.search-field {
  width: 80%;

  @media screen and (min-width: $breakpoint-md-min) {
    width: auto;
  }

  &::after {
    content: "";
    position: absolute;
    width: calc(100% + 16px);
    left: -8px;
    border-bottom: 1px solid $lp-primary;
    top: 40px;
    z-index: 3;
  }
}

.large-screen-margin {
  margin: 64px;
}

.chips-container {
  position: sticky;
  top: 60px;
  z-index: 2;

  @media screen and (min-width: $breakpoint-xs-max) {
    top: 150px;
  }
}

.slide-fade-enter-active {
  transition: all .3s ease-in-out;
}
.slide-fade-leave-active {
  transition: all .3s ease-in-out;
}

.margin-right-60 {
  margin-right: 60px;
}
.padding-x-100 {
  padding-left: 100px;
  padding-right: 100px;
}

.no-search-results {
  height: 50vh;
}
</style>
