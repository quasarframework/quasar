<template lang="pug">
q-layout(view="hHh LpR fFf")
  q-header(elevated)
    q-toolbar
      q-btn.q-mr-sm(flat, dense, round, @click="leftDrawerState = !leftDrawerState", aria-label="Menu")
        q-icon(name="menu")

      q-toolbar-title Quasar Theme Builder

      q-space

      q-btn(flat dense round @click="share" icon="share")
        q-tooltip Share theme link
      q-btn(flat dense round @click="toggleDark" icon="invert_colors")

  q-drawer(
    v-model="leftDrawerState"
    show-if-above
    bordered
    content-class="overflow-hidden"
  )
    q-tabs(v-model="tab")
      q-tab(name="theme" label="Theme")
      q-tab(name="palette" label="Color Palette")
    q-tab-panels.variables__panels(v-model="tab" style="height: calc(100% - 50px)")
      q-tab-panel(name="theme")
        q-scroll-area.fit
          variable-list(
            :variables="globalVariables"
            @input="onVariableChange"
          )
      q-tab-panel(name="palette")
        q-scroll-area.fit
          variable-list(
            :variables="paletteVariables"
            @input="onVariableChange"
          )

  q-page-container
    q-page(padding)
      .row
        .col-12.col-lg-6
          preview(name="button" :variables="componentVariables.QBtn" @input="onVariableChange")
            q-btn-preview.preview
          preview(name="app bar" :variables="[componentVariables.QHeader, componentVariables.QToolbar]" @input="onVariableChange")
            q-toolbar-preview.preview(style="height: 60px")
          preview(name="drawer" :variables="componentVariables.QDrawer" @input="onVariableChange")
            q-drawer-preview.preview(style="height: 300px")
          preview(name="input" :variables="[componentVariables.QInput, componentVariables.QField]" @input="onVariableChange")
            q-input-preview.preview
          preview(name="slider" :variables="componentVariables.QSlider" @input="onVariableChange")
            q-slider-preview.preview
          .row
            preview.col(name="checkbox" :variables="componentVariables.QCheckbox" @input="onVariableChange")
              q-checkbox-preview.preview
            preview.col(name="toggle" :variables="componentVariables.QToggle" @input="onVariableChange")
              q-toggle-preview.preview
        .col-12.col-lg-6
          preview(name="fab" :variables="componentVariables.QFab" @input="onVariableChange")
            q-fab-preview.preview
          preview(name="card" :variables="componentVariables.QCard" @input="onVariableChange")
            q-card-preview.preview
          preview(name="tabs" :variables="[componentVariables.QTabs, componentVariables.QTab]" @input="onVariableChange")
            q-tabs-preview.preview
          preview(name="select" :variables="[componentVariables.QSelect, componentVariables.QField]" @input="onVariableChange")
            q-select-preview.preview
          preview(name="linear progress" :variables="componentVariables.QLinearProgress" @input="onVariableChange")
            q-linear-progress-preview.preview
</template>

<script>

import VariableList from '../components/page-parts/theme-builder/VariableList'
import Preview from '../components/page-parts/theme-builder/Preview'

import { copyToClipboard } from '../assets/page-utils'

import QBtnPreview from '../components/page-parts/theme-builder/previews/QBtn'
import QFabPreview from '../components/page-parts/theme-builder/previews/QFab'
import QToolbarPreview from '../components/page-parts/theme-builder/previews/QToolbar'
import QCardPreview from '../components/page-parts/theme-builder/previews/QCard'
import QDrawerPreview from '../components/page-parts/theme-builder/previews/QDrawer'
import QInputPreview from '../components/page-parts/theme-builder/previews/QInput'
import QTabsPreview from '../components/page-parts/theme-builder/previews/QTabs'
import QSelectPreview from '../components/page-parts/theme-builder/previews/QSelect'
import QLinearProgressPreview from '../components/page-parts/theme-builder/previews/QLinearProgress'
import QSliderPreview from '../components/page-parts/theme-builder/previews/QSlider'
import QCheckboxPreview from '../components/page-parts/theme-builder/previews/QCheckbox'
import QTogglePreview from '../components/page-parts/theme-builder/previews/QToggle'

export default {
  components: {
    VariableList,
    Preview,
    QBtnPreview,
    QFabPreview,
    QToolbarPreview,
    QCardPreview,
    QDrawerPreview,
    QInputPreview,
    QTabsPreview,
    QSelectPreview,
    QLinearProgressPreview,
    QSliderPreview,
    QCheckboxPreview,
    QTogglePreview
  },

  data () {
    return {
      leftDrawerState: true,
      tab: 'theme',
      globalVariables: {},
      componentVariables: {},
      paletteVariables: {},
      variables: {}
    }
  },

  mounted () {
    const preset = JSON.parse(this.$route.query.preset || null) || {}
    const variables = require('quasar/dist/variables.json'),
      globalVariables = {},
      componentVariables = {},
      paletteVariables = {}

    for (const name in variables) {
      const variable = variables[name]
      if (!(name.startsWith('z-') || name.startsWith('breakpoint') || variable.type === 'font-family')) {
        if (name in preset) {
          variable.value = preset[name]
          this.applyVariable(variable)
        }
        variable.defaultValue = variable.value
        if (variable.category === 'Color Palette') {
          paletteVariables[name] = variable
        }
        else if (!name.includes('button') && (variable.references === void 0 || Object.keys(variable.references).length > 1)) {
          globalVariables[name] = variable
        }
        else {
          const componentName = Object.keys(variable.references)[0]
          if (!componentVariables[componentName]) {
            componentVariables[componentName] = {}
          }
          componentVariables[componentName][name] = variable.references[componentName]
        }
      }
    }

    this.globalVariables = globalVariables
    this.componentVariables = componentVariables
    this.paletteVariables = paletteVariables
  },

  methods: {
    isVariableChanged (variable) {
      return JSON.stringify(variable.value) !== JSON.stringify(variable.defaultValue)
    },

    onVariableChange (variable, value) {
      variable.value = value
      this.applyVariable(variable, value)
    },

    __applyVariable (affects, value) {
      for (const target of affects) {
        const val = target.template ? target.template.replace('$value', value) : value
        const docSelector = target.selector.startsWith('body') ? target.selector : `.preview ${target.selector}`
        document.querySelectorAll(docSelector)
          .forEach(el => {
            el.style[target.property] = val
          })
      }
    },

    applyVariable (variable, value = variable.value) {
      if (variable.type === 'Size') {
        value = `${value.size}${value.unit}`
      }
      variable.affects !== void 0 && this.__applyVariable(variable.affects, value)
      if (variable.references !== void 0) {
        for (const component in variable.references) {
          const compVariable = variable.references[component]
          compVariable.affects !== void 0 && this.__applyVariable(compVariable.affects, value)
        }
      }
    },

    toggleDark () {
      this.$q.dark.set(!this.$q.dark.isActive)
      for (const variableName in this.variables) {
        const variable = this.variables[variableName]
        this.applyVariable(variable)
      }
    },

    __changedVariables () {
      const variables = {}
      for (const name in this.variables) {
        const variable = this.variables[name]
        if (this.isVariableChanged(variable)) {
          variables[name] = variable.value
        }
      }
      return variables
    },

    share () {
      const variables = this.__changedVariables()
      const url = window.location.origin + window.location.pathname +
        (Object.keys(variables).length === 0 ? '' : `?preset=${encodeURIComponent(JSON.stringify(variables))}`)
      copyToClipboard(url)
      this.$q.notify({
        message: 'Theme link has been copied to clipboard.',
        color: 'white',
        textColor: 'primary',
        position: 'top',
        actions: [ { icon: 'close', color: 'primary' } ],
        timeout: 2000
      })
    }
  }
}

</script>

<style lang="sass">

.variables__panels .q-tab-panel
  padding: 0

</style>
