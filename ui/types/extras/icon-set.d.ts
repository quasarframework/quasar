import { StringDictionary } from "../ts-helpers";

type QuasarIconSetType = "positive" | "negative" | "info" | "warning";
type QuasarIconSetArrow = "up" | "right" | "down" | "left" | "dropdown";
type QuasarIconSetChevron = "left" | "right";
type QuasarIconSetColorPicker = "spectrum" | "tune" | "palette";
type QuasarIconSetPullToRefresh = "icon";
type QuasarIconSetCarousel =
  | "left"
  | "right"
  | "up"
  | "down"
  | "navigationIcon";
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
type QuasarIconSetTable =
  | "arrowUp"
  | "warning"
  | "firstPage"
  | "prevPage"
  | "nextPage"
  | "lastPage";
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
  | "bootstrap-icons"
  | "eva-icons"
  | "fontawesome-v5"
  | "fontawesome-v5-pro"
  | "fontawesome-v6"
  | "fontawesome-v6-pro"
  | "ionicons-v4"
  | "line-awesome"
  | "material-icons"
  | "material-icons-outlined"
  | "material-icons-round"
  | "material-icons-sharp"
  | "material-symbols-outlined"
  | "material-symbols-rounded"
  | "material-symbols-sharp"
  | "mdi-v3"
  | "mdi-v4"
  | "mdi-v5"
  | "mdi-v6"
  | "mdi-v7"
  | "themify"
  | "svg-bootstrap-icons"
  | "svg-eva-icons"
  | "svg-fontawesome-v5"
  | "svg-fontawesome-v6"
  | "svg-ionicons-v4"
  | "svg-ionicons-v5"
  | "svg-ionicons-v6"
  | "svg-line-awesome"
  | "svg-material-icons"
  | "svg-material-icons-outlined"
  | "svg-material-icons-round"
  | "svg-material-icons-sharp"
  | "svg-material-symbols-outlined"
  | "svg-material-symbols-rounded"
  | "svg-material-symbols-sharp"
  | "svg-mdi-v4"
  | "svg-mdi-v5"
  | "svg-mdi-v6"
  | "svg-mdi-v7"
  | "svg-themify";
