
import transitionSlide from './vue-transitions/slide'

import directiveAttr from './vue-directives/attribute'
import directiveCard from './vue-directives/card'
import directiveCollapsible from './vue-directives/collapsible'
import directiveExit from './vue-directives/exit-app'
import directiveHover from './vue-directives/hover'
import directiveList from './vue-directives/list'
import directiveTooltip from './vue-directives/tooltip'

import Checkbox from './vue-components/checkbox/checkbox.vue'
import Choice from './vue-components/choice/choice.vue'
import Collapsible from './vue-components/collapsible/collapsible.vue'
import CollapsibleItem from './vue-components/collapsible/collapsible-item.vue'
import Dropdown from './vue-components/dropdown/dropdown.vue'
import ContextDropdown from './vue-components/dropdown/context-dropdown.vue'
import Gallery from './vue-components/gallery/gallery.vue'
import GallerySlider from './vue-components/gallery/gallery-slider.vue'
import Number from './vue-components/number/number.vue'
import Pagination from './vue-components/pagination/pagination.vue'
import ProgressBar from './vue-components/progress-bar/progress-bar.vue'
import Radio from './vue-components/radio/radio.vue'
import Range from './vue-components/range/range.vue'
import Rating from './vue-components/rating/rating.vue'
import Slider from './vue-components/slider/slider.vue'
import registerSpinners from './vue-components/spinner/spinner'
import State from './vue-components/state/state.vue'
import Toggle from './vue-components/toggle/toggle.vue'
import Tree from './vue-components/tree/tree.vue'
import TreeItem from './vue-components/tree/tree-item.vue'
import Video from './vue-components/video/video.vue'

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
  _Vue.component('dropdown', Dropdown)
  _Vue.component('context-dropdown', ContextDropdown)
  _Vue.component('checkbox', Checkbox)
  _Vue.component('choice', Choice)
  _Vue.component('video', Video)
  _Vue.component('quasar-collapsible', Collapsible)
  _Vue.component('quasar-collapsible-item', CollapsibleItem)
  _Vue.component('gallery', Gallery)
  _Vue.component('gallery-slider', GallerySlider)
  _Vue.component('number', Number)
  _Vue.component('pagination', Pagination)
  _Vue.component('progress-bar', ProgressBar)
  _Vue.component('radio', Radio)
  _Vue.component('range', Range)
  _Vue.component('rating', Rating)
  _Vue.component('slider', Slider)
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
