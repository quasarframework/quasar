
import {
  ionCheckmark,
  ionAlert,
  ionInformationCircleOutline,
  ionArrowUp,
  ionArrowForward,
  ionArrowDown,
  ionArrowBack,
  ionCaretDownOutline,
  ionAperture,
  ionOptions,
  ionApps,
  ionRefresh,
  ionSquare,
  ionCloseCircle,
  ionTime,
  ionCalendar,
  ionLink,
  ionExpand,
  ionChatboxEllipses,
  ionPrint,
  ionArrowUndo,
  ionArrowRedo,
  ionCodeSlash,
  ionAdd,
  ionClose,
  ionPlaySkipBackCircle,
  ionPlaySkipForwardCircle,
  ionStar,
  ionCreate,
  ionWarning,
  ionPlay,
  ionAddCircle,
  ionCloudUpload,
  ionTrash,
  ionCheckmarkDone,
  ionChevronDown,
  ionChevronUp,
  ionChevronBack,
  ionChevronForward,
  ionChevronBackCircle,
  ionChevronForwardCircle
} from '@quasar/extras/ionicons-v5'

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
  name: 'svg-ionicons-v5',
  type: {
    positive: ionCheckmark,
    negative: ionAlert,
    info: ionInformationCircleOutline,
    warning: ionAlert
  },
  arrow: {
    up: ionArrowUp,
    right: ionArrowForward,
    down: ionArrowDown,
    left: ionArrowBack,
    dropdown: ionCaretDownOutline
  },
  chevron: {
    left: ionArrowBack,
    right: ionArrowForward
  },
  colorPicker: {
    spectrum: ionAperture,
    tune: ionOptions,
    palette: ionApps
  },
  pullToRefresh: {
    icon: ionRefresh
  },
  carousel: {
    left: ionChevronBack,
    right: ionChevronForward,
    up: ionChevronUp,
    down: ionChevronDown,
    navigationIcon: ionSquare
  },
  chip: {
    remove: ionCloseCircle,
    selected: ionCheckmark
  },
  datetime: {
    arrowLeft: ionChevronBack,
    arrowRight: ionChevronForward,
    now: ionTime,
    today: ionCalendar
  },
  editor: { // requires Material icons for some as Ionicons simply does not have everything needed
    hyperlink: ionLink,
    toggleFullscreen: ionExpand,
    quote: ionChatboxEllipses,
    print: ionPrint,
    undo: ionArrowUndo,
    redo: ionArrowRedo,
    code: ionCodeSlash,
    viewSource: ionCodeSlash,

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
    icon: ionCaretDownOutline,
    denseIcon: ionCaretDownOutline
  },
  fab: {
    icon: ionAdd,
    activeIcon: ionClose
  },
  field: {
    clear: ionCloseCircle,
    error: ionAlert
  },
  pagination: {
    first: ionPlaySkipBackCircle,
    prev: ionChevronBackCircle,
    next: ionChevronForwardCircle,
    last: ionPlaySkipForwardCircle
  },
  rating: {
    icon: ionStar
  },
  stepper: {
    done: ionCheckmark,
    active: ionCreate,
    error: ionWarning
  },
  tabs: {
    left: ionChevronBack,
    right: ionChevronForward,
    up: ionChevronUp,
    down: ionChevronDown
  },
  table: {
    arrowUp: ionArrowUp,
    warning: ionWarning,
    firstPage: ionPlaySkipBackCircle,
    prevPage: ionChevronBackCircle,
    nextPage: ionChevronForwardCircle,
    lastPage: ionPlaySkipForwardCircle
  },
  tree: {
    icon: ionPlay
  },
  uploader: {
    done: ionCheckmark,
    clear: ionClose,
    add: ionAddCircle,
    upload: ionCloudUpload,
    removeQueue: ionTrash,
    removeUploaded: ionCheckmarkDone
  }
}
