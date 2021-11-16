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
        :selected="value === filterCategory"
        color="lp-primary"
        clickable text-color="white"
        :label="label"
        @click="setFilterCategory(value)"
      />
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

const OTHER_CATEGORY = 'other'

const FILTER_CHIPS = [
  { label: 'Buttons', value: 'button' },
  { label: 'Inputs', value: 'input' },
  { label: 'Loading', value: 'loading' },
  { label: 'Media', value: 'media' },
  { label: 'Navigation', value: 'navigation' },
  { label: 'Panels & Popups', value: 'panelAndPopup' },
  { label: 'Scroll', value: 'scroll' },
  { label: 'Tables', value: 'table' },
  { label: 'Others', value: OTHER_CATEGORY }
]

const componentNameToKebabCase = (componentName) => componentName.replaceAll(' ', '-').toLowerCase()

export default defineComponent({
  name: 'Components',
  setup () {
    const search = ref('')
    const filterCategory = ref('')

    function filterByCategory (categories, filterCategory) {
      // If a category was not explicitly set, then we consider it to be of category 'Others'
      return typeof categories === 'undefined' ? filterCategory === OTHER_CATEGORY : categories?.includes(filterCategory)
    }

    const filteredComponents = computed(() => {
      const searchValue = search.value.toLowerCase()
      return components.filter(({ name, description, categories }) =>
        (name.toLowerCase().includes(searchValue) || description.toLowerCase().includes(searchValue)) &&
        (filterCategory.value === '' || filterByCategory(categories, filterCategory.value))
      )
    })

    function setFilterCategory (filterChipValue) {
      filterCategory.value = filterChipValue
    }

    return {
      search,
      filterChips: FILTER_CHIPS,
      filterCategory,
      components: filteredComponents,
      componentNameToKebabCase,
      setFilterCategory
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
