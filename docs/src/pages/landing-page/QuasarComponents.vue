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
      <q-chip
        v-for="({label, value}, chipIndex) in filterChips"
        :key="chipIndex"
        :selected="value === filterTag"
        color="lp-primary"
        clickable text-color="white"
        :label="label"
        @click="setFilterTag(value)"
      />
    </div>
    <div class="components">
      <q-card v-for="({name, description}, i) in filteredComponents" :key="name + i" class="raise-on-hover text-size-16 shadow-bottom-small">
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
      setFilterTag
    }
  }
})
</script>

<style lang="scss" scoped>
$number-of-card-columns-gt-sm: 5;
$number-of-card-columns-sm-max: 3;
$number-of-card-columns-xs-max: 1;

.components {
  display: grid;
  grid-template-columns: repeat($number-of-card-columns-gt-sm, 1fr);
  gap: 24px;

  @media screen and (max-width: $breakpoint-sm-max) {
    grid-template-columns: repeat($number-of-card-columns-sm-max, 1fr);
    gap: 20px;
  }
  @media screen and (max-width: $breakpoint-xs-max) {
    grid-template-columns: repeat($number-of-card-columns-xs-max, 1fr);
    gap: 20px;
  }
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
