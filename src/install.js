
import transitionSlide from './vue/transitions/slide'

import directiveAttr from './vue/directives/attribute'
import directiveCard from './vue/directives/card'
import directiveCollapsible from './vue/directives/collapsible'
import directiveExit from './vue/directives/exit-app'
import directiveHover from './vue/directives/hover'
import directiveList from './vue/directives/list'
import directiveTooltip from './vue/directives/tooltip'

import Checkbox from './vue/components/checkbox.vue'
import Video from './vue/components/video.vue'
import Collapsible from './vue/components/collapsible.vue'
import CollapsibleItem from './vue/components/collapsible-item.vue'
import Number from './vue/components/number.vue'
import Pagination from './vue/components/pagination.vue'
import ProgressBar from './vue/components/progress-bar.vue'
import Radio from './vue/components/radio.vue'
import Range from './vue/components/range.vue'
import Rating from './vue/components/rating.vue'
import State from './vue/components/state.vue'
import Toggle from './vue/components/toggle.vue'
import Tree from './vue/components/tree.vue'
import TreeItem from './vue/components/tree-item.vue'

import registerSpinners from './vue/components/spinner/spinner'

function registerTransitions (_Vue) {
  transitionSlide(_Vue)
}

function registerDirectives (_Vue) {
  directiveAttr(_Vue)
  directiveCard(_Vue)
  directiveCollapsible(_Vue)
  directiveExit(_Vue)
  directiveHover(_Vue)
  directiveList(_Vue)
  directiveTooltip(_Vue)
}

function registerComponents (_Vue) {
  _Vue.component('checkbox', Checkbox)
  _Vue.component('video', Video)
  _Vue.component('quasar-collapsible', Collapsible)
  _Vue.component('quasar-collapsible-item', CollapsibleItem)
  _Vue.component('number', Number)
  _Vue.component('pagination', Pagination)
  _Vue.component('progress-bar', ProgressBar)
  _Vue.component('radio', Radio)
  _Vue.component('range', Range)
  _Vue.component('rating', Rating)
  _Vue.component('state', State)
  _Vue.component('toggle', Toggle)
  _Vue.component('tree', Tree)
  _Vue.component('tree-item', TreeItem)
}

export var Vue

export default function (_Vue) {
  if (this.installed) {
    console.warn('Quasar already installed in Vue.')
    return
  }

  _Vue.prototype.$quasar = this
  Vue = _Vue

  registerTransitions(_Vue)
  registerDirectives(_Vue)
  registerComponents(_Vue)
  registerSpinners(_Vue)
}
