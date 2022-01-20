<template>
  <q-page class="q-mt-xl lp-mb--large text-white" :class="{'large-screen-margin': $q.screen.gt.md}">
    <div :class="$q.screen.gt.sm? 'justify-between q-pa-lg':'justify-center q-pa-md'" class="row no-wrap items-center q-mx-xl chips-container bg-lp-dark">
      <q-input
        v-model="search"
        :class="$q.screen.gt.sm? 'q-ml-xl':''"
        label-color="grey-6"
        borderless
        label="Search component"
        dense
        dark
        class="relative-position search-field text-size-16"
      >
        <template #append>
          <q-icon v-if="!search" name="search" size="sm" color="lp-primary" />
          <q-icon v-else name="cancel" @click.stop="search = ''" class="cursor-pointer"/>
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
    <div class="components text-size-16">
      <transition-group
        appear
        enter-active-class="animated fadeIn"
        leave-active-class="animated fadeOut"
      >
        <q-card
          v-for="({name, description, path}, i) in filteredComponents"
          :key="name + i"
          class="raise-on-hover text-size-16 shadow-bottom-large cursor-pointer overflow-hidden letter-spacing-300"
          @click="$router.push(componentPath({path, name}))"
        >
          <div class="thumbnail-container">
            <q-img :src="`components-thumbnails/${componentNameToKebabCase(name)}.jpg`" />
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
  top: 80px;
  z-index: 2;

  @media screen and (min-width: $breakpoint-xs-max) {
    top: 150px;
  }
}

</style>
