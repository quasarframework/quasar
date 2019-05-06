export interface BuildDateOptions {
  milliseconds?: number;
  seconds?: number;
  minutes?: number;
  hours?: number;
  date?: number;
  month?: number;
  year?: number;
}
export interface ModifyDateOptions {
  milliseconds?: number;
  seconds?: number;
  minutes?: number;
  hours?: number;
  days?: number;
  month?: number;
  year?: number;
}

export interface I18nDateOptions {
  dayNames: string[];
  monthNames: string[];
}

export interface DateValues {
  year: number;
  month: number;
  day: number;
  value: number;
}

export interface TimeValues {
  hour: number;
  minute: number;
  second: number;
}

export type DateUnitOptions = "second" | "minute" | "hour" | "day" | "month" | "year";

export namespace date {
  function isValid(date: string): boolean;
  function splitDate(date: string) : DateValues;
  function splitTime(time: string) : TimeValues;
  function buildDate(options: BuildDateOptions, utc?: boolean): string;
  function getDayOfWeek(date: Date | number | string | number): number;
  function getWeekOfYear (date: Date | number | string) : number;
  function isBetweenDates (date: Date | number | string, from: Date, to: Date, opts? : { inclusiveFrom: boolean, inclusiveTo: boolean}) : boolean;
  function addToDate(date: Date | number | string, options: ModifyDateOptions): Date;
  function subtractFromDate(date: Date | number | string, options: ModifyDateOptions): Date;
  function adjustDate (date: Date | number | string, options: ModifyDateOptions, utc?: boolean) : Date;
  function startOfDate(date: Date | number | string, option: DateUnitOptions) : Date;
  function endOfDate(date: Date | number | string, option: DateUnitOptions) : Date;
  function getMaxDate (date: Date | number | string, ...args: (Date | number | string)[]) : Date;
  function getMinDate (date: Date | number | string, ...args: (Date | number | string)[]) : Date;
  function getDateDiff (date: Date | number | string, subtract: Date | number | string, unit?: string) : Date;
  function getDayOfYear (date: Date | number | string) : number;
  // function inferDateFormat (example: any) : string;
  // function convertDateToFormat (date: Date, type, format)
  function getDateBetween (date: Date | number | string, min: Date | number | string, max: Date | number | string) : Date
  function isSameDate (date: Date | number | string, date2: Date | number | string, unit?: string) : boolean;
  function daysInMonth (date: Date | number | string) : number;
  function formatDate(date: Date | number | undefined, format: string, i18n?: I18nDateOptions): string;
  function clone (date: Date) : Date;
}