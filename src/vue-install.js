import Platform from './features/platform'
import events, { install as eventsInstall } from './features/events'
import { install as toastInstall } from './components/toast/toast'
import { current as theme } from './features/theme'
import { version } from '../package.json'

import Transition from './vue-transitions/index'

import dBackToTop from './vue-directives/back-to-top'
import dGoBack from './vue-directives/go-back'
import dLink from './vue-directives/link'
import dScrollFire from './vue-directives/scroll-fire'
import dScroll from './vue-directives/scroll'
import dTouchHold from './vue-directives/touch-hold'
import dTouchPan from './vue-directives/touch-pan'
import dTouchSwipe from './vue-directives/touch-swipe'

import AjaxBar from './vue-components/ajax-bar/AjaxBar.vue'
import Autocomplete from './vue-components/autocomplete/Autocomplete.vue'
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
import SmallFab from './vue-components/fab/SmallFab.vue'
import Gallery from './vue-components/gallery/Gallery.vue'
import GallerySlider from './vue-components/gallery/GallerySlider.vue'
import InfiniteScroll from './vue-components/infinite-scroll/InfiniteScroll.vue'
import Knob from './vue-components/knob/Knob.vue'
import Layout from './vue-components/layout/Layout.vue'
import ListItem from './vue-components/list-item/ListItem.vue'
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
import Uploader from './vue-components/uploader/Uploader.vue'
import Video from './vue-components/video/Video.vue'

function registerDirectives (_Vue) {
  [
    ['back-to-top', dBackToTop],
    ['go-back', dGoBack],
    ['link', dLink],
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
    ['small-fab', SmallFab],
    ['gallery', Gallery],
    ['gallery-slider', GallerySlider],
    ['checkbox', Checkbox],
    ['infinite-scroll', InfiniteScroll],
    ['knob', Knob],
    ['layout', Layout],
    ['list-item', ListItem],
    ['toolbar-title', ToolbarTitle],
    ['modal', Modal],
    ['numeric', Numeric],
    ['pagination', Pagination],
    ['parallax', Parallax],
    ['picker-textfield', PickerTextfield],
    ['popover', Popover],
    ['progress', Progress],
    ['progress-button', ProgressButton],
    ['pull-to-refresh', PullToRefresh],
    ['radio', Radio],
    ['range', Range],
    ['double-range', DoubleRange],
    ['rating', Rating],
    ['search', Search],
    ['select', Select],
    ['dialog-select', DialogSelect],
    ['slider', Slider],
    ['state', State],
    ['stepper', Stepper],
    ['step', Step],
    ['tab', Tab],
    ['tabs', Tabs],
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
