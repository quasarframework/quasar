interface DateOptions {
  milliseconds?: number;
  seconds?: number;
  minutes?: number;
  hours?: number;
}

export interface BuildDateOptions extends DateOptions {
  date?: number;
  month?: number;
  year?: number;
}
export interface ModifyDateOptions extends DateOptions {
  days?: number;
  months?: number;
  years?: number;
}

export interface DateLocale {
  days?: string[];
  daysShort?: string[];
  months?: string[];
  monthsShort?: string[];
}

export type DateUnitOptions = "second" | "minute" | "hour" | "day" | "month" | "year";

export namespace date {
  function isValid(date: number | string): boolean;
  function extractDate(str: string, mask: string, locale?: DateLocale): Date;
  function buildDate(options: BuildDateOptions, utc?: boolean): Date;
  function getDayOfWeek(date: Date): number;
  function getWeekOfYear(date: Date | number | string): number;
  function isBetweenDates(date: Date | number | string, from: Date | number | string, to: Date | number | string, opts?: { inclusiveFrom: boolean; inclusiveTo: boolean; onlyDate: boolean }): boolean;
  function addToDate(date: Date | number | string, options: ModifyDateOptions): Date;
  function subtractFromDate(date: Date | number | string, options: ModifyDateOptions): Date;
  function adjustDate(date: Date | number | string, options: BuildDateOptions, utc?: boolean): Date;
  function startOfDate(date: Date | number | string, option: DateUnitOptions, utc?: boolean): Date;
  function endOfDate(date: Date | number | string, option: DateUnitOptions, utc?: boolean): Date;
  function getMaxDate(date: Date | number | string, ...args: (Date | number | string)[]): Date;
  function getMinDate(date: Date | number | string, ...args: (Date | number | string)[]): Date;
  // TODO: (Qv3) uniform "unit" to `DateUnitOptions` interface
  function getDateDiff(date: Date | number | string, subtract: Date | number | string, unit?: `${DateUnitOptions}s`): number;
  function getDayOfYear(date: Date | number | string): number;
  function inferDateFormat(date: Date | number | string): "date" | "number" | "string";
  function getDateBetween(date: Date | number | string, min?: Date | number | string, max?: Date | number | string): Date;
  function isSameDate(date: Date | number | string, date2: Date | number | string, unit?: DateUnitOptions): boolean;
  function daysInMonth(date: Date | number | string): number;
  function formatDate(date: Date | number | string | undefined, format?: string, locale?: DateLocale, __forcedYear?: number, __forcedTimezoneOffset?: number): string;
  function clone<D extends Date | number | string>(date: D): D;
}
