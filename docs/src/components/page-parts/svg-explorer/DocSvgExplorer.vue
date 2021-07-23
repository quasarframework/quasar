<template lang="pug">
.row.justify-between.items-center.q-mb-lg
  q-select.q-mx-sm.svg-select(
      v-model="item"
      outlined
      label="Select a Quasar icon set"
      :options="iconSets"
      clearable
      options-dense
      virtual-scroll-slice-size="50"
    )

  span.text-h6 Totals: {{ filteredCount }}/{{ iconCount }}

  q-input.q-mx-sm.svg-select(
    ref="inputRef",
    v-model="filter",
    dense,
    outlined
    clearable
    input-class="text-right",
    borderless,
    placeholder="Search..."
    style="min-width: 150px"
  )
    template(v-slot:append)
      q-icon(
        :name="biSearch"
      )

.row.full-width.justify-center.q-gutter-xs
  q-intersection.q-ma-xs.intersetion-icon-box(v-for="(path, name) in icons" :key="name" once)
    .row.justify-center.rounded-borders.icon-box(@click="onClick(path, name)")
      q-icon.q-pa-xs(:name="path" size="md")
      span.full-width.text-center.svg-font-size {{ name }}

</template>

<script>
import { ref, computed, watch } from 'vue'
import { copyToClipboard, useQuasar } from 'quasar'
import { biSearch } from '@quasar/extras/bootstrap-icons'

export default {
  name: 'DocSvgExplorer',

  setup () {
    const $q = useQuasar()
    const item = ref('')
    const filter = ref('')
    const importedIcons = ref(null)
    const iconSets = [
      { label: 'Material Icons (Google)', value: 'material-icons' },
      { label: 'Material Icons Outlined (Google)', value: 'material-icons-outlined' },
      { label: 'Material Icons Round (Google)', value: 'material-icons-round' },
      { label: 'Material Icons Sharp (Google)', value: 'material-icons-sharp' },
      { label: 'MDI v5 (Material Design Icons)', value: 'mdi-v5' },
      { label: 'Fontawesome v5', value: 'fontawesome-v5' },
      { label: 'Ionicons v5', value: 'ionicons-v5' },
      { label: 'Eva Icons', value: 'eva-icons' },
      { label: 'Themify', value: 'themify' },
      { label: 'Line Awesome', value: 'line-awesome' },
      { label: 'Bootstrap Icons', value: 'bootstrap-icons' }
    ]

    const icons = computed(() => {
      const vals = {}
      const filtered = filter.value && importedIcons.value ? filter.value.toLowerCase() : ''
      Object.keys(importedIcons.value ? importedIcons.value : {}).forEach(name => {
        if (filtered === '' || name.toLowerCase().indexOf(filtered) > -1) {
          vals[ name ] = importedIcons.value[ name ]
        }
      })
      return vals
    })

    const filteredCount = computed(() => {
      return Object.keys(icons.value).length
    })

    const iconCount = computed(() => {
      return importedIcons.value ? Object.keys(importedIcons.value).length : 0
    })

    watch(() => item.value, async val => {
      if (!val) {
        importedIcons.value = null
        return
      }

      importedIcons.value = Object.freeze(require('@quasar/extras/' + val.value + '/index.js'))
    })

    async function onClick (path, name) {
      await copyToClipboard(name)
      $q.notify({
        message: name,
        caption: 'copied to clipboard',
        icon: path,
        color: 'primary'
      })
    }

    return {
      item,
      filter,
      iconSets,
      icons,
      filteredCount,
      iconCount,
      onClick,
      biSearch
    }
  }
}

</script>

<style lang="sass" scoped>
.svg-select
  width: 240px

.intersetion-icon-box
  max-width: 140px
  width: 100%
  height: 60px

.icon-box
  border: 1px solid #cacaca
  width: 100%
  height: 60px
  cursor: pointer
  &:hover
    border: 1px solid $brand-primary

.svg-font-size
  font-size: 9px
</style>
