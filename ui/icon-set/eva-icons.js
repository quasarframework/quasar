// there are some icons that are needed but not available
// so we import them from MDI as svgs

import {
  mdiFormatBold,
  mdiFormatItalic,
  mdiFormatStrikethroughVariant,
  mdiFormatUnderline,
  mdiFormatListBulleted,
  mdiFormatListNumbered,
  mdiFormatSubscript,
  mdiFormatSuperscript,
  mdiLink,
  mdiFullscreen,
  mdiFormatQuoteClose,
  mdiFormatAlignLeft,
  mdiFormatAlignCenter,
  mdiFormatAlignRight,
  mdiFormatAlignJustify,
  mdiPrinter,
  mdiFormatIndentDecrease,
  mdiFormatIndentIncrease,
  mdiFormatClear,
  mdiFormatColorText,
  mdiFormatSize,
  mdiMinus,
  mdiUndo,
  mdiRedo,
  mdiFormatHeader1,
  mdiFormatHeader2,
  mdiFormatHeader3,
  mdiFormatHeader4,
  mdiFormatHeader5,
  mdiFormatHeader6,
  mdiCodeTags,
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
  name: 'eva-icons',
  type: {
    positive: 'eva-checkmark-circle-2',
    negative: 'eva-alert-triangle',
    info: 'eva-info',
    warning: 'eva-alert-circle-outline'
  },
  arrow: {
    up: 'eva-arrow-upward-outline',
    right: 'eva-arrow-forward-outline',
    down: 'eva-arrow-downward-outline',
    left: 'eva-arrow-back-outline',
    dropdown: 'eva-chevron-down'
  },
  chevron: {
    left: 'eva-arrow-ios-back-outline',
    right: 'eva-arrow-ios-forward-outline'
  },
  colorPicker: {
    spectrum: 'eva-color-picker-outline',
    tune: 'eva-options-2-outline',
    palette: 'eva-pantone-outline'
  },
  pullToRefresh: {
    icon: 'eva-refresh-outline'
  },
  carousel: {
    left: 'eva-arrow-ios-back-outline',
    right: 'eva-arrow-ios-forward-outline',
    up: 'eva-arrow-ios-upward-outline',
    down: 'eva-arrow-ios-downward-outline',
    navigationIcon: 'eva-shield'
  },
  chip: {
    remove: 'eva-close',
    selected: 'eva-checkmark'
  },
  datetime: {
    arrowLeft: 'eva-arrow-ios-back-outline',
    arrowRight: 'eva-arrow-ios-forward-outline',
    now: 'eva-clock-outline',
    today: 'eva-calendar-outline'
  },
  editor: {
    bold: mdiFormatBold,
    italic: mdiFormatItalic,
    strikethrough: mdiFormatStrikethroughVariant,
    underline: mdiFormatUnderline,
    unorderedList: mdiFormatListBulleted,
    orderedList: mdiFormatListNumbered,
    subscript: mdiFormatSubscript,
    superscript: mdiFormatSuperscript,
    hyperlink: mdiLink,
    toggleFullscreen: mdiFullscreen,
    quote: mdiFormatQuoteClose,
    left: mdiFormatAlignLeft,
    center: mdiFormatAlignCenter,
    right: mdiFormatAlignRight,
    justify: mdiFormatAlignJustify,
    print: mdiPrinter,
    outdent: mdiFormatIndentDecrease,
    indent: mdiFormatIndentIncrease,
    removeFormat: mdiFormatClear,
    formatting: mdiFormatColorText,
    fontSize: mdiFormatSize,
    align: mdiFormatAlignLeft,
    hr: mdiMinus,
    undo: mdiUndo,
    redo: mdiRedo,
    heading: mdiFormatSize,
    heading1: mdiFormatHeader1,
    heading2: mdiFormatHeader2,
    heading3: mdiFormatHeader3,
    heading4: mdiFormatHeader4,
    heading5: mdiFormatHeader5,
    heading6: mdiFormatHeader6,
    code: mdiCodeTags,
    size: mdiFormatSize,
    size1: mdiNumeric1Box,
    size2: mdiNumeric2Box,
    size3: mdiNumeric3Box,
    size4: mdiNumeric4Box,
    size5: mdiNumeric5Box,
    size6: mdiNumeric6Box,
    size7: mdiNumeric7Box,
    font: mdiFormatFont,
    viewSource: mdiCodeTags
  },
  expansionItem: {
    icon: 'eva-arrow-ios-downward-outline',
    denseIcon: 'eva-chevron-down'
  },
  fab: {
    icon: 'eva-plus-outline',
    activeIcon: 'eva-close'
  },
  field: {
    clear: 'eva-close-circle',
    error: 'eva-alert-circle'
  },
  pagination: {
    first: 'eva-arrowhead-left-outline',
    prev: 'eva-arrow-ios-back-outline',
    next: 'eva-arrow-ios-forward-outline',
    last: 'eva-arrowhead-right-outline'
  },
  rating: {
    icon: 'eva-star'
  },
  stepper: {
    done: 'eva-checkmark',
    active: 'eva-edit',
    error: 'eva-alert-triangle'
  },
  tabs: {
    left: 'eva-arrow-ios-back-outline',
    right: 'eva-arrow-ios-forward-outline',
    up: 'eva-arrow-ios-upward-outline',
    down: 'eva-arrow-ios-downward-outline'
  },
  table: {
    arrowUp: 'eva-arrow-upward',
    warning: 'eva-alert-triangle',
    firstPage: 'eva-arrowhead-left-outline',
    prevPage: 'eva-arrow-ios-back-outline',
    nextPage: 'eva-arrow-ios-forward-outline',
    lastPage: 'eva-arrowhead-right-outline'
  },
  tree: {
    icon: 'eva-arrow-right'
  },
  uploader: {
    done: 'eva-checkmark',
    clear: 'eva-close',
    add: 'eva-plus-square',
    upload: 'eva-cloud-upload',
    removeQueue: 'eva-slash',
    removeUploaded: 'eva-done-all'
  }
}
