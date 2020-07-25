
import {
  fiCheck,
  fiAlertCircle,
  fiInfo,
  fiArrowUp,
  fiArrowRight,
  fiArrowDown,
  fiArrowLeft,
  fiAperture,
  fiMaximize,
  fiSliders,
  fiGrid,
  fiRefreshCw,
  fiSquare,
  fiXCircle,
  fiPrinter,
  fiClock,
  fiCalendar,
  fiLink2,
  fiSkipBack,
  fiSkipForward,
  fiAlertTriangle,
  fiPlay,
  fiUploadCloud,
  fiTrash,
  fiCornerUpLeft,
  fiCornerUpRight,
  fiCode,
  fiChevronLeft,
  fiChevronRight,
  fiChevronUp,
  fiChevronDown,
  fiStar,
  fiX,
  fiChevronsLeft,
  fiChevronsRight,
  fiPlusCircle,
  fiEdit,
  fiPlus,
  fiBold,
  fiItalic,
  fiUnderline,
  fiList,
  fiAlignLeft,
  fiAlignCenter,
  fiAlignRight,
  fiAlignJustify,
  fiMinus,
  fiCheckCircle
} from '@quasar/extras/feather-icons'

// there are some icons that are needed but not available
// so we import them from MDI as svgs

import {
  mdiFormatStrikethroughVariant,
  mdiFormatListNumbered,
  mdiFormatQuoteClose,
  mdiFormatSubscript,
  mdiFormatSuperscript,
  mdiFormatIndentDecrease,
  mdiFormatIndentIncrease,
  mdiFormatClear,
  mdiFormatColorText,
  mdiFormatSize,
  mdiMenuDown,
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
} from '@quasar/extras/mdi-v5'

export default {
  name: 'svg-feather-icons',
  type: {
    positive: fiCheck,
    negative: fiAlertCircle,
    info: fiInfo,
    warning: fiAlertCircle
  },
  arrow: {
    up: fiArrowUp,
    right: fiArrowRight,
    down: fiArrowDown,
    left: fiArrowLeft,
    dropdown: mdiMenuDown
  },
  chevron: {
    left: fiArrowLeft,
    right: fiArrowRight
  },
  colorPicker: {
    spectrum: fiAperture,
    tune: fiSliders,
    palette: fiGrid
  },
  pullToRefresh: {
    icon: fiRefreshCw
  },
  carousel: {
    left: fiChevronLeft,
    right: fiChevronRight,
    up: fiChevronUp,
    down: fiChevronDown,
    navigationIcon: fiSquare
  },
  chip: {
    remove: fiXCircle,
    selected: fiCheck
  },
  datetime: {
    arrowLeft: fiChevronLeft,
    arrowRight: fiChevronRight,
    now: fiClock,
    today: fiCalendar
  },
  editor: { // requires Material icons for some as Ionicons simply does not have everything needed
    hyperlink: fiLink2,
    toggleFullscreen: fiMaximize,
    quote: mdiFormatQuoteClose,
    print: fiPrinter,
    undo: fiCornerUpLeft,
    redo: fiCornerUpRight,
    code: fiCode,
    viewSource: fiCode,

    bold: fiBold,
    italic: fiItalic,
    strikethrough: mdiFormatStrikethroughVariant,
    underline: fiUnderline,
    unorderedList: fiList,
    orderedList: mdiFormatListNumbered,
    subscript: mdiFormatSubscript,
    superscript: mdiFormatSuperscript,
    left: fiAlignLeft,
    center: fiAlignCenter,
    right: fiAlignRight,
    justify: fiAlignJustify,
    outdent: mdiFormatIndentDecrease,
    indent: mdiFormatIndentIncrease,
    removeFormat: mdiFormatClear,
    formatting: mdiFormatColorText,
    fontSize: mdiFormatSize,
    align: fiAlignLeft,
    hr: fiMinus,
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
    icon: mdiMenuDown,
    denseIcon: mdiMenuDown
  },
  fab: {
    icon: fiPlus,
    activeIcon: fiX
  },
  field: {
    clear: fiXCircle,
    error: fiAlertCircle
  },
  pagination: {
    first: fiSkipBack,
    prev: fiChevronsLeft,
    next: fiChevronsRight,
    last: fiSkipForward
  },
  rating: {
    icon: fiStar
  },
  stepper: {
    done: fiCheck,
    active: fiEdit,
    error: fiAlertTriangle
  },
  tabs: {
    left: fiChevronLeft,
    right: fiChevronRight,
    up: fiChevronUp,
    down: fiChevronDown
  },
  table: {
    arrowUp: fiArrowUp,
    warning: fiAlertTriangle,
    firstPage: fiSkipBack,
    prevPage: fiChevronsLeft,
    nextPage: fiChevronsRight,
    lastPage: fiSkipForward
  },
  tree: {
    icon: fiPlay
  },
  uploader: {
    done: fiCheck,
    clear: fiX,
    add: fiPlusCircle,
    upload: fiUploadCloud,
    removeQueue: fiTrash,
    removeUploaded: fiCheckCircle
  }
}
