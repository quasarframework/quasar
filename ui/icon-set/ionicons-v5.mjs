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
  name: 'ionicons-v5',
  type: {
    positive: 'ion-checkmark',
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
    left: 'ion-arrow-back',
    right: 'ion-arrow-forward'
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
    left: 'ion-arrow-back',
    right: 'ion-arrow-forward',
    up: 'ion-arrow-up',
    down: 'ion-arrow-down',
    navigationIcon: 'ion-square'
  },
  chip: {
    remove: 'ion-close-circle',
    selected: 'ion-checkmark'
  },
  datetime: {
    arrowLeft: 'ion-arrow-back',
    arrowRight: 'ion-arrow-forward',
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
    viewSource: 'ion-code',

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
    first: 'ion-skip-backward',
    prev: 'ion-arrow-back',
    next: 'ion-arrow-forward',
    last: 'ion-skip-forward'
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
    left: 'ion-arrow-back',
    right: 'ion-arrow-forward',
    up: 'ion-arrow-up',
    down: 'ion-arrow-down'
  },
  table: {
    arrowUp: 'ion-arrow-up',
    warning: 'ion-warning',
    firstPage: 'ion-return-left',
    prevPage: 'ion-arrow-back',
    nextPage: 'ion-arrow-forward',
    lastPage: 'ion-return-right'
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
