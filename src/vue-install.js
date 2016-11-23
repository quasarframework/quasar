import Platform from './features/platform'
import { install as eventsInstall } from './features/events'
import { install as toastInstall } from './components/toast/toast'
import { current as theme } from './features/theme'

import Transition from './vue-transitions/transition'

import dGoBack from './vue-directives/go-back'
import dLink from './vue-directives/link'
import dScrollFire from './vue-directives/scroll-fire'
import dScroll from './vue-directives/scroll'
import dTouchHold from './vue-directives/touch-hold'
import dTouchPan from './vue-directives/touch-pan'
import dTouchSwipe from './vue-directives/touch-swipe'

import Checkbox from './vue-components/checkbox/Checkbox.vue'
import Chips from './vue-components/chips/Chips.vue'
import Collapsible from './vue-components/collapsible/Collapsible.vue'
import ContextMenuDesktop from './vue-components/context-menu/ContextMenuDesktop.vue'
import ContextMenuMobile from './vue-components/context-menu/ContextMenuMobile.vue'
import Datetime from './vue-components/datetime/Datetime.vue'
import InlineDatetimeMaterial from './vue-components/datetime/InlineDatetimeMat.vue'
import InlineDatetimeIOS from './vue-components/datetime/InlineDatetimeIOS.vue'
import Drawer from './vue-components/drawer/Drawer.vue'
import DrawerLink from './vue-components/drawer/DrawerLink.vue'
import Fab from './vue-components/fab/Fab.vue'
import SmallFab from './vue-components/fab/SmallFab.vue'
import Gallery from './vue-components/gallery/Gallery.vue'
import GallerySlider from './vue-components/gallery/GallerySlider.vue'
import InfiniteScroll from './vue-components/infinite-scroll/InfiniteScroll.vue'
import Knob from './vue-components/knob/Knob.vue'
import Layout from './vue-components/layout/Layout.vue'
import ToolbarTitle from './vue-components/layout/ToolbarTitle.vue'
import Modal from './vue-components/modal/Modal.vue'
import Numeric from './vue-components/numeric/Numeric.vue'
import Pagination from './vue-components/pagination/Pagination.vue'
import Parallax from './vue-components/parallax/Parallax.vue'
import PickerTextfield from './vue-components/picker-textfield/PickerTextfield.vue'
import Popover from './vue-components/popover/Popover.vue'
import Progress from './vue-components/progress/Progress.vue'
import ProgressButton from './vue-components/progress-button/ProgressButton.vue'
import PullToRefresh from './vue-components/pull-to-refresh/PullToRefresh.vue'
import Radio from './vue-components/radio/Radio.vue'
import Range from './vue-components/range/Range.vue'
import DoubleRange from './vue-components/range/DoubleRange.vue'
import Rating from './vue-components/rating/Rating.vue'
import Search from './vue-components/search/Search.vue'
import Select from './vue-components/select/Select.vue'
import DialogSelect from './vue-components/select/DialogSelect.vue'
import Slider from './vue-components/slider/Slider.vue'
import Spinner from './vue-components/spinner/Spinner.vue'
import State from './vue-components/state/State.vue'
import Stepper from './vue-components/stepper/Stepper.vue'
import Step from './vue-components/stepper/Step.vue'
import Tab from './vue-components/tab/Tab.vue'
import Tabs from './vue-components/tab/Tabs.vue'
import Toggle from './vue-components/toggle/Toggle.vue'
import Tooltip from './vue-components/tooltip/Tooltip.vue'
import Tree from './vue-components/tree/Tree.vue'
import Video from './vue-components/video/Video.vue'

function registerDirectives (_Vue) {
  _Vue.directive('go-back', dGoBack)
  _Vue.directive('link', dLink)
  _Vue.directive('scroll-fire', dScrollFire)
  _Vue.directive('scroll', dScroll)
  _Vue.directive('touch-hold', dTouchHold)
  _Vue.directive('touch-pan', dTouchPan)
  _Vue.directive('touch-swipe', dTouchSwipe)
}

function registerComponents (_Vue) {
  _Vue.component('q-checkbox', Checkbox)
  _Vue.component('q-chips', Chips)
  _Vue.component('q-collapsible', Collapsible)
  _Vue.component('q-context-menu', Platform.is.desktop ? ContextMenuDesktop : ContextMenuMobile)
  _Vue.component('q-inline-datetime', theme === 'ios' ? InlineDatetimeIOS : InlineDatetimeMaterial)
  _Vue.component('q-datetime', Datetime)
  _Vue.component('q-drawer', Drawer)
  _Vue.component('q-drawer-link', DrawerLink)
  _Vue.component('q-fab', Fab)
  _Vue.component('q-small-fab', SmallFab)
  _Vue.component('q-gallery', Gallery)
  _Vue.component('q-gallery-slider', GallerySlider)
  _Vue.component('q-infinite-scroll', InfiniteScroll)
  _Vue.component('q-knob', Knob)
  _Vue.component('q-layout', Layout)
  _Vue.component('q-toolbar-title', ToolbarTitle)
  _Vue.component('q-modal', Modal)
  _Vue.component('q-numeric', Numeric)
  _Vue.component('q-pagination', Pagination)
  _Vue.component('q-parallax', Parallax)
  _Vue.component('q-picker-textfield', PickerTextfield)
  _Vue.component('q-popover', Popover)
  _Vue.component('q-progress', Progress)
  _Vue.component('q-progress-button', ProgressButton)
  _Vue.component('q-pull-to-refresh', PullToRefresh)
  _Vue.component('q-radio', Radio)
  _Vue.component('q-range', Range)
  _Vue.component('q-double-range', DoubleRange)
  _Vue.component('q-rating', Rating)
  _Vue.component('q-search', Search)
  _Vue.component('q-select', Select)
  _Vue.component('q-dialog-select', DialogSelect)
  _Vue.component('q-slider', Slider)
  _Vue.component('spinner', Spinner)
  _Vue.component('q-state', State)
  _Vue.component('q-stepper', Stepper)
  _Vue.component('q-step', Step)
  _Vue.component('q-tab', Tab)
  _Vue.component('q-tabs', Tabs)
  _Vue.component('q-toggle', Toggle)
  _Vue.component('q-tooltip', Tooltip)
  _Vue.component('q-tree', Tree)
  _Vue.component('q-video', Video)

  _Vue.component('q-transition', Transition)
}

export var Vue

export default function (_Vue) {
  if (this.installed) {
    console.warn('Quasar already installed in Vue.')
    return
  }

  Vue = _Vue

  eventsInstall(_Vue)
  registerDirectives(_Vue)
  registerComponents(_Vue)
  toastInstall(_Vue)

  _Vue.prototype.$quasar = {
    platform: Platform,
    theme
  }
}
