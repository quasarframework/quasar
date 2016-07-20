
import transitionSlide from './transitions/slide'

import directiveAttr from './directives/attribute'
import directiveCard from './directives/card'
import directiveCollapsible from './directives/collapsible'
import directiveExit from './directives/exit-app'
import directiveHover from './directives/hover'
import directiveList from './directives/list'
import directiveTooltip from './directives/tooltip'

import Checkbox from './components/checkbox/checkbox.vue'
import Choice from './components/choice/choice.vue'
import Collapsible from './components/collapsible/collapsible.vue'
import CollapsibleItem from './components/collapsible/collapsible-item.vue'
import Dropdown from './components/dropdown/dropdown.vue'
import ContextDropdown from './components/dropdown/context-dropdown.vue'
import Gallery from './components/gallery/gallery.vue'
import GallerySlider from './components/gallery/gallery-slider.vue'
import Number from './components/number/number.vue'
import Pagination from './components/pagination/pagination.vue'
import ProgressBar from './components/progress-bar/progress-bar.vue'
import Radio from './components/radio/radio.vue'
import Range from './components/range/range.vue'
import Rating from './components/rating/rating.vue'
import Slider from './components/slider/slider.vue'
import registerSpinners from './components/spinner/spinner'
import State from './components/state/state.vue'
import Toggle from './components/toggle/toggle.vue'
import Tree from './components/tree/tree.vue'
import TreeItem from './components/tree/tree-item.vue'
import Video from './components/video/video.vue'

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
