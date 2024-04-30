/* There are some icons that are needed but not available
   so we import them from MDI as svg */

import {
  mdiFormatBold,
  mdiFormatItalic,
  mdiFormatStrikethroughVariant,
  mdiFormatUnderline,
  mdiFormatListBulleted,
  mdiFormatListNumbered,
  mdiFormatSubscript,
  mdiFormatSuperscript,
  mdiFormatAlignLeft,
  mdiFormatAlignCenter,
  mdiFormatAlignRight,
  mdiFormatAlignJustify,
  mdiFormatIndentDecrease,
  mdiFormatIndentIncrease,
  mdiFormatClear,
  mdiFormatColorText,
  mdiFormatSize,
  mdiMinus,
  mdiFormatHeader1,
  mdiFormatHeader2,
  mdiFormatHeader3,
  mdiFormatHeader4,
  mdiFormatHeader5,
  mdiFormatHeader6,
  mdiNumeric1Box,
  mdiNumeric2Box,
  mdiNumeric3Box,
  mdiNumeric4Box,
  mdiNumeric5Box,
  mdiNumeric6Box,
  mdiNumeric7Box,
  mdiFormatFont
} from '@quasar/extras/mdi-v6'

export default {
  name: 'ionicons-v4',
  type: {
    positive: 'ion-md-checkmark',
    negative: 'ion-alert',
    info: 'ion-information-circle-outline',
    warning: 'ion-alert'
  },
  arrow: {
    up: 'ion-arrow-up',
    right: 'ion-arrow-forward',
    down: 'ion-arrow-down',
    left: 'ion-arrow-back',
    dropdown: 'ion-arrow-dropdown'
  },
  chevron: {
    left: 'ion-ios-arrow-back',
    right: 'ion-ios-arrow-forward'
  },
  colorPicker: {
    spectrum: 'ion-aperture',
    tune: 'ion-options',
    palette: 'ion-apps'
  },
  pullToRefresh: {
    icon: 'ion-refresh'
  },
  carousel: {
    left: 'ion-ios-arrow-back',
    right: 'ion-ios-arrow-forward',
    up: 'ion-ios-arrow-up',
    down: 'ion-ios-arrow-down',
    navigationIcon: 'ion-square'
  },
  chip: {
    remove: 'ion-close-circle',
    selected: 'ion-checkmark'
  },
  datetime: {
    arrowLeft: 'ion-ios-arrow-back',
    arrowRight: 'ion-ios-arrow-forward',
    now: 'ion-time',
    today: 'ion-calendar'
  },
  editor: {
    hyperlink: 'ion-link',
    toggleFullscreen: 'ion-expand',
    quote: 'ion-quote',
    print: 'ion-print',
    undo: 'ion-undo',
    redo: 'ion-redo',
    code: 'ion-code',
    viewSource: 'ion-ios-code',

    bold: mdiFormatBold,
    italic: mdiFormatItalic,
    strikethrough: mdiFormatStrikethroughVariant,
    underline: mdiFormatUnderline,
    unorderedList: mdiFormatListBulleted,
    orderedList: mdiFormatListNumbered,
    subscript: mdiFormatSubscript,
    superscript: mdiFormatSuperscript,
    left: mdiFormatAlignLeft,
    center: mdiFormatAlignCenter,
    right: mdiFormatAlignRight,
    justify: mdiFormatAlignJustify,
    outdent: mdiFormatIndentDecrease,
    indent: mdiFormatIndentIncrease,
    removeFormat: mdiFormatClear,
    formatting: mdiFormatColorText,
    fontSize: mdiFormatSize,
    align: mdiFormatAlignLeft,
    hr: mdiMinus,
    heading: mdiFormatSize,
    heading1: mdiFormatHeader1,
    heading2: mdiFormatHeader2,
    heading3: mdiFormatHeader3,
    heading4: mdiFormatHeader4,
    heading5: mdiFormatHeader5,
    heading6: mdiFormatHeader6,
    size: mdiFormatSize,
    size1: mdiNumeric1Box,
    size2: mdiNumeric2Box,
    size3: mdiNumeric3Box,
    size4: mdiNumeric4Box,
    size5: mdiNumeric5Box,
    size6: mdiNumeric6Box,
    size7: mdiNumeric7Box,
    font: mdiFormatFont
  },
  expansionItem: {
    icon: 'ion-arrow-dropdown',
    denseIcon: 'ion-arrow-dropdown'
  },
  fab: {
    icon: 'ion-add',
    activeIcon: 'ion-close'
  },
  field: {
    clear: 'ion-close-circle',
    error: 'ion-alert'
  },
  pagination: {
    first: 'ion-ios-skip-backward',
    prev: 'ion-ios-arrow-back',
    next: 'ion-ios-arrow-forward',
    last: 'ion-ios-skip-forward'
  },
  rating: {
    icon: 'ion-star'
  },
  stepper: {
    done: 'ion-checkmark',
    active: 'ion-create',
    error: 'ion-warning'
  },
  tabs: {
    left: 'ion-ios-arrow-back',
    right: 'ion-ios-arrow-forward',
    up: 'ion-ios-arrow-up',
    down: 'ion-ios-arrow-down'
  },
  table: {
    arrowUp: 'ion-arrow-up',
    warning: 'ion-warning',
    firstPage: 'ion-ios-return-left',
    prevPage: 'ion-ios-arrow-back',
    nextPage: 'ion-ios-arrow-forward',
    lastPage: 'ion-ios-return-right'
  },
  tree: {
    icon: 'ion-play'
  },
  uploader: {
    done: 'ion-checkmark',
    clear: 'ion-close',
    add: 'ion-add-circle',
    upload: 'ion-cloud-upload',
    removeQueue: 'ion-trash',
    removeUploaded: 'ion-done-all'
  }
}
