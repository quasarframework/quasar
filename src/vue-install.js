import Platform from './features/platform'
import events, { install as eventsInstall } from './features/events'
import { install as toastInstall } from './components/toast/toast'
import { current as theme } from './features/theme'
import { version } from '../package.json'

import Transition from './transitions/index'

import dBackToTop from './directives/back-to-top'
import dGoBack from './directives/go-back'
import dMove from './directives/move'
import dRipple from './directives/ripple'
import dScrollFire from './directives/scroll-fire'
import dScroll from './directives/scroll'
import dTouchHold from './directives/touch-hold'
import dTouchPan from './directives/touch-pan'
import dTouchSwipe from './directives/touch-swipe'

import AjaxBar from './components/ajax-bar/AjaxBar.vue'
import Autocomplete from './components/autocomplete/Autocomplete.vue'
import Btn from './components/btn/Btn.vue'
import ChatMessage from './components/chat/ChatMessage.vue'
import Checkbox from './components/checkbox/Checkbox.vue'
import Chips from './components/chips/Chips.vue'
import Collapsible from './components/collapsible/Collapsible.vue'
import ContextMenuDesktop from './components/context-menu/ContextMenuDesktop.vue'
import ContextMenuMobile from './components/context-menu/ContextMenuMobile.vue'
import DataTable from './components/data-table/DataTable.vue'
import Datetime from './components/datetime/Datetime.vue'
import DatetimeRange from './components/datetime/DatetimeRange.vue'
import InlineDatetimeMaterial from './components/datetime/InlineDatetimeMat.vue'
import InlineDatetimeIOS from './components/datetime/InlineDatetimeIOS.vue'
import Fab from './components/fab/Fab.vue'
import Field from './components/field/Field.vue'
import FixedPosition from './components/fixed-position/FixedPosition.vue'
import SmallFab from './components/fab/SmallFab.vue'
import Gallery from './components/gallery/Gallery.vue'
import GallerySlider from './components/gallery/GallerySlider.vue'
import Icon from './components/icon/Icon.vue'
import InfiniteScroll from './components/infinite-scroll/InfiniteScroll.vue'
import InnerLoading from './components/inner-loading/InnerLoading.vue'
import Input from './components/input/Input.vue'
import InputGroup from './components/input-group/InputGroup.vue'
import Item from './components/list/Item.vue'
import Knob from './components/knob/Knob.vue'
import Layout from './components/layout/Layout.vue'
import SideLink from './components/layout/SideLink.vue'
import Modal from './components/modal/Modal.vue'
import ResizeObservable from './components/observables/ResizeObservable.vue'
import WindowResizeObservable from './components/observables/WindowResizeObservable.vue'
import ScrollObservable from './components/observables/ScrollObservable.vue'
import Pagination from './components/pagination/Pagination.vue'
import Parallax from './components/parallax/Parallax.vue'
import Popover from './components/popover/Popover.vue'
import Progress from './components/progress/Progress.vue'
import ProgressBtn from './components/progress-btn/ProgressBtn.vue'
import PullToRefresh from './components/pull-to-refresh/PullToRefresh.vue'
import Radio from './components/radio/Radio.vue'
import Range from './components/range/Range.vue'
import DoubleRange from './components/range/DoubleRange.vue'
import Rating from './components/rating/Rating.vue'
import ScrollArea from './components/scroll-area/ScrollArea.vue'
import Search from './components/search/Search.vue'
import Select from './components/select/Select.vue'
import DialogSelect from './components/select/DialogSelect.vue'
import Slider from './components/slider/Slider.vue'
import Spinner from './components/spinner/Spinner.vue'
import Stepper from './components/stepper/Stepper.vue'
import StepperHeader from './components/stepper/StepperHeader.vue'
import Step from './components/stepper/Step.vue'
import StepPane from './components/stepper/StepPane.vue'
import StepperNavigation from './components/stepper/StepperNavigation.vue'
import Tabs from './components/tab/Tabs.vue'
import Tab from './components/tab/Tab.vue'
import RouteTab from './components/tab/RouteTab.vue'
import TabPane from './components/tab/TabPane.vue'
import Toggle from './components/toggle/Toggle.vue'
import Tooltip from './components/tooltip/Tooltip.vue'
import Tree from './components/tree/Tree.vue'
import Uploader from './components/uploader/Uploader.vue'
import Video from './components/video/Video.vue'

function registerDirectives (_Vue) {
  [
    ['back-to-top', dBackToTop],
    ['go-back', dGoBack],
    ['move', dMove],
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
    AjaxBar,
    Autocomplete,
    Btn,
    ChatMessage,
    Checkbox,
    Chips,
    Collapsible,
    Platform.is.desktop ? ContextMenuDesktop : ContextMenuMobile,
    DataTable,
    theme === 'ios' ? InlineDatetimeIOS : InlineDatetimeMaterial,
    Datetime,
    DatetimeRange,
    Fab,
    Field,
    FixedPosition,
    SmallFab,
    Gallery,
    GallerySlider,
    Icon,
    Checkbox,
    InfiniteScroll,
    InnerLoading,
    Input,
    InputGroup,
    Item,
    Knob,
    Layout,
    SideLink,
    Modal,
    ResizeObservable,
    WindowResizeObservable,
    ScrollObservable,
    Pagination,
    Parallax,
    Popover,
    Progress,
    ProgressBtn,
    PullToRefresh,
    Radio,
    Range,
    DoubleRange,
    Rating,
    ScrollArea,
    Search,
    Select,
    DialogSelect,
    Slider,
    Stepper,
    StepperHeader,
    Step,
    StepPane,
    StepperNavigation,
    Tabs,
    Tab,
    RouteTab,
    TabPane,
    Toggle,
    Tooltip,
    Tree,
    Uploader,
    Video
  ].forEach(c => {
    _Vue.component(c.name, c)
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
