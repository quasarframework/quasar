import Platform from './features/platform'
import events, { install as eventsInstall } from './features/events'
import { install as toastInstall } from './components/toast/toast'
import { current as theme } from './features/theme'
import { version } from '../package.json'

import Transition from './vue-transitions/index'

import dBackToTop from './vue-directives/back-to-top'
import dGoBack from './vue-directives/go-back'
import dRipple from './vue-directives/ripple'
import dScrollFire from './vue-directives/scroll-fire'
import dScroll from './vue-directives/scroll'
import dTouchHold from './vue-directives/touch-hold'
import dTouchPan from './vue-directives/touch-pan'
import dTouchSwipe from './vue-directives/touch-swipe'

import AjaxBar from './vue-components/ajax-bar/AjaxBar.vue'
import Autocomplete from './vue-components/autocomplete/Autocomplete.vue'
import Btn from './vue-components/btn/Btn.vue'
import ChatMessage from './vue-components/chat/ChatMessage.vue'
import Checkbox from './vue-components/checkbox/Checkbox.vue'
import Chips from './vue-components/chips/Chips.vue'
import Collapsible from './vue-components/collapsible/Collapsible.vue'
import ContextMenuDesktop from './vue-components/context-menu/ContextMenuDesktop.vue'
import ContextMenuMobile from './vue-components/context-menu/ContextMenuMobile.vue'
import DataTable from './vue-components/data-table/DataTable.vue'
import Datetime from './vue-components/datetime/Datetime.vue'
import DatetimeRange from './vue-components/datetime/DatetimeRange.vue'
import InlineDatetimeMaterial from './vue-components/datetime/InlineDatetimeMat.vue'
import InlineDatetimeIOS from './vue-components/datetime/InlineDatetimeIOS.vue'
import Drawer from './vue-components/drawer/Drawer.vue'
import DrawerLink from './vue-components/drawer/DrawerLink.vue'
import Fab from './vue-components/fab/Fab.vue'
import Field from './vue-components/field/Field.vue'
import FixedPosition from './vue-components/fixed-position/FixedPosition.vue'
import SmallFab from './vue-components/fab/SmallFab.vue'
import Gallery from './vue-components/gallery/Gallery.vue'
import GallerySlider from './vue-components/gallery/GallerySlider.vue'
import InfiniteScroll from './vue-components/infinite-scroll/InfiniteScroll.vue'
import InnerLoading from './vue-components/inner-loading/InnerLoading.vue'
import Input from './vue-components/input/Input.vue'
import InputGroup from './vue-components/input-group/InputGroup.vue'
import Item from './vue-components/list/Item.vue'
import Knob from './vue-components/knob/Knob.vue'
import Layout from './vue-components/layout/Layout.vue'
import ToolbarTitle from './vue-components/layout/ToolbarTitle.vue'
import Modal from './vue-components/modal/Modal.vue'
import ResizeObservable from './vue-components/observables/ResizeObservable.vue'
import ScrollObservable from './vue-components/observables/ScrollObservable.vue'
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
import ScrollArea from './vue-components/scroll-area/ScrollArea.vue'
import Search from './vue-components/search/Search.vue'
import Select from './vue-components/select/Select.vue'
import DialogSelect from './vue-components/select/DialogSelect.vue'
import Slider from './vue-components/slider/Slider.vue'
import Spinner from './vue-components/spinner/Spinner.vue'
import Stepper from './vue-components/stepper/Stepper.vue'
import StepperHeader from './vue-components/stepper/StepperHeader.vue'
import Step from './vue-components/stepper/Step.vue'
import StepPane from './vue-components/stepper/StepPane.vue'
import StepperNavigation from './vue-components/stepper/StepperNavigation.vue'
import Tabs from './vue-components/tab/Tabs.vue'
import Tab from './vue-components/tab/Tab.vue'
import RouteTab from './vue-components/tab/RouteTab.vue'
import TabPane from './vue-components/tab/TabPane.vue'
import Toggle from './vue-components/toggle/Toggle.vue'
import Tooltip from './vue-components/tooltip/Tooltip.vue'
import Tree from './vue-components/tree/Tree.vue'
import Uploader from './vue-components/uploader/Uploader.vue'
import Video from './vue-components/video/Video.vue'

function registerDirectives (_Vue) {
  [
    ['back-to-top', dBackToTop],
    ['go-back', dGoBack],
    ['ripple', dRipple],
    ['scroll-fire', dScrollFire],
    ['scroll', dScroll],
    ['touch-hold', dTouchHold],
    ['touch-pan', dTouchPan],
    ['touch-swipe', dTouchSwipe]
  ].forEach(d => {
    _Vue.directive(d[0], d[1])
  })
}

function registerComponents (_Vue) {
  _Vue.component('spinner', Spinner)
  _Vue.component('q-transition', Transition)

  ;[
    ['ajax-bar', AjaxBar],
    ['autocomplete', Autocomplete],
    ['btn', Btn],
    ['chat-message', ChatMessage],
    ['checkbox', Checkbox],
    ['chips', Chips],
    ['collapsible', Collapsible],
    ['context-menu', Platform.is.desktop ? ContextMenuDesktop : ContextMenuMobile],
    ['data-table', DataTable],
    ['inline-datetime', theme === 'ios' ? InlineDatetimeIOS : InlineDatetimeMaterial],
    ['datetime', Datetime],
    ['datetime-range', DatetimeRange],
    ['drawer', Drawer],
    ['drawer-link', DrawerLink],
    ['fab', Fab],
    ['field', Field],
    ['fixed-position', FixedPosition],
    ['small-fab', SmallFab],
    ['gallery', Gallery],
    ['gallery-slider', GallerySlider],
    ['checkbox', Checkbox],
    ['infinite-scroll', InfiniteScroll],
    ['inner-loading', InnerLoading],
    ['input', Input],
    ['input-group', InputGroup],
    ['item', Item],
    ['knob', Knob],
    ['layout', Layout],
    ['toolbar-title', ToolbarTitle],
    ['modal', Modal],
    ['resize-observable', ResizeObservable],
    ['scroll-observable', ScrollObservable],
    ['pagination', Pagination],
    ['parallax', Parallax],
    ['popover', Popover],
    ['progress', Progress],
    ['progress-button', ProgressButton],
    ['pull-to-refresh', PullToRefresh],
    ['radio', Radio],
    ['range', Range],
    ['double-range', DoubleRange],
    ['rating', Rating],
    ['scroll-area', ScrollArea],
    ['search', Search],
    ['select', Select],
    ['dialog-select', DialogSelect],
    ['slider', Slider],
    ['stepper', Stepper],
    ['stepper-header', StepperHeader],
    ['step', Step],
    ['step-pane', StepPane],
    ['stepper-navigation', StepperNavigation],
    ['tabs', Tabs],
    ['tab', Tab],
    ['route-tab', RouteTab],
    ['tab-pane', TabPane],
    ['toggle', Toggle],
    ['tooltip', Tooltip],
    ['tree', Tree],
    ['uploader', Uploader],
    ['video', Video]
  ].forEach(c => {
    _Vue.component('q-' + c[0], c[1])
  })
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

  _Vue.prototype.$q = {
    version,
    platform: Platform,
    theme,
    events
  }
}
