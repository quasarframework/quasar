import Platform from './platform'
import { install as eventsInstall } from './events'
import { install as toastInstall } from './components/toast/toast'
import { current as theme } from './theme'

import Transition from './vue-transitions/transition'

import dGoBack from './vue-directives/go-back'
import dLink from './vue-directives/link'
import dScrollFire from './vue-directives/scroll-fire'
import dScroll from './vue-directives/scroll'
import dTooltip from './vue-directives/tooltip'
import dTouchHold from './vue-directives/touch-hold'
import dTouchPan from './vue-directives/touch-pan'
import dTouchSwipe from './vue-directives/touch-swipe'

import Checkbox from './vue-components/checkbox/Checkbox.vue'
import Chips from './vue-components/chips/Chips.vue'
import Collapsible from './vue-components/collapsible/Collapsible.vue'
import ContextMenuDesktop from './vue-components/context-menu/ContextMenuDesktop.vue'
import ContextMenuMobile from './vue-components/context-menu/ContextMenuMobile.vue'
import DatetimeMobile from './vue-components/datetime/DatetimeMobile.vue'
import DatetimeDesktop from './vue-components/datetime/DatetimeDesktop.vue'
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
import Tree from './vue-components/tree/Tree.vue'
import Video from './vue-components/video/Video.vue'

function registerDirectives (_Vue) {
  _Vue.directive('go-back', dGoBack)
  _Vue.directive('link', dLink)
  _Vue.directive('scroll-fire', dScrollFire)
  _Vue.directive('scroll', dScroll)
  _Vue.directive('tooltip', dTooltip)
  _Vue.directive('touch-hold', dTouchHold)
  _Vue.directive('touch-pan', dTouchPan)
  _Vue.directive('touch-swipe', dTouchSwipe)
}

function registerComponents (_Vue) {
  _Vue.component('quasar-checkbox', Checkbox)
  _Vue.component('quasar-chips', Chips)
  _Vue.component('quasar-collapsible', Collapsible)
  _Vue.component('quasar-context-menu', Platform.is.desktop ? ContextMenuDesktop : ContextMenuMobile)
  _Vue.component('quasar-inline-datetime', theme === 'ios' ? InlineDatetimeIOS : InlineDatetimeMaterial)
  _Vue.component('quasar-datetime', Platform.is.desktop && !Platform.within.iframe ? DatetimeDesktop : DatetimeMobile)
  _Vue.component('quasar-drawer', Drawer)
  _Vue.component('quasar-drawer-link', DrawerLink)
  _Vue.component('quasar-fab', Fab)
  _Vue.component('quasar-small-fab', SmallFab)
  _Vue.component('quasar-gallery', Gallery)
  _Vue.component('quasar-gallery-slider', GallerySlider)
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
  _Vue.component('quasar-progress-button', ProgressButton)
  _Vue.component('quasar-pull-to-refresh', PullToRefresh)
  _Vue.component('quasar-radio', Radio)
  _Vue.component('quasar-range', Range)
  _Vue.component('quasar-double-range', DoubleRange)
  _Vue.component('quasar-rating', Rating)
  _Vue.component('quasar-search', Search)
  _Vue.component('quasar-select', Select)
  _Vue.component('quasar-dialog-select', DialogSelect)
  _Vue.component('quasar-slider', Slider)
  _Vue.component('spinner', Spinner)
  _Vue.component('quasar-state', State)
  _Vue.component('quasar-stepper', Stepper)
  _Vue.component('quasar-step', Step)
  _Vue.component('quasar-tab', Tab)
  _Vue.component('quasar-tabs', Tabs)
  _Vue.component('quasar-toggle', Toggle)
  _Vue.component('quasar-tree', Tree)
  _Vue.component('quasar-video', Video)

  _Vue.component('quasar-transition', Transition)
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
}
