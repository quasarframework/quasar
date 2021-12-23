<template>
  <q-page class="column items-center q-mt-xl lp-mb--large text-white q-mx-xl" :class="{'large-screen-margin': $q.screen.gt.md}">
    <div class="chips-container bg-lp-dark column items-center">
      <q-input
        v-model="search"
        label-color="grey-6"
        borderless
        label="Search component"
        dense
        dark
        size="16px"
        class="relative-position search-field"
      >
        <template #append>
          <q-icon v-if="!search" name="search" size="sm" color="lp-primary" />
          <q-icon v-else name="cancel" @click.stop="search = ''" class="cursor-pointer"/>
        </template>
      </q-input>
      <div class="row q-my-xl justify-center">
        <q-chip
          v-for="({label, value}, chipIndex) in filterChips"
          :key="chipIndex"
          :label="label"
          class="row component-chip"
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
          class="raise-on-hover text-size-16 shadow-bottom-small cursor-pointer"
          @click="$router.push(componentPath({path, name}))"
        >
          <div class="thumbnail-container">
            <q-img :src="`components-thumbnails/${componentNameToKebabCase(name)}.jpg`" />
          </div>
          <q-card-section class="text-lp-primary text-weight-bold">
            {{ name }}
          </q-card-section>
          <q-card-section class="text-lp-dark">
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
$number-of-card-columns-gt-sm: 5;
$number-of-card-columns-sm-max: 3;
$number-of-card-columns-xs-max: 1;

.components {
  display: grid;
  letter-spacing: 3px;
  grid-template-columns: repeat($number-of-card-columns-gt-sm, 1fr);
  gap: 24px;
  margin: 240px 64px 100px 64px;

  @media screen and (max-width: $breakpoint-sm-max) {
    margin: auto;
    grid-template-columns: repeat($number-of-card-columns-sm-max, 1fr);
    gap: 20px;
  }
  @media screen and (max-width: $breakpoint-xs-max) {
    margin: auto;
    grid-template-columns: repeat($number-of-card-columns-xs-max, 1fr);
    gap: 20px;
  }
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
  z-index: 3;
}

.component-chip {
  margin-left: 20px;
}

.large-screen-margin {
  margin: 64px;
}

.chips-container {
  padding-top: 135px;
  position: fixed;
  top: 80px;
  z-index: 2;
  width: 100%;
}
</style>
