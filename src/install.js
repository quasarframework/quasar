
import Platform from './platform'
import Events from './events'
import { current as theme } from './theme'

import transitionSlide from './vue-transitions/slide'

import GridSelectedFilter from './vue-filters/grid-selected'

import directiveAttr from './vue-directives/attr'
import directiveCollapsible from './vue-directives/collapsible'
import directiveScrollFire from './vue-directives/scroll-fire'
import directiveScroll from './vue-directives/scroll'
import directiveTooltip from './vue-directives/tooltip'

import Checkbox from './vue-components/checkbox/checkbox.vue'
import Chips from './vue-components/chips/chips.vue'
import ContextMenuDesktop from './vue-components/context-menu/context-menu-desktop.vue'
import ContextMenuMobile from './vue-components/context-menu/context-menu-mobile.vue'
import Datetime from './vue-components/datetime/datetime.vue'
import DesktopDatetime from './vue-components/datetime/datetime-desktop.vue'
import MaterialInlineDatetime from './vue-components/datetime/mat-inline-datetime.vue'
import iOSInlineDatetime from './vue-components/datetime/ios-inline-datetime.vue'
import Drawer from './vue-components/drawer/drawer.vue'
import DrawerLink from './vue-components/drawer/drawer-link.vue'
import Fab from './vue-components/fab/fab.vue'
import SmallFab from './vue-components/fab/small-fab.vue'
import Gallery from './vue-components/gallery/gallery.vue'
import GallerySlider from './vue-components/gallery/gallery-slider.vue'
import Grid from './vue-components/grid/grid.vue'
import GridTable from './vue-components/grid/grid-table.vue'
import InfiniteScroll from './vue-components/infinite-scroll/infinite-scroll.vue'
import Knob from './vue-components/knob/knob.vue'
import Layout from './vue-components/layout/layout.vue'
import ToolbarTitle from './vue-components/layout/toolbar-title.vue'
import Modal from './components/modal/modal.vue'
import Numeric from './vue-components/numeric/numeric.vue'
import Pagination from './vue-components/pagination/pagination.vue'
import Parallax from './vue-components/parallax/parallax.vue'
import Popover from './vue-components/popover/popover.vue'
import Progress from './vue-components/progress/progress.vue'
import PullToRefresh from './vue-components/pull-to-refresh/pull-to-refresh.vue'
import Radio from './vue-components/radio/radio.vue'
import Range from './vue-components/range/range.vue'
import Rating from './vue-components/rating/rating.vue'
import Search from './vue-components/search/search.vue'
import Select from './vue-components/select/select.vue'
import DialogSelect from './vue-components/select/dialog-select.vue'
import Slider from './vue-components/slider/slider.vue'
import registerSpinners from './vue-components/spinner/spinner'
import State from './vue-components/state/state.vue'
import Stepper from './vue-components/stepper/stepper.vue'
import Step from './vue-components/stepper/step.vue'
import Tab from './vue-components/tab/tab.vue'
import Tabs from './vue-components/tab/tabs.vue'
import Toggle from './vue-components/toggle/toggle.vue'
import Tree from './vue-components/tree/tree.vue'
import TreeItem from './vue-components/tree/tree-item.vue'
import Video from './vue-components/video/video.vue'

function registerTransitions (_Vue) {
  _Vue.transition('slide', transitionSlide)
}

function registerFilters (_Vue) {
  _Vue.filter('gridShowSelected', GridSelectedFilter)
}

function registerDirectives (_Vue) {
  _Vue.directive('attr', directiveAttr)
  _Vue.directive('collapsible', directiveCollapsible)
  _Vue.directive('scroll-fire', directiveScrollFire)
  _Vue.directive('scroll', directiveScroll)
  _Vue.directive('tooltip', directiveTooltip)
}

function registerComponents (_Vue) {
  _Vue.component('quasar-checkbox', Checkbox)
  _Vue.component('quasar-chips', Chips)
  _Vue.component('quasar-context-menu', Platform.is.desktop ? ContextMenuDesktop : ContextMenuMobile)
  _Vue.component('quasar-datetime', Platform.is.desktop ? DesktopDatetime : Datetime)
  _Vue.component('quasar-inline-datetime', theme === 'ios' ? iOSInlineDatetime : MaterialInlineDatetime)
  _Vue.component('quasar-drawer', Drawer)
  _Vue.component('quasar-drawer-link', DrawerLink)
  _Vue.component('quasar-fab', Fab)
  _Vue.component('quasar-small-fab', SmallFab)
  _Vue.component('quasar-gallery', Gallery)
  _Vue.component('quasar-gallery-slider', GallerySlider)
  _Vue.component('quasar-grid', Grid)
  _Vue.component('quasar-grid-table', GridTable)
  _Vue.component('quasar-infinite-scroll', InfiniteScroll)
  _Vue.component('quasar-knob', Knob)
  _Vue.component('quasar-layout', Layout)
  _Vue.component('quasar-toolbar-title', ToolbarTitle)
  _Vue.component('quasar-modal', Modal)
  _Vue.component('quasar-numeric', Numeric)
  _Vue.component('quasar-pagination', Pagination)
  _Vue.component('quasar-parallax', Parallax)
  _Vue.component('quasar-popover', Popover)
  _Vue.component('quasar-progress', Progress)
  _Vue.component('quasar-pull-to-refresh', PullToRefresh)
  _Vue.component('quasar-radio', Radio)
  _Vue.component('quasar-range', Range)
  _Vue.component('quasar-rating', Rating)
  _Vue.component('quasar-search', Search)
  _Vue.component('quasar-select', Select)
  _Vue.component('quasar-dialog-select', DialogSelect)
  _Vue.component('quasar-slider', Slider)
  _Vue.component('quasar-state', State)
  _Vue.component('quasar-stepper', Stepper)
  _Vue.component('quasar-step', Step)
  _Vue.component('quasar-tab', Tab)
  _Vue.component('quasar-tabs', Tabs)
  _Vue.component('quasar-toggle', Toggle)
  _Vue.component('quasar-tree', Tree)
  _Vue.component('quasar-tree-item', TreeItem)
  _Vue.component('quasar-video', Video)
}

export var Vue

export default function (_Vue) {
  if (this.installed) {
    console.warn('Quasar already installed in Vue.')
    return
  }

  Vue = _Vue

  registerTransitions(_Vue)
  registerFilters(_Vue)
  registerDirectives(_Vue)
  registerComponents(_Vue)
  registerSpinners(_Vue)

  Events.trigger('app:vue-ready', Vue)
}
