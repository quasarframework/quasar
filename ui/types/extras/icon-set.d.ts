import { StringDictionary } from "../ts-helpers";

type QuasarIconSetType = "positive" | "negative" | "info" | "warning";
type QuasarIconSetArrow = "up" | "right" | "down" | "left" | "dropdown";
type QuasarIconSetChevron = "left" | "right";
type QuasarIconSetColorPicker = "spectrum" | "tune" | "palette";
type QuasarIconSetPullToRefresh = "icon";
type QuasarIconSetCarousel = "left" | "right" | "up" | "down" | "navigationIcon";
type QuasarIconSetChip = "remove" | "selected";
type QuasarIconSetDatetime = "arrowLeft" | "arrowRight" | "now" | "today";
type QuasarIconSetEditor =
  | "bold"
  | "italic"
  | "strikethrough"
  | "underline"
  | "unorderedList"
  | "orderedList"
  | "subscript"
  | "superscript"
  | "hyperlink"
  | "toggleFullscreen"
  | "quote"
  | "left"
  | "center"
  | "right"
  | "justify"
  | "print"
  | "outdent"
  | "indent"
  | "removeFormat"
  | "formatting"
  | "fontSize"
  | "align"
  | "hr"
  | "undo"
  | "redo"
  | "heading"
  | "heading1"
  | "heading2"
  | "heading3"
  | "heading4"
  | "heading5"
  | "heading6"
  | "code"
  | "size"
  | "size1"
  | "size2"
  | "size3"
  | "size4"
  | "size5"
  | "size6"
  | "size7"
  | "font"
  | "viewSource";
type QuasarIconSetExpansionItem = "icon" | "denseIcon";
type QuasarIconSetFab = "icon" | "activeIcon";
type QuasarIconSetField = "clear" | "error";
type QuasarIconSetPagination = "first" | "prev" | "next" | "last";
type QuasarIconSetRating = "icon";
type QuasarIconSetStepper = "done" | "active" | "error";
type QuasarIconSetTabs = "left" | "right" | "up" | "down";
type QuasarIconSetTable = "arrowUp" | "warning" | "firstPage" | "prevPage" | "nextPage" | "lastPage";
type QuasarIconSetTree = "icon";
type QuasarIconSetUploader =
  | "done"
  | "clear"
  | "add"
  | "upload"
  | "removeQueue"
  | "removeUploaded";

export interface QuasarIconSet {
  name: string;
  type: StringDictionary<QuasarIconSetType>;
  arrow: StringDictionary<QuasarIconSetArrow>;
  chevron: StringDictionary<QuasarIconSetChevron>;
  colorPicker: StringDictionary<QuasarIconSetColorPicker>;
  pullToRefresh: StringDictionary<QuasarIconSetPullToRefresh>;
  carousel: StringDictionary<QuasarIconSetCarousel>;
  chip: StringDictionary<QuasarIconSetChip>;
  datetime: StringDictionary<QuasarIconSetDatetime>;
  editor: StringDictionary<QuasarIconSetEditor>;
  expansionItem: StringDictionary<QuasarIconSetExpansionItem>;
  fab: StringDictionary<QuasarIconSetFab>;
  field: StringDictionary<QuasarIconSetField>;
  pagination: StringDictionary<QuasarIconSetPagination>;
  rating: StringDictionary<QuasarIconSetRating>;
  stepper: StringDictionary<QuasarIconSetStepper>;
  tabs: StringDictionary<QuasarIconSetTabs>;
  table: StringDictionary<QuasarIconSetTable>;
  tree: StringDictionary<QuasarIconSetTree>;
  uploader: StringDictionary<QuasarIconSetUploader>;
}

export type QuasarIconSets =
  | "material-icons"
  | "svg-material-icons"
  | "material-icons-outlined"
  | "svg-material-icons-outlined"
  | "material-icons-round"
  | "svg-material-icons-round"
  | "material-icons-sharp"
  | "svg-material-icons-sharp"
  | "mdi-v5"
  | "svg-mdi-v5"
  | "mdi-v4"
  | "svg-mdi-v4"
  | "mdi-v3"
  | "fontawesome-v5"
  | "svg-fontawesome-v5"
  | "svg-ionicons-v5"
  | "ionicons-v4"
  | "svg-ionicons-v4"
  | "eva-icons"
  | "svg-eva-icons"
  | "themify"
  | "svg-themify"
  | "line-awesome"
  | "svg-line-awesome"
  | "bootstrap-icons"
  | "svg-bootstrap-icons";
