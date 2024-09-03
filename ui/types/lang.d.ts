import { StringDictionary } from "./ts-helpers";

/*
  `QuasarLanguageCodes` is a discriminated union of available languages iso codes.
  That list is generated at build-time based on `lang/index.json`
    (itself generated at build time, but before TS typings).
  We need its reference to be defined **before** build-time because
    it's used by the framework configuration.
  This empty interface is filled at build-time thanks to interface merging,
    it allows `QuasarLanguageCodes` to exist (with value `never`) before build
    and to have the right value when referenced by the end-user.
*/
export interface QuasarLanguageCodesHolder {}

export type QuasarLanguageCodes = keyof QuasarLanguageCodesHolder;

type QuasarLanguageGeneralLabel =
  | "clear"
  | "ok"
  | "cancel"
  | "close"
  | "set"
  | "select"
  | "reset"
  | "remove"
  | "update"
  | "create"
  | "search"
  | "filter"
  | "refresh";
type QuasarLanguageTableLabel =
  | "noData"
  | "noResults"
  | "loading"
  | "recordsPerPage"
  | "allRows"
  | "columns";
type QuasarLanguageEditorLabel =
  | "url"
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
  | "heading1"
  | "heading2"
  | "heading3"
  | "heading4"
  | "heading5"
  | "heading6"
  | "paragraph"
  | "code"
  | "size1"
  | "size2"
  | "size3"
  | "size4"
  | "size5"
  | "size6"
  | "size7"
  | "defaultFont"
  | "viewSource";

type QuasarLanguageTreeLabel = "noNodes" | "noResults";
type QuasarLanguageDayTuple = [
  string,
  string,
  string,
  string,
  string,
  string,
  string,
];
type QuasarLanguageMonthTuple = [
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
];

export interface QuasarLanguage {
  isoName: string;
  nativeName: string;
  rtl?: boolean;
  label: StringDictionary<QuasarLanguageGeneralLabel>;
  date: {
    days: QuasarLanguageDayTuple;
    daysShort: QuasarLanguageDayTuple;
    months: QuasarLanguageMonthTuple;
    monthsShort: QuasarLanguageMonthTuple;
    firstDayOfWeek: number;
    format24h: boolean;
    headerTitle?: (
      date: Date,
      model: { year: number; month: number; day: number },
    ) => string;
  };
  table: StringDictionary<QuasarLanguageTableLabel> & {
    selectedRecords: (rows: number) => string;
    pagination: (start: number, end: number, total: number) => string;
  };
  editor: StringDictionary<QuasarLanguageEditorLabel>;
  tree: StringDictionary<QuasarLanguageTreeLabel>;
}
